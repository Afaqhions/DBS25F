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
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuppliersController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<SupplierDto>>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Suppliers.AsQueryable();
            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(s => s.CompanyName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new SupplierDto
                {
                    SupplierId = s.SupplierId,
                    CompanyName = s.CompanyName,
                    ContactPerson = s.ContactPerson,
                    Email = s.Email,
                    Phone = s.Phone,
                    Address = s.Address,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(ApiResponse<PagedResult<SupplierDto>>.Ok(new PagedResult<SupplierDto>
            {
                Items = items, Page = page, PageSize = pageSize, TotalCount = totalCount
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<SupplierDto>>> GetById(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
                throw new NotFoundException(nameof(Supplier), id);

            return Ok(ApiResponse<SupplierDto>.Ok(new SupplierDto
            {
                SupplierId = supplier.SupplierId,
                CompanyName = supplier.CompanyName,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                IsActive = supplier.IsActive
            }));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<SupplierDto>>> Create([FromBody] CreateSupplierDto dto)
        {
            if (await _context.Suppliers.AnyAsync(s => s.Email == dto.Email))
                throw new BusinessRuleException("Supplier email already exists.");

            var supplier = new Supplier
            {
                CompanyName = dto.CompanyName,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                IsActive = true
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = supplier.SupplierId },
                ApiResponse<SupplierDto>.Ok(new SupplierDto
                {
                    SupplierId = supplier.SupplierId,
                    CompanyName = supplier.CompanyName,
                    ContactPerson = supplier.ContactPerson,
                    Email = supplier.Email,
                    Phone = supplier.Phone,
                    Address = supplier.Address,
                    IsActive = supplier.IsActive
                }, "Supplier created."));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<SupplierDto>>> Update(int id, [FromBody] UpdateSupplierDto dto)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
                throw new NotFoundException(nameof(Supplier), id);

            supplier.CompanyName = dto.CompanyName;
            supplier.ContactPerson = dto.ContactPerson;
            supplier.Email = dto.Email;
            supplier.Phone = dto.Phone;
            supplier.Address = dto.Address;
            supplier.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<SupplierDto>.Ok(new SupplierDto
            {
                SupplierId = supplier.SupplierId,
                CompanyName = supplier.CompanyName,
                ContactPerson = supplier.ContactPerson,
                Email = supplier.Email,
                Phone = supplier.Phone,
                Address = supplier.Address,
                IsActive = supplier.IsActive
            }, "Supplier updated."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null)
                throw new NotFoundException(nameof(Supplier), id);

            supplier.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.Ok(new { }, "Supplier deactivated."));
        }
    }
}
