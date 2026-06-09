namespace backend.Models.Domain
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; } = DateTime.UtcNow;

        public Product Product { get; set; } = null!;
        public Customer Customer { get; set; } = null!;
    }
}
