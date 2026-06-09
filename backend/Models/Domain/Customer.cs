namespace backend.Models.Domain
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public int LoyaltyPoints { get; set; } = 0;
        public bool IsDeleted { get; set; } = false;

        public User User { get; set; } = null!;
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
