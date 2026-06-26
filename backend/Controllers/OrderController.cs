using backend.Models.DTOs;
using backend.Models.Enums;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService) => _orderService = orderService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<OrderDto>>>> GetAll(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10,
            [FromQuery] OrderStatus? status = null, [FromQuery] int? customerId = null)
        {
            var result = await _orderService.GetOrdersAsync(page, pageSize, status, customerId);
            return Ok(ApiResponse<PagedResult<OrderDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<OrderDto>>> GetById(int id)
        {
            var result = await _orderService.GetOrderByIdAsync(id);
            return Ok(ApiResponse<OrderDto>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<OrderDto>>> Create([FromBody] CreateOrderDto dto)
        {
            var result = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.OrderId },
                ApiResponse<OrderDto>.Ok(result, "Order created."));
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<ApiResponse<OrderDto>>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var result = await _orderService.UpdateOrderStatusAsync(id, dto);
            return Ok(ApiResponse<OrderDto>.Ok(result, "Order status updated."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Cancel(int id)
        {
            await _orderService.CancelOrderAsync(id);
            return Ok(ApiResponse<object>.Ok(new { }, "Order cancelled."));
        }
    }
}
