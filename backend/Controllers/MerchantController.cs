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
    public class MerchantsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MerchantsController(AppDbContext context) => _context = context;

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<MerchantDto>>>> GetAll()
        {
            var merchants = await _context.Merchants
                .Include(m => m.Country)
                .Select(m => new MerchantDto
                {
                    MerchantId = m.MerchantId,
                    CompanyName = m.CompanyName,
                    ContactPerson = m.ContactPerson,
                    Email = m.Email,
                    Phone = m.Phone,
                    CountryId = m.CountryId,
                    CountryName = m.Country.Name,
                    IsActive = m.IsActive
                })
                .ToListAsync();
            return Ok(ApiResponse<List<MerchantDto>>.Ok(merchants));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<MerchantDto>>> GetById(int id)
        {
            var merchant = await _context.Merchants.Include(m => m.Country).FirstOrDefaultAsync(m => m.MerchantId == id);
            if (merchant == null) throw new NotFoundException(nameof(Merchant), id);
            return Ok(ApiResponse<MerchantDto>.Ok(new MerchantDto
            {
                MerchantId = merchant.MerchantId,
                CompanyName = merchant.CompanyName,
                ContactPerson = merchant.ContactPerson,
                Email = merchant.Email,
                Phone = merchant.Phone,
                CountryId = merchant.CountryId,
                CountryName = merchant.Country.Name,
                IsActive = merchant.IsActive
            }));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<MerchantDto>>> Create([FromBody] CreateMerchantDto dto)
        {
            var country = await _context.Countries.FindAsync(dto.CountryId);
            if (country == null) throw new NotFoundException(nameof(Country), dto.CountryId);
            if (country.Name.Equals("India", StringComparison.OrdinalIgnoreCase))
                throw new BusinessRuleException("Merchants from India are currently not allowed.");

            var merchant = new Merchant
            {
                CompanyName = dto.CompanyName,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                CountryId = dto.CountryId
            };
            _context.Merchants.Add(merchant);
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<MerchantDto>.Ok(
                new MerchantDto
                {
                    MerchantId = merchant.MerchantId,
                    CompanyName = merchant.CompanyName,
                    ContactPerson = merchant.ContactPerson,
                    Email = merchant.Email,
                    Phone = merchant.Phone,
                    CountryId = merchant.CountryId,
                    CountryName = country.Name,
                    IsActive = merchant.IsActive
                }, "Merchant created."));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<MerchantDto>>> Update(int id, [FromBody] UpdateMerchantDto dto)
        {
            var merchant = await _context.Merchants.Include(m => m.Country).FirstOrDefaultAsync(m => m.MerchantId == id);
            if (merchant == null) throw new NotFoundException(nameof(Merchant), id);

            var country = await _context.Countries.FindAsync(dto.CountryId);
            if (country == null) throw new NotFoundException(nameof(Country), dto.CountryId);
            if (country.Name.Equals("India", StringComparison.OrdinalIgnoreCase))
                throw new BusinessRuleException("Merchants from India are currently not allowed.");

            merchant.CompanyName = dto.CompanyName;
            merchant.ContactPerson = dto.ContactPerson;
            merchant.Email = dto.Email;
            merchant.Phone = dto.Phone;
            merchant.CountryId = dto.CountryId;
            merchant.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<MerchantDto>.Ok(new MerchantDto
            {
                MerchantId = merchant.MerchantId,
                CompanyName = merchant.CompanyName,
                ContactPerson = merchant.ContactPerson,
                Email = merchant.Email,
                Phone = merchant.Phone,
                CountryId = merchant.CountryId,
                CountryName = country.Name,
                IsActive = merchant.IsActive
            }, "Merchant updated."));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var merchant = await _context.Merchants.FindAsync(id);
            if (merchant == null) throw new NotFoundException(nameof(Merchant), id);
            merchant.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(ApiResponse<object>.Ok(new { }, "Merchant deactivated."));
        }
    }
}
