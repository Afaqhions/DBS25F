namespace backend.Models.DTOs
{
    public class CountryDto
    {
        public int CountryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Continent { get; set; }
        public string Currency { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateCountryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Continent { get; set; }
        public string Currency { get; set; } = string.Empty;
    }

    public class UpdateCountryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Continent { get; set; }
        public string Currency { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
