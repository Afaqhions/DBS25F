using backend.Models.Enums;

namespace backend.Models.DTOs
{
    public class InventoryTransactionDto
    {
        public int TransactionId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int? SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public string TransactionType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    public class CreateInventoryTransactionDto
    {
        public int ProductId { get; set; }
        public int? SupplierId { get; set; }
        public TransactionType TransactionType { get; set; }
        public int Quantity { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }
}
