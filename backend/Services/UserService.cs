using backend.Data;
using backend.Helpers;
using backend.Middleware;
using backend.Models.Domain;
using backend.Models.DTOs;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly ILogger<UserService> _logger;

        public UserService(AppDbContext context, JwtHelper jwtHelper, ILogger<UserService> logger)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _logger = logger;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for {Email}", dto.Email);
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Account is disabled.");

            var token = _jwtHelper.GenerateToken(user);

            _logger.LogInformation("User logged in: {Email}", dto.Email);

            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponseDto?> GetCurrentUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            return new AuthResponseDto
            {
                Token = string.Empty,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }
    }
}
