using backend.Models.DTOs;
using backend.Models.Enums;

namespace backend.Services
{
    public interface IOrderService
    {
        Task<PagedResult<OrderDto>> GetOrdersAsync(int page, int pageSize, OrderStatus? status = null, int? customerId = null);
        Task<OrderDto> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);
        Task<OrderDto> UpdateOrderStatusAsync(int id, UpdateOrderStatusDto dto);
        Task CancelOrderAsync(int id);
    }
}
