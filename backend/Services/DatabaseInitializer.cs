using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class DatabaseInitializer
    {
        private readonly AppDbContext _context;

        public DatabaseInitializer(AppDbContext context)
        {
            _context = context;
        }

        public async Task InitializeAsync()
        {
            var sqlDir = Path.Combine(Directory.GetCurrentDirectory(), "SQL");

            await RunScriptsAsync(Path.Combine(sqlDir, "Views"));
            await RunScriptsAsync(Path.Combine(sqlDir, "StoredProcedures"));
            await RunScriptsAsync(Path.Combine(sqlDir, "Triggers"));
        }

        private async Task RunScriptsAsync(string folderPath)
        {
            if (!Directory.Exists(folderPath)) return;

            foreach (var file in Directory.GetFiles(folderPath, "*.sql"))
            {
                var script = await File.ReadAllTextAsync(file);
                if (string.IsNullOrWhiteSpace(script)) continue;

                try
                {
                    await _context.Database.ExecuteSqlRawAsync(script);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Script {file}: {ex.Message}");
                }
            }
        }
    }
}
