using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SNN.Data;
using SNN.Models;
using SNN.Services;
using SNN.Errors;
using Azure;

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(
        AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
        Roles = "Developer, SystemAdmin, SearchAdmin"
    )]
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
            _userManager = userManager;
        }

        [HttpPut("update-permission/{userId}")]
        public async Task<IActionResult> UpdatePermission([FromRoute] string userId, [FromBody] RequestRole role)
        {
            // Check scope
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!await _userService.IsUserInScope(manager, userId))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            List<string> updatingRole = new() { role.Role };

            // Check updating priveleges
            var userInfo = await _userService.GetUserInfo(manager);
            if (!await _userService.CanUpdate(userInfo.Roles, updatingRole))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            var result = await _userService.UpdatePermission(userId, role.Role!);
            if (result.IsSuccess)
                return NoContent();

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                RoleAlreadyExist => Problem(detail: error.Message, statusCode: StatusCodes.Status409Conflict),
                _ => throw new Exception(result.ToString())
            };
        }

        // READ ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var manager_info = await _userService.GetUserInfo(manager);

            // Developers and SystemAdmins get all users
            if (manager_info.Roles.Contains("Developer") || manager_info.Roles.Contains("SystemAdmin"))
            {
                var allInfo = await _userService.GetAllUserInfo();
                return Ok(allInfo);
            }  

            var instInfo = await _userService.GetAllUserInstitution(manager_info.Institution);
            return Ok(instInfo);
        }

        // READ ONE
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            // Check scope
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!await _userService.IsUserInScope(manager, id))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            var identityUser = await _userManager.FindByIdAsync(id);
            if (identityUser == null) return NotFound();
            return Ok(identityUser);
        }

        // READ BY EMAIL
        [HttpGet("find-by-email/{email}")]
        [Authorize(
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
            Roles = "Developer, SystemAdmin"
        )]
        public async Task<IActionResult> GetByEmail([FromRoute] string email)
        {
            var identityUser = await _userManager.FindByEmailAsync(email);
            if (identityUser == null) return NotFound();
            return Ok(identityUser);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] UserClaimsAndRoles updatedUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check scope
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!await _userService.IsUserInScope(manager, id))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            // Check updating priveleges
            var userInfo = await _userService.GetUserInfo(manager);
            if (!await _userService.CanUpdate(userInfo.Roles, updatedUser.Roles))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            var result = await _userService.Update(id, updatedUser);

            if (result.IsSuccess) return NoContent();

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                UserUpdateFailedError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            // Check scope
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!await _userService.IsUserInScope(manager, id))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            UserClaimsAndRoles deleting = await _userService.GetUserInfo(id);

            // Check updating priveleges
            var userInfo = await _userService.GetUserInfo(manager);
            if (!await _userService.CanUpdate(userInfo.Roles, deleting.Roles))
            {
                return Problem(detail: "OUT_OF_SCOPE", statusCode: StatusCodes.Status401Unauthorized);
            }

            var result = await _userService.Delete(id);

            if (result.IsSuccess) return Ok();

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status404NotFound),
                _ => throw new Exception(result.ToString())
            };
        }

        // Test for getting requesting user's info
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var result = await _userService.GetUserInfo(userId);

            return Ok(result);
        }

    }
}