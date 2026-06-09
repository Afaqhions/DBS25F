using backend.Data;
using backend.Models.Domain;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace backend.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<ReportResponseDto> GenerateSalesReportAsync(DateTime startDate, DateTime endDate)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status != Models.Enums.OrderStatus.Cancelled)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var totalSales = orders.Sum(o => o.TotalAmount);
            var totalOrders = orders.Count;

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text($"Sales Report ({startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd})").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2);
                            c.RelativeColumn();
                            c.RelativeColumn();
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Order ID").Bold();
                            h.Cell().Text("Date").Bold();
                            h.Cell().Text("Status").Bold();
                            h.Cell().Text("Amount").Bold().AlignRight();
                        });

                        foreach (var o in orders)
                        {
                            table.Cell().Text(o.OrderId.ToString());
                            table.Cell().Text(o.OrderDate.ToString("yyyy-MM-dd"));
                            table.Cell().Text(o.Status.ToString());
                            table.Cell().Text(o.TotalAmount.ToString("C2")).AlignRight();
                        }

                        table.Cell().Text("").BackgroundColor(Colors.Grey.Lighten2);
                        table.Cell().Text("").BackgroundColor(Colors.Grey.Lighten2);
                        table.Cell().Text("Total:").Bold().BackgroundColor(Colors.Grey.Lighten2);
                        table.Cell().Text(totalSales.ToString("C2")).Bold().AlignRight().BackgroundColor(Colors.Grey.Lighten2);
                    });

                    page.Footer().AlignCenter().Text($"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
                });
            });

            return new ReportResponseDto
            {
                FileName = $"SalesReport_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateTopProductsReportAsync(DateTime startDate, DateTime endDate, int topN = 20)
        {
            var topProducts = await _context.OrderItems
                .Include(oi => oi.Product).ThenInclude(p => p.Category)
                .Where(oi => oi.Order.OrderDate >= startDate && oi.Order.OrderDate <= endDate && oi.Order.Status != Models.Enums.OrderStatus.Cancelled)
                .GroupBy(oi => new { oi.ProductId, ProductName = oi.Product.Name, CategoryName = oi.Product.Category.Name })
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.ProductName,
                    CategoryName = g.Key.CategoryName,
                    TotalQuantity = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Subtotal)
                })
                .OrderByDescending(p => p.TotalRevenue)
                .Take(topN)
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text($"Top {topN} Products ({startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd})").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3);
                            c.RelativeColumn(2);
                            c.RelativeColumn();
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Product").Bold();
                            h.Cell().Text("Category").Bold();
                            h.Cell().Text("Qty Sold").Bold().AlignRight();
                            h.Cell().Text("Revenue").Bold().AlignRight();
                        });

                        foreach (var p in topProducts)
                        {
                            table.Cell().Text(p.ProductName);
                            table.Cell().Text(p.CategoryName);
                            table.Cell().Text(p.TotalQuantity.ToString()).AlignRight();
                            table.Cell().Text(p.TotalRevenue.ToString("C2")).AlignRight();
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = $"TopProducts_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateInventoryReportAsync()
        {
            var products = await _context.Products.Include(p => p.Category).ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text("Inventory Status Report").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3);
                            c.RelativeColumn(2);
                            c.RelativeColumn();
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Product").Bold();
                            h.Cell().Text("Category").Bold();
                            h.Cell().Text("Stock").Bold().AlignRight();
                            h.Cell().Text("Status").Bold();
                        });

                        foreach (var p in products)
                        {
                            table.Cell().Text(p.Name);
                            table.Cell().Text(p.Category?.Name ?? "");
                            table.Cell().Text(p.StockQuantity.ToString()).AlignRight();
                            table.Cell().Text(p.StockQuantity <= 10 ? "LOW STOCK" : p.Status);
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "InventoryReport.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateCustomerOrdersReportAsync(int customerId)
        {
            var customer = await _context.Customers.Include(c => c.User).FirstOrDefaultAsync(c => c.CustomerId == customerId);
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text($"Orders for {customer?.FullName ?? "Customer"}").Bold().FontSize(18);
                    page.Content().Column(col =>
                    {
                        col.Item().Text($"Customer: {customer?.FullName}");
                        col.Item().Text($"Email: {customer?.User.Email}");
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.RelativeColumn(2);
                                c.RelativeColumn();
                                c.RelativeColumn();
                            });

                            table.Header(h =>
                            {
                                h.Cell().Text("Order ID").Bold();
                                h.Cell().Text("Date").Bold();
                                h.Cell().Text("Status").Bold();
                                h.Cell().Text("Amount").Bold().AlignRight();
                            });

                            foreach (var o in orders)
                            {
                                table.Cell().Text(o.OrderId.ToString());
                                table.Cell().Text(o.OrderDate.ToString("yyyy-MM-dd"));
                                table.Cell().Text(o.Status.ToString());
                                table.Cell().Text(o.TotalAmount.ToString("C2")).AlignRight();
                            }
                        });
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = $"CustomerOrders_{customerId}.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateSupplierPerformanceReportAsync()
        {
            var suppliers = await _context.Suppliers
                .Select(s => new
                {
                    s.CompanyName,
                    s.ContactPerson,
                    s.Email,
                    OrderCount = _context.InventoryTransactions
                        .Where(it => it.SupplierId == s.SupplierId && it.TransactionType == Models.Enums.TransactionType.Purchase)
                        .Count(),
                    TotalQuantity = _context.InventoryTransactions
                        .Where(it => it.SupplierId == s.SupplierId && it.TransactionType == Models.Enums.TransactionType.Purchase)
                        .Sum(it => (int?)it.Quantity) ?? 0
                })
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text("Supplier Performance Report").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(3);
                            c.RelativeColumn(2);
                            c.RelativeColumn();
                            c.RelativeColumn();
                        });

                        table.Header(h =>
                        {
                            h.Cell().Text("Company").Bold();
                            h.Cell().Text("Contact").Bold();
                            h.Cell().Text("Orders").Bold().AlignRight();
                            h.Cell().Text("Qty Supplied").Bold().AlignRight();
                        });

                        foreach (var s in suppliers)
                        {
                            table.Cell().Text(s.CompanyName);
                            table.Cell().Text(s.ContactPerson);
                            table.Cell().Text(s.OrderCount.ToString()).AlignRight();
                            table.Cell().Text(s.TotalQuantity.ToString()).AlignRight();
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "SupplierPerformance.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateCategorySalesReportAsync(DateTime startDate, DateTime endDate)
        {
            var data = await _context.OrderItems
                .Include(oi => oi.Product).ThenInclude(p => p.Category)
                .Where(oi => oi.Order.OrderDate >= startDate && oi.Order.OrderDate <= endDate && oi.Order.Status != Models.Enums.OrderStatus.Cancelled)
                .GroupBy(oi => oi.Product.Category.Name)
                .Select(g => new { Category = g.Key, Total = g.Sum(oi => oi.Subtotal), Count = g.Sum(oi => oi.Quantity) })
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text("Category Sales Report").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(3); c.RelativeColumn(); c.RelativeColumn(); });
                        table.Header(h =>
                        {
                            h.Cell().Text("Category").Bold();
                            h.Cell().Text("Units Sold").Bold().AlignRight();
                            h.Cell().Text("Revenue").Bold().AlignRight();
                        });
                        foreach (var d in data)
                        {
                            table.Cell().Text(d.Category);
                            table.Cell().Text(d.Count.ToString()).AlignRight();
                            table.Cell().Text(d.Total.ToString("C2")).AlignRight();
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "CategorySales.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateMonthlyTrendsReportAsync(int year)
        {
            var data = await _context.Orders
                .Where(o => o.OrderDate.Year == year && o.Status != Models.Enums.OrderStatus.Cancelled)
                .GroupBy(o => o.OrderDate.Month)
                .Select(g => new { Month = g.Key, Count = g.Count(), Total = g.Sum(o => o.TotalAmount) })
                .OrderBy(g => g.Month)
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text($"Monthly Sales Trends - {year}").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(); });
                        table.Header(h =>
                        {
                            h.Cell().Text("Month").Bold();
                            h.Cell().Text("Orders").Bold().AlignRight();
                            h.Cell().Text("Sales").Bold().AlignRight();
                        });
                        foreach (var d in data)
                        {
                            var monthName = new DateTime(year, d.Month, 1).ToString("MMMM");
                            table.Cell().Text(monthName);
                            table.Cell().Text(d.Count.ToString()).AlignRight();
                            table.Cell().Text(d.Total.ToString("C2")).AlignRight();
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = $"MonthlyTrends_{year}.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateLowStockReportAsync(int threshold = 10)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.StockQuantity <= threshold)
                .OrderBy(p => p.StockQuantity)
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text($"Low Stock Report (Threshold: {threshold})").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(3); c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); });
                        table.Header(h =>
                        {
                            h.Cell().Text("Product").Bold();
                            h.Cell().Text("Category").Bold();
                            h.Cell().Text("Stock").Bold().AlignRight();
                            h.Cell().Text("Status").Bold();
                        });
                        foreach (var p in products)
                        {
                            table.Cell().Text(p.Name);
                            table.Cell().Text(p.Category?.Name ?? "");
                            table.Cell().Text(p.StockQuantity.ToString()).AlignRight();
                            table.Cell().Text(p.StockQuantity == 0 ? "OUT OF STOCK" : "LOW STOCK");
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "LowStockReport.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateOrderFulfillmentReportAsync(DateTime startDate, DateTime endDate)
        {
            var orders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var total = orders.Sum(o => o.Count);

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text("Order Fulfillment Report").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); });
                        table.Header(h =>
                        {
                            h.Cell().Text("Status").Bold();
                            h.Cell().Text("Count").Bold().AlignRight();
                            h.Cell().Text("Percentage").Bold().AlignRight();
                        });
                        foreach (var o in orders)
                        {
                            table.Cell().Text(o.Status.ToString());
                            table.Cell().Text(o.Count.ToString()).AlignRight();
                            table.Cell().Text($"{o.Count * 100.0 / total:F1}%").AlignRight();
                        }
                        table.Cell().Text("Total").Bold();
                        table.Cell().Text(total.ToString()).Bold().AlignRight();
                        table.Cell().Text("100%").Bold().AlignRight();
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "OrderFulfillment.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        public async Task<ReportResponseDto> GenerateRevenueByPaymentMethodReportAsync(DateTime startDate, DateTime endDate)
        {
            var data = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status != Models.Enums.OrderStatus.Cancelled)
                .GroupBy(o => o.PaymentMethod)
                .Select(g => new { Method = g.Key, Total = g.Sum(o => o.TotalAmount), Count = g.Count() })
                .ToListAsync();

            var pdf = CreatePdf(document =>
            {
                document.Page(page =>
                {
                    page.Header().Text("Revenue by Payment Method").Bold().FontSize(18);
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(c => { c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); });
                        table.Header(h =>
                        {
                            h.Cell().Text("Payment Method").Bold();
                            h.Cell().Text("Orders").Bold().AlignRight();
                            h.Cell().Text("Revenue").Bold().AlignRight();
                        });
                        foreach (var d in data)
                        {
                            table.Cell().Text(string.IsNullOrEmpty(d.Method) ? "N/A" : d.Method);
                            table.Cell().Text(d.Count.ToString()).AlignRight();
                            table.Cell().Text(d.Total.ToString("C2")).AlignRight();
                        }
                    });
                });
            });

            return new ReportResponseDto
            {
                FileName = "RevenueByPayment.pdf",
                FileContent = pdf,
                ContentType = "application/pdf"
            };
        }

        private static byte[] CreatePdf(Action<IDocumentContainer> configure)
        {
            var document = Document.Create(configure);
            using var stream = new MemoryStream();
            document.GeneratePdf(stream);
            return stream.ToArray();
        }
    }
}
