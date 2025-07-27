using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SNN.Data;
using SNN.Models;
using SNN.Services;
using SNN.Errors;
using FluentResults;

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private IAuthService _authService;
        private readonly EmailConfiguration _emailConfig;
        public EmailController(
            IEmailService emailService,
            IAuthService authService,
            EmailConfiguration emailConfig
        )
        {
            _authService = authService;
            _emailService = emailService;
            _emailConfig = emailConfig;
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] Message message)
        {
            if (message == null || !message.To.Any() || string.IsNullOrEmpty(message.Subject) || string.IsNullOrEmpty(message.Content))
            {
                return BadRequest("Invalid email message.");
            }

            await _emailService.SendEmail(message);
            return Ok("Email sent successfully.");
        }

        [HttpPost("send-confirmation-email/{email}")]
        public async Task<IActionResult> SendConfirmationEmail([FromRoute] string email)
        {
            var result = await _authService.ValidateResendConfirmation(email);

            if (result.IsSuccess)
            {
                var (user, token) = result.Value;
                var rawLink = Url.Action(
                    "ConfirmEmail", "Auth", new { userId = user.Id, token }, Request.Scheme
                );

                var baseLink = _emailConfig.Link; 
                var baseHost = new Uri(baseLink);
                var originalUri = new Uri(rawLink!);

                // Replace host and port with .env
                // TODO: minh can you make it so this Uri works in prod too, thx bud
                var builder = new UriBuilder(originalUri)
                {
                    Host = baseHost.Host,
                    Port = baseHost.Port,
                    Scheme = baseHost.Scheme
                };

                var finalUri = builder.Uri.ToString();
                
                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "Emails", "ConfirmEmailTemplate.html");
                var templateContent = await System.IO.File.ReadAllTextAsync(templatePath);
                var emailHtml = templateContent
                    .Replace("{{confirmationLink}}", finalUri)
                    .Replace("{{year}}", DateTime.UtcNow.Year.ToString());
                    
                await _emailService.SendEmail(new Message
                {
                    To = new List<string> { user.Email ?? "" },
                    Subject = "Confirm your email",
                    Content = emailHtml,

                });

                return Ok(new { message = "Confirmation email sent." });
            }

            var error = result.Errors.First();
            return error switch
            {
                IncorrectEmail => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                EmailAlreadyConfirmedError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
        }
    }
}