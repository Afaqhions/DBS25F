using backend.Data;
using backend.Middleware;
using backend.Models.Domain;
using backend.Models.DTOs;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<InventoryService> _logger;

        public InventoryService(AppDbContext context, ILogger<InventoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PagedResult<InventoryTransactionDto>> GetTransactionsAsync(int page, int pageSize, int? productId = null)
        {
            var query = _context.InventoryTransactions
                .Include(it => it.Product)
                .Include(it => it.Supplier)
                .AsQueryable();

            if (productId.HasValue)
                query = query.Where(it => it.ProductId == productId.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(it => it.TransactionDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(it => new InventoryTransactionDto
                {
                    TransactionId = it.TransactionId,
                    ProductId = it.ProductId,
                    ProductName = it.Product.Name,
                    SupplierId = it.SupplierId,
                    SupplierName = it.Supplier != null ? it.Supplier.CompanyName : null,
                    TransactionType = it.TransactionType.ToString(),
                    Quantity = it.Quantity,
                    TransactionDate = it.TransactionDate,
                    Remarks = it.Remarks
                })
                .ToListAsync();

            return new PagedResult<InventoryTransactionDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<InventoryTransactionDto> CreateTransactionAsync(CreateInventoryTransactionDto dto)
        {
            var product = await _context.Products.FindAsync(dto.ProductId)
                ?? throw new NotFoundException(nameof(Product), dto.ProductId);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var invTransaction = new InventoryTransaction
                {
                    ProductId = dto.ProductId,
                    SupplierId = dto.SupplierId,
                    TransactionType = dto.TransactionType,
                    Quantity = dto.Quantity,
                    TransactionDate = DateTime.UtcNow,
                    Remarks = dto.Remarks
                };

                _context.InventoryTransactions.Add(invTransaction);

                switch (dto.TransactionType)
                {
                    case TransactionType.Purchase:
                        product.StockQuantity += dto.Quantity;
                        break;
                    case TransactionType.Sale:
                        if (product.StockQuantity < dto.Quantity)
                            throw new BusinessRuleException($"Insufficient stock for {product.Name}");
                        product.StockQuantity -= dto.Quantity;
                        break;
                    case TransactionType.Return:
                        product.StockQuantity += dto.Quantity;
                        break;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Inventory transaction {Type} for product {ProductId} qty {Quantity}",
                    dto.TransactionType, dto.ProductId, dto.Quantity);

                return new InventoryTransactionDto
                {
                    TransactionId = invTransaction.TransactionId,
                    ProductId = invTransaction.ProductId,
                    ProductName = product.Name,
                    SupplierId = invTransaction.SupplierId,
                    TransactionType = invTransaction.TransactionType.ToString(),
                    Quantity = invTransaction.Quantity,
                    TransactionDate = invTransaction.TransactionDate,
                    Remarks = invTransaction.Remarks
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<InventoryTransactionDto> GetTransactionByIdAsync(int id)
        {
            var it = await _context.InventoryTransactions
                .Include(x => x.Product)
                .Include(x => x.Supplier)
                .FirstOrDefaultAsync(x => x.TransactionId == id);

            if (it == null)
                throw new NotFoundException(nameof(InventoryTransaction), id);

            return new InventoryTransactionDto
            {
                TransactionId = it.TransactionId,
                ProductId = it.ProductId,
                ProductName = it.Product.Name,
                SupplierId = it.SupplierId,
                SupplierName = it.Supplier?.CompanyName,
                TransactionType = it.TransactionType.ToString(),
                Quantity = it.Quantity,
                TransactionDate = it.TransactionDate,
                Remarks = it.Remarks
            };
        }
    }
}
