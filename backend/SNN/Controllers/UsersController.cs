using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
            _userManager = userManager;
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
            var userInfo = await _userService.GetAllUserInfo();
            return Ok(userInfo);
        }

        // READ ONE
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var identityUser = await _userManager.FindByIdAsync(id);
            if (identityUser == null) return NotFound();
            return Ok(identityUser);
        }

        // READ BY EMAIL
        [HttpGet("find-by-email/{email}")]
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

            var result = await _userService.Update(id, updatedUser);

            if (result.IsSuccess) return NoContent();
            
            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var result = _userService.Delete(id);

            if (result.IsSuccess) return Ok();

            var error = result.Errors.First();
            return error switch
            {
                NotFoundError => Problem(detail: error.Message, statusCode: StatusCodes.Status400BadRequest),
                _ => throw new Exception(result.ToString())
            };
        }

    }
}