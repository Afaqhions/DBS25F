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
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context) => _context = context;

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByProduct(int productId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Customer)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.ReviewDate)
                .Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    ProductId = r.ProductId,
                    CustomerId = r.CustomerId,
                    CustomerName = r.Customer.FullName,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return Ok(ApiResponse<List<ReviewDto>>.Ok(reviews));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> Create([FromBody] CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new ValidationException(new List<string> { "Rating must be between 1 and 5." });

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                throw new NotFoundException(nameof(Product), dto.ProductId);

            var customerId = await _context.Customers
                .Where(c => c.UserId == int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value))
                .Select(c => (int?)c.CustomerId)
                .FirstOrDefaultAsync();

            if (customerId == null)
                throw new BusinessRuleException("Customer profile not found.");

            var review = new Review
            {
                ProductId = dto.ProductId,
                CustomerId = customerId.Value,
                Rating = dto.Rating,
                Comment = dto.Comment,
                ReviewDate = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<ReviewDto>.Ok(new ReviewDto
            {
                ReviewId = review.ReviewId,
                ProductId = review.ProductId,
                CustomerId = review.CustomerId,
                Rating = review.Rating,
                Comment = review.Comment,
                ReviewDate = review.ReviewDate
            }, "Review created."));
        }
    }
}
