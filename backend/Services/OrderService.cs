using backend.Data;
using backend.Middleware;
using backend.Models.Domain;
using backend.Models.DTOs;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderService> _logger;

        public OrderService(AppDbContext context, ILogger<OrderService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PagedResult<OrderDto>> GetOrdersAsync(int page, int pageSize, OrderStatus? status = null, int? customerId = null)
        {
            var query = _context.Orders
                .Include(o => o.Customer).ThenInclude(c => c.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            if (customerId.HasValue)
                query = query.Where(o => o.CustomerId == customerId.Value);

            var totalCount = await query.CountAsync();

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = orders.Select(o => MapToDto(o)).ToList();

            return new PagedResult<OrderDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<OrderDto> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer).ThenInclude(c => c.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                throw new NotFoundException(nameof(Order), id);

            return MapToDto(order);
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            if (dto.Items == null || dto.Items.Count == 0)
                throw new ValidationException(new List<string> { "Order must have at least one item." });

            var customer = await _context.Customers.FindAsync(dto.CustomerId)
                ?? throw new NotFoundException(nameof(Customer), dto.CustomerId);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = new Order
                {
                    CustomerId = dto.CustomerId,
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    PaymentMethod = dto.PaymentMethod,
                    TotalAmount = 0
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                decimal totalAmount = 0;

                foreach (var itemDto in dto.Items)
                {
                    var product = await _context.Products.FindAsync(itemDto.ProductId)
                        ?? throw new NotFoundException(nameof(Product), itemDto.ProductId);

                    if (itemDto.Quantity < 50)
                        throw new BusinessRuleException($"Minimum order quantity is 50. Product '{product.Name}' has requested quantity of {itemDto.Quantity}.");

                    if (product.StockQuantity < itemDto.Quantity)
                        throw new BusinessRuleException($"Insufficient stock for product '{product.Name}'. Available: {product.StockQuantity}, requested: {itemDto.Quantity}");

                    var subtotal = product.Price * itemDto.Quantity;
                    totalAmount += subtotal;

                    var orderItem = new OrderItem
                    {
                        OrderId = order.OrderId,
                        ProductId = itemDto.ProductId,
                        Quantity = itemDto.Quantity,
                        UnitPrice = product.Price,
                        Subtotal = subtotal
                    };

                    _context.OrderItems.Add(orderItem);
                    product.StockQuantity -= itemDto.Quantity;
                }

                order.TotalAmount = totalAmount;

                if (!string.IsNullOrEmpty(dto.PaymentMethod))
                {
                    var payment = new Payment
                    {
                        OrderId = order.OrderId,
                        Amount = totalAmount,
                        PaymentDate = DateTime.UtcNow,
                        TransactionReference = $"TXN-{order.OrderId}-{DateTime.UtcNow:yyyyMMddHHmmss}"
                    };
                    _context.Payments.Add(payment);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Order {OrderId} created for customer {CustomerId}", order.OrderId, dto.CustomerId);

                return await GetOrderByIdAsync(order.OrderId);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(int id, UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.Customer).ThenInclude(c => c.User)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                throw new NotFoundException(nameof(Order), id);

            if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.Delivered)
                throw new BusinessRuleException($"Cannot update status of a {order.Status} order.");

            var oldStatus = order.Status;
            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Order {OrderId} status changed from {OldStatus} to {NewStatus}", id, oldStatus, dto.Status);

            return MapToDto(order);
        }

        public async Task CancelOrderAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                throw new NotFoundException(nameof(Order), id);

            if (order.Status == OrderStatus.Delivered)
                throw new BusinessRuleException("Cannot cancel a delivered order.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                order.Status = OrderStatus.Cancelled;
                order.IsDeleted = true;

                foreach (var item in order.OrderItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += item.Quantity;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Order {OrderId} cancelled", id);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static OrderDto MapToDto(Order order) => new()
        {
            OrderId = order.OrderId,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer?.FullName ?? "",
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString(),
            PaymentMethod = order.PaymentMethod,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "",
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                Subtotal = oi.Subtotal
            }).ToList()
        };
    }
}
