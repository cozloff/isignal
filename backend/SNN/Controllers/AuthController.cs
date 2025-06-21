using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Post([FromBody] RegisterModel model)
        {
            var result = await _authService.Register(model);
            if (result.IsSuccess) return NoContent();

            var error = result.Errors.First();
            return error switch
            {
                EmailAlreadyExistError => Problem(detail: error.Message, statusCode: StatusCodes.Status409Conflict),
                RegistrationFailedError => Problem(detail: error.Message, statusCode: StatusCodes.Status417ExpectationFailed),
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
