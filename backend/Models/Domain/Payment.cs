namespace backend.Models.Domain
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string TransactionReference { get; set; } = string.Empty;

        public Order Order { get; set; } = null!;
    }
}
