namespace backend.Models.Domain.Views
{
    public class VwActiveCustomer
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Address { get; set; }
        public int LoyaltyPoints { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class VwMonthlySalesSummary
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalOrders { get; set; }
        public int UniqueCustomers { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AvgOrderValue { get; set; }
    }

    public class VwProductInventoryStatus
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public string AvailabilityStatus { get; set; } = string.Empty;
        public string StockLevel { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class VwSupplierPerformance
    {
        public int SupplierId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string Email { get; set; } = string.Empty;
        public int TotalTransactions { get; set; }
        public int TotalUnitsSupplied { get; set; }
        public int ProductsSupplied { get; set; }
        public DateTime? LastSupplyDate { get; set; }
    }

    public class VwTopProductsByRevenue
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }
}
