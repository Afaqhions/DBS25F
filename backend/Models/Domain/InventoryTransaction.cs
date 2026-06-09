using backend.Models.Enums;

namespace backend.Models.Domain
{
    public class InventoryTransaction
    {
        public int TransactionId { get; set; }
        public int ProductId { get; set; }
        public int? SupplierId { get; set; }
        public TransactionType TransactionType { get; set; }
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        public string Remarks { get; set; } = string.Empty;

        public Product Product { get; set; } = null!;
        public Supplier? Supplier { get; set; }
    }
}
