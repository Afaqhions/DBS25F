using backend.Models.DTOs;

namespace backend.Services
{
    public interface IInventoryService
    {
        Task<PagedResult<InventoryTransactionDto>> GetTransactionsAsync(int page, int pageSize, int? productId = null);
        Task<InventoryTransactionDto> CreateTransactionAsync(CreateInventoryTransactionDto dto);
        Task<InventoryTransactionDto> GetTransactionByIdAsync(int id);
    }
}
