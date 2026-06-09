namespace backend.Models.Domain
{
    public class Country
    {
        public int CountryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Continent { get; set; }
        public string Currency { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Merchant> Merchants { get; set; } = new List<Merchant>();
    }
}
