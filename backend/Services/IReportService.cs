using backend.Models.DTOs;

namespace backend.Services
{
    public interface IReportService
    {
        Task<ReportResponseDto> GenerateSalesReportAsync(DateTime startDate, DateTime endDate);
        Task<ReportResponseDto> GenerateTopProductsReportAsync(DateTime startDate, DateTime endDate, int topN = 20);
        Task<ReportResponseDto> GenerateInventoryReportAsync();
        Task<ReportResponseDto> GenerateCustomerOrdersReportAsync(int customerId);
        Task<ReportResponseDto> GenerateSupplierPerformanceReportAsync();
        Task<ReportResponseDto> GenerateCategorySalesReportAsync(DateTime startDate, DateTime endDate);
        Task<ReportResponseDto> GenerateMonthlyTrendsReportAsync(int year);
        Task<ReportResponseDto> GenerateLowStockReportAsync(int threshold = 10);
        Task<ReportResponseDto> GenerateOrderFulfillmentReportAsync(DateTime startDate, DateTime endDate);
        Task<ReportResponseDto> GenerateRevenueByPaymentMethodReportAsync(DateTime startDate, DateTime endDate);
    }
}
