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
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<CustomerDto>>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Customers.Include(c => c.User).AsQueryable();
            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(c => c.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Address = c.Address,
                    DateOfBirth = c.DateOfBirth,
                    LoyaltyPoints = c.LoyaltyPoints,
                    Email = c.User.Email,
                    Username = c.User.Username
                })
                .ToListAsync();

            return Ok(ApiResponse<PagedResult<CustomerDto>>.Ok(new PagedResult<CustomerDto>
            {
                Items = items, Page = page, PageSize = pageSize, TotalCount = totalCount
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> GetById(int id)
        {
            var customer = await _context.Customers.Include(c => c.User).Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.CustomerId == id);

            if (customer == null)
                throw new NotFoundException(nameof(Customer), id);

            return Ok(ApiResponse<CustomerDto>.Ok(new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Address = customer.Address,
                DateOfBirth = customer.DateOfBirth,
                LoyaltyPoints = customer.LoyaltyPoints,
                Email = customer.User.Email,
                Username = customer.User.Username
            }));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> Create([FromBody] CreateCustomerDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new BusinessRuleException("Email already in use.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Models.Enums.UserRole.Customer,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var customer = new Customer
            {
                UserId = user.UserId,
                FullName = dto.FullName,
                Phone = dto.Phone,
                Address = dto.Address,
                DateOfBirth = dto.DateOfBirth
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = customer.CustomerId },
                ApiResponse<CustomerDto>.Ok(new CustomerDto
                {
                    CustomerId = customer.CustomerId,
                    FullName = customer.FullName,
                    Phone = customer.Phone,
                    Address = customer.Address,
                    DateOfBirth = customer.DateOfBirth,
                    Email = user.Email,
                    Username = user.Username
                }, "Customer created."));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> Update(int id, [FromBody] UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.Include(c => c.User).FirstOrDefaultAsync(c => c.CustomerId == id);
            if (customer == null)
                throw new NotFoundException(nameof(Customer), id);

            customer.FullName = dto.FullName;
            customer.Phone = dto.Phone;
            customer.Address = dto.Address;
            customer.DateOfBirth = dto.DateOfBirth;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<CustomerDto>.Ok(new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Address = customer.Address,
                DateOfBirth = customer.DateOfBirth,
                Email = customer.User.Email,
                Username = customer.User.Username
            }, "Customer updated."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var customer = await _context.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.CustomerId == id);
            if (customer == null)
                throw new NotFoundException(nameof(Customer), id);

            customer.IsDeleted = true;
            var user = await _context.Users.FindAsync(customer.UserId);
            if (user != null) user.IsActive = false;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.Ok(new { }, "Customer soft deleted."));
        }
    }
}
