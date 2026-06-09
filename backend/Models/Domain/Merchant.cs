namespace backend.Models.Domain
{
    public class Merchant
    {
        public int MerchantId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int CountryId { get; set; }
        public bool IsActive { get; set; } = true;

        public Country Country { get; set; } = null!;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
