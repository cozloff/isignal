using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SNN.Errors;
using SNN.Models;
using SNN.Services;
using SNN.Dtos;
using FluentResults;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly EmailConfiguration _emailConfig;
        private UserManager<ApplicationIdentity> _userManager;
        public AuthController(
            IAuthService authService,
            IEmailService emailService,
            EmailConfiguration emailConfig,
            UserManager<ApplicationIdentity> userManager
        )
        {
            _authService = authService;
            _emailService = emailService;
            _emailConfig = emailConfig;
            _userManager = userManager;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await _authService.Register(model);

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

                return Ok(new { message = "Registration successful. Confirmation email sent." });
            }

            var error = result.Errors.First();
            return error switch
            {
                EmailAlreadyExistError => Conflict(error.Message),
                RegistrationFailedError => StatusCode(417, error.Message),
                _ => Problem("Unknown error")
            };
        }

        [HttpGet("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var result = await _authService.ConfirmEmail(userId, token);

            if (result.IsSuccess)
            {
                var redirectUrl = $"{_emailConfig.Redirect.TrimEnd('/')}/login";
                return Redirect(redirectUrl);
            }

            var error = result.Errors.First();
            return error switch
            {
                InvalidToken => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                _ => throw new Exception(result.ToString())
            };
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _authService.Login(model.Email, model.Password);
            if (result.IsSuccess) return base.Ok(result.Value);

            var error = result.Errors.First();
            return error switch
            {
                IncorrectEmail => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                IncorrectPassword => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                EmailNotConfirmedError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
        }


        [HttpPost("internal-login/{email}")]
        [Authorize(AuthenticationSchemes = "AzureAd")]
        public async Task<IActionResult> LoginInternal([FromRoute] string email)
        {
            var result = await _authService.LoginInternal(email);
            if (result.IsSuccess)
                return base.Ok(result.Value);

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };

        }

        [HttpPost("register-internal")]
        [Authorize(AuthenticationSchemes = "AzureAd")]
        public async Task<IActionResult> RegisterInternal([FromBody] RegisterInternalModel model)
        {
            var result = await _authService.RegisterInternalUser(model);

            if (result.IsSuccess)
            {
                return Ok(new { message = "Registration successful. Email Confirmed" });
            }

            var error = result.Errors.First();
            return error switch
            {
                EmailAlreadyExistError => Conflict(error.Message),
                RegistrationFailedError => StatusCode(417, error.Message),
                _ => Problem("Unknown error")
            };
        }

        [HttpGet("user-provisioned/{email}")]
        [Authorize(AuthenticationSchemes = "AzureAd")]
        public async Task<IActionResult> IsUserProvisioned([FromRoute] string email)
        {
            var isProvisioned = await _authService.IsUserProvisioned(email);
            return Ok(isProvisioned);
        }

        [HttpDelete("logout")]
        public async Task<IActionResult> Logout()
        {
            throw new NotImplementedException();

        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken(JwtResponse model)
        {
            var result = await _authService.RefreshToken(model);

            if (result.IsSuccess) return base.Ok(result.Value);

            var error = result.Errors.First();
            return error switch
            {
                InvalidToken => Problem(detail: error.Message, statusCode: StatusCodes.Status401Unauthorized),
                _ => throw new Exception(result.ToString())
            };


        }

        // TODO: Add logging with userId
        [HttpPost("attestation")]
        [Authorize(
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
            Roles = "Developer, SystemAdmin, RegistryPreparer, SearchAdmin, Searcher, Base"
        )]
        public async Task<IActionResult> Attestation([FromBody] Attestation attestation)
        {
            switch (attestation.Response)
            {
                case "yes":
                    return Ok("yes");
                case "no":
                    return Ok("no");
                default:
                    return Problem(detail: "Invalid response", statusCode: StatusCodes.Status400BadRequest);
            }
        }
        
        [HttpPost("forgot-password/{email}")]
        public async Task<IActionResult> ForgotPassword([FromRoute] string email)
        {
            var result = await _authService.ForgotPassword(email);
            if (result.IsFailed)
                return result.Errors.First() switch
                {
                    IncorrectEmail => NotFound(result.Errors.First().Message),
                    _ => Problem("Unknown error")
                };

            var resetUrl = result.Value;
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "Emails", "ResetPasswordTemplate.html");
            var templateContent = await System.IO.File.ReadAllTextAsync(templatePath);
            var emailHtml = templateContent
                .Replace("{{resetLink}}", resetUrl)
                .Replace("{{year}}", DateTime.UtcNow.Year.ToString());

            var user = await _userManager.FindByEmailAsync(email);
            await _emailService.SendEmail(new Message
            {
                To = new List<string> { user!.Email ?? "" },
                Subject = "Reset your password",
                Content = emailHtml,
            });

            return Ok(new { message = "Password reset email sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _authService.ResetPassword(dto);
            if (result.IsFailed)
                return BadRequest(result.Errors.Select(e => e.Message));

            return Ok("Password has been reset.");
        }
    }
}
