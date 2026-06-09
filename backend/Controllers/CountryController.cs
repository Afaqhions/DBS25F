using backend.Data;
using backend.Middleware;
using backend.Models.Domain;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CountriesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CountryDto>>>> GetAll()
        {
            var countries = await _context.Countries
                .Select(c => new CountryDto
                {
                    CountryId = c.CountryId,
                    Name = c.Name,
                    Code = c.Code,
                    Continent = c.Continent,
                    Currency = c.Currency,
                    IsActive = c.IsActive
                })
                .ToListAsync();
            return Ok(ApiResponse<List<CountryDto>>.Ok(countries));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CountryDto>>> GetById(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null) throw new NotFoundException(nameof(Country), id);
            return Ok(ApiResponse<CountryDto>.Ok(new CountryDto
            {
                CountryId = country.CountryId,
                Name = country.Name,
                Code = country.Code,
                Continent = country.Continent,
                Currency = country.Currency,
                IsActive = country.IsActive
            }));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CountryDto>>> Create([FromBody] CreateCountryDto dto)
        {
            var country = new Country
            {
                Name = dto.Name,
                Code = dto.Code,
                Continent = dto.Continent,
                Currency = dto.Currency
            };
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<CountryDto>.Ok(new CountryDto
            {
                CountryId = country.CountryId,
                Name = country.Name,
                Code = country.Code,
                Continent = country.Continent,
                Currency = country.Currency,
                IsActive = country.IsActive
            }, "Country created."));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CountryDto>>> Update(int id, [FromBody] UpdateCountryDto dto)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null) throw new NotFoundException(nameof(Country), id);
            country.Name = dto.Name;
            country.Code = dto.Code;
            country.Continent = dto.Continent;
            country.Currency = dto.Currency;
            country.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<CountryDto>.Ok(new CountryDto
            {
                CountryId = country.CountryId,
                Name = country.Name,
                Code = country.Code,
                Continent = country.Continent,
                Currency = country.Currency,
                IsActive = country.IsActive
            }, "Country updated."));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var country = await _context.Countries.Include(c => c.Merchants).FirstOrDefaultAsync(c => c.CountryId == id);
            if (country == null) throw new NotFoundException(nameof(Country), id);
            if (country.Merchants.Any(m => m.IsActive))
                throw new BusinessRuleException("Cannot delete country with active merchants.");
            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(new { }, "Country deleted."));
        }
    }
}
