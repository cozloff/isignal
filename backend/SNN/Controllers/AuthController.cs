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
    [Authorize(Roles = "Developer")]
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
        [AllowAnonymous]
        public async Task<IActionResult> Post([FromBody] RegisterModel model)
        {
            var result = await _authService.Register(model);

            if (result.IsSuccess)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action(
                    "ConfirmEmail", "Auth", new { userId = user.Id, token }, Request.Scheme
                );
                var message = new Message
                {
                    To = new List<string> { user.Email },
                    Subject = "Confirm your email",
                    Content = $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>link</a>"
                };

                await _emailService.SendEmail(message);

                return Ok(new { message = "Registration successful. Confirmation email sent." });
            }

            var error = result.Errors.First();
            return error switch
            {
                EmailAlreadyExistError => Problem(detail: error.Message, statusCode: StatusCodes.Status409Conflict),
                RegistrationFailedError => Problem(detail: error.Message, statusCode: StatusCodes.Status417ExpectationFailed),
                _ => throw new Exception(result.ToString())
            };

        }

        [HttpGet("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            try
            {
                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                    return Problem(detail: "Invalid token or user ID", statusCode: StatusCodes.Status400BadRequest);

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Problem(detail: "User not found", statusCode: StatusCodes.Status404NotFound);

                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded)
                    return Problem(detail: "Error confirming your email", statusCode: StatusCodes.Status400BadRequest);

                return Ok(new { message = "Email confirmed successfully." });
            }
            catch (Exception ex)
            {
                return Problem(detail: ex.Message, statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Problem(detail: "User not found", statusCode: StatusCodes.Status400BadRequest);
            }

            if (!user.EmailConfirmed)
            {
                return Problem(detail: "Email is not confirmed", statusCode: StatusCodes.Status403Forbidden);
            }
            
            var result = await _authService.Login(model.Email, model.Password);
            if (result.IsSuccess) return base.Ok(result.Value);

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
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
