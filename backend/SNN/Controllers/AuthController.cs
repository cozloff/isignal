using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SNN.Errors;
using SNN.Models;
using SNN.Services;

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly UserManager<ApplicationIdentity> _userManager;
        public AuthController(
            IAuthService authService,
            IEmailService emailService,
            UserManager<ApplicationIdentity> userManager
        )
        {
            _authService = authService;
            _emailService = emailService;
            _userManager = userManager;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await _authService.Register(model);
            
            if (result.IsSuccess)
            {
                var (user, token) = result.Value;
                var confirmationLink = Url.Action(
                    "ConfirmEmail", "Auth", new { userId = user.Id, token }, Request.Scheme
                );

                await _emailService.SendEmail(new Message
                {
                    To = new List<string> { user.Email },
                    Subject = "Confirm your email",
                    Content = $"Please confirm your account: <a href='{confirmationLink}'>link</a>"
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
                return Ok(new { message = "Email confirmed successfully." });
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
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                EmailNotConfirmedError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
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

    }
}
