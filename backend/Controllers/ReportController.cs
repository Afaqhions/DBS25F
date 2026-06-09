using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService) => _reportService = reportService;

        [HttpGet("sales/pdf")]
        public async Task<IActionResult> GetSalesReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateSalesReportAsync(startDate, endDate);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("top-products/pdf")]
        public async Task<IActionResult> GetTopProductsReport(
            [FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int topN = 20)
        {
            var report = await _reportService.GenerateTopProductsReportAsync(startDate, endDate, topN);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("inventory/pdf")]
        public async Task<IActionResult> GetInventoryReport()
        {
            var report = await _reportService.GenerateInventoryReportAsync();
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("customer-orders/pdf")]
        public async Task<IActionResult> GetCustomerOrdersReport([FromQuery] int customerId)
        {
            var report = await _reportService.GenerateCustomerOrdersReportAsync(customerId);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("supplier-performance/pdf")]
        public async Task<IActionResult> GetSupplierPerformanceReport()
        {
            var report = await _reportService.GenerateSupplierPerformanceReportAsync();
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("category-sales/pdf")]
        public async Task<IActionResult> GetCategorySalesReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateCategorySalesReportAsync(startDate, endDate);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("monthly-trends/pdf")]
        public async Task<IActionResult> GetMonthlyTrendsReport([FromQuery] int year)
        {
            var report = await _reportService.GenerateMonthlyTrendsReportAsync(year);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("low-stock/pdf")]
        public async Task<IActionResult> GetLowStockReport([FromQuery] int threshold = 10)
        {
            var report = await _reportService.GenerateLowStockReportAsync(threshold);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("order-fulfillment/pdf")]
        public async Task<IActionResult> GetOrderFulfillmentReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateOrderFulfillmentReportAsync(startDate, endDate);
            return File(report.FileContent, report.ContentType, report.FileName);
        }

        [HttpGet("revenue-by-payment/pdf")]
        public async Task<IActionResult> GetRevenueByPaymentMethodReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GenerateRevenueByPaymentMethodReportAsync(startDate, endDate);
            return File(report.FileContent, report.ContentType, report.FileName);
        }
    }
}
