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
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<ProductDto>>>> GetAll([FromQuery] ProductFilterDto filter)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            if (filter.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == filter.CategoryId);
            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice);
            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice);
            if (!string.IsNullOrEmpty(filter.StockStatus))
            {
                if (filter.StockStatus == "low")
                    query = query.Where(p => p.StockQuantity <= 10);
                else if (filter.StockStatus == "out")
                    query = query.Where(p => p.StockQuantity == 0);
                else if (filter.StockStatus == "active")
                    query = query.Where(p => p.Status == "Active");
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(p => p.Name)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    CategoryName = p.Category.Name,
                    CategoryId = p.CategoryId,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate
                })
                .ToListAsync();

            return Ok(ApiResponse<PagedResult<ProductDto>>.Ok(new PagedResult<ProductDto>
            {
                Items = items, Page = filter.Page, PageSize = filter.PageSize, TotalCount = totalCount
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(int id)
        {
            var product = await _context.Products.Include(p => p.Category).Include(p => p.Reviews)
                .ThenInclude(r => r.Customer)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
                throw new NotFoundException(nameof(Product), id);

            return Ok(ApiResponse<ProductDto>.Ok(new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryName = product.Category.Name,
                CategoryId = product.CategoryId,
                Status = product.Status,
                CreatedDate = product.CreatedDate
            }));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Create([FromBody] CreateProductDto dto)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                throw new NotFoundException(nameof(Category), dto.CategoryId);

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                CategoryId = dto.CategoryId,
                Status = "Active",
                CreatedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.ProductId },
                ApiResponse<ProductDto>.Ok(new ProductDto
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity,
                    CategoryName = category.Name,
                    CategoryId = product.CategoryId,
                    Status = product.Status,
                    CreatedDate = product.CreatedDate
                }, "Product created."));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Update(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null)
                throw new NotFoundException(nameof(Product), id);

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.CategoryId = dto.CategoryId;
            product.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(ApiResponse<ProductDto>.Ok(new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryName = product.Category?.Name ?? "",
                CategoryId = product.CategoryId,
                Status = product.Status,
                CreatedDate = product.CreatedDate
            }, "Product updated."));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                throw new NotFoundException(nameof(Product), id);

            product.Status = "Deleted";
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<object>.Ok(new { }, "Product deleted."));
        }
    }
}
