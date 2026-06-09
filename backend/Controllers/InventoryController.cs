using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService) => _inventoryService = inventoryService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<InventoryTransactionDto>>>> GetAll(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? productId = null)
        {
            var result = await _inventoryService.GetTransactionsAsync(page, pageSize, productId);
            return Ok(ApiResponse<PagedResult<InventoryTransactionDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InventoryTransactionDto>>> GetById(int id)
        {
            var result = await _inventoryService.GetTransactionByIdAsync(id);
            return Ok(ApiResponse<InventoryTransactionDto>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<InventoryTransactionDto>>> Create([FromBody] CreateInventoryTransactionDto dto)
        {
            var result = await _inventoryService.CreateTransactionAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.TransactionId },
                ApiResponse<InventoryTransactionDto>.Ok(result, "Transaction created."));
        }
    }
}
