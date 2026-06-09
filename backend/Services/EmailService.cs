using System.Net;
using System.Net.Mail;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var smtpSection = _configuration.GetSection("SmtpSettings");
                var host = smtpSection["Host"];
                var port = int.Parse(smtpSection["Port"] ?? "587");
                var user = smtpSection["Username"];
                var pass = smtpSection["Password"];

                if (string.IsNullOrEmpty(host))
                {
                    _logger.LogInformation("Email not sent (SMTP not configured): To={To}, Subject={Subject}", to, subject);
                    return;
                }

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(user, pass),
                    EnableSsl = true
                };

                var message = new MailMessage(user ?? "noreply@example.com", to, subject, body) { IsBodyHtml = true };
                await client.SendMailAsync(message);

                _logger.LogInformation("Email sent to {To}: {Subject}", to, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", to);
            }
        }
    }
}
