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
            var topProducts = new List<TopProductDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "CALL usp_GetTopSellingProducts(@p0, @p1, @p2)";
                
                var pTopN = command.CreateParameter();
                pTopN.ParameterName = "@p0";
                pTopN.Value = topN;
                command.Parameters.Add(pTopN);

                var pStartDate = command.CreateParameter();
                pStartDate.ParameterName = "@p1";
                pStartDate.Value = startDate;
                command.Parameters.Add(pStartDate);

                var pEndDate = command.CreateParameter();
                pEndDate.ParameterName = "@p2";
                pEndDate.Value = endDate;
                command.Parameters.Add(pEndDate);

                _context.Database.OpenConnection();
                using var result = await command.ExecuteReaderAsync();
                while (await result.ReadAsync())
                {
                    topProducts.Add(new TopProductDto
                    {
                        ProductId = result.GetInt32(0),
                        ProductName = result.GetString(1),
                        CategoryName = result.IsDBNull(2) ? "" : result.GetString(2),
                        TotalQuantity = Convert.ToInt32(result.GetValue(3)),
                        TotalRevenue = result.GetDecimal(4)
                    });
                }
            }

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
            var products = await _context.VwProductInventoryStatuses.ToListAsync();

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
                            table.Cell().Text(p.ProductName);
                            table.Cell().Text(p.CategoryName ?? "");
                            table.Cell().Text(p.StockQuantity.ToString()).AlignRight();
                            table.Cell().Text(p.StockLevel);
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
            var suppliers = await _context.VwSupplierPerformances.ToListAsync();

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
                            table.Cell().Text(s.ContactPerson ?? "");
                            table.Cell().Text(s.TotalTransactions.ToString()).AlignRight();
                            table.Cell().Text(s.TotalUnitsSupplied.ToString()).AlignRight();
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

        private class MonthlyTrendItem
        {
            public int Month { get; set; }
            public int TotalOrders { get; set; }
            public decimal TotalRevenue { get; set; }
        }

        public async Task<ReportResponseDto> GenerateMonthlyTrendsReportAsync(int year)
        {
            var data = new List<MonthlyTrendItem>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "CALL usp_GenerateMonthlySalesReport(@p0, @p1)";
                
                var pYear = command.CreateParameter();
                pYear.ParameterName = "@p0";
                pYear.Value = year;
                command.Parameters.Add(pYear);

                for (int m = 1; m <= 12; m++)
                {
                    var pMonth = command.CreateParameter();
                    pMonth.ParameterName = "@p1";
                    pMonth.Value = m;
                    
                    if (command.Parameters.Count == 1) command.Parameters.Add(pMonth);
                    else command.Parameters[1] = pMonth;

                    _context.Database.OpenConnection();
                    using var result = await command.ExecuteReaderAsync();
                    if (await result.ReadAsync())
                    {
                        data.Add(new MonthlyTrendItem {
                            Month = result.GetInt32(1),
                            TotalOrders = result.GetInt32(2),
                            TotalRevenue = result.GetDecimal(3)
                        });
                    }
                }
            }

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
                            table.Cell().Text(d.TotalOrders.ToString()).AlignRight();
                            table.Cell().Text(d.TotalRevenue.ToString("C2")).AlignRight();
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

        public async Task<object> GetMonthlySalesJsonAsync(int year)
        {
            var data = new List<object>();
            var monthNames = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
            
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "CALL usp_GenerateMonthlySalesReport(@p0, @p1)";
                
                var pYear = command.CreateParameter();
                pYear.ParameterName = "@p0";
                pYear.Value = year;
                command.Parameters.Add(pYear);

                for (int m = 1; m <= 6; m++) // Dashboard only needs Jan-Jun per frontend code (or 12)
                {
                    var pMonth = command.CreateParameter();
                    pMonth.ParameterName = "@p1";
                    pMonth.Value = m;
                    if (command.Parameters.Contains("@p1"))
                        command.Parameters["@p1"].Value = m;
                    else
                        command.Parameters.Add(pMonth);

                    if (command.Connection.State != System.Data.ConnectionState.Open)
                        await command.Connection.OpenAsync();

                    decimal totalRev = 0;
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            totalRev = reader.IsDBNull(3) ? 0 : reader.GetDecimal(3);
                        }
                    }
                    data.Add(new { month = monthNames[m - 1], sales = totalRev });
                }
            }
            return data;
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
