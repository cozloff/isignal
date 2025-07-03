using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SNN.Data;
using SNN.Models;
using SNN.Services;
using SNN.Errors;

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Developer")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private UserManager<ApplicationIdentity> _userManager;
        public UserController(
            IUserService userService,
            UserManager<ApplicationIdentity> userManager
        )
        {
            _userService = userService;
        }

        [HttpPut("update-permission/{userId}")]
        //[AllowAnonymous] // Temporarly remove in the future
        public async Task<IActionResult> UpdatePermission([FromRoute] string userId, [FromBody] RequestRole role)
        {
            var result = await _userService.UpdatePermission(userId, role.Role!);
            if (result.IsSuccess)
                return NoContent();

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                RoleAlreadyExist => Problem(detail: error.Message, statusCode: StatusCodes.Status409Conflict),
                _ => throw new Exception(result.ToString())
            };
        }

        // READ ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = _userManager.Users;
            return Ok(users);
        }

        [HttpGet("test")]
        public async Task<IActionResult> TestTask()
        {
            return Ok("Allowed Route");
        }
    }
}