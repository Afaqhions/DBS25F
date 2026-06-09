using backend.Models.DTOs;

namespace backend.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> GetCurrentUserAsync(int userId);
    }
}
