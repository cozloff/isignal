using FluentResults;
using Microsoft.AspNetCore.Identity;
using SNN.Errors;
using SNN.Models;
using System.Security.Claims;

namespace SNN.Services
{
    public interface IUserService
    {
        public Task<Result> UpdatePermission(string userId, string role);
    }

    public class UserService : IUserService
    {
        private UserManager<ApplicationIdentity> _userManager;
        public UserService(UserManager<ApplicationIdentity> userManager)
        { 
            _userManager = userManager;
        }

        public async Task<Result> UpdatePermission(string userId, string role)
        {

            // Check if user exists
            var identityUser = await _userManager.FindByIdAsync(userId);
            if (identityUser is null)
                return new NotFoundError(userId);

            var userRoles = await _userManager.GetRolesAsync(identityUser);
            if (userRoles.Contains(role))
                return new RoleAlreadyExist(role, identityUser.Id);

            // TODO: Make sure that roles exist to be able to add
            foreach (var identityRole in userRoles)
            {
                await _userManager.RemoveFromRoleAsync(identityUser, identityRole);
            }
            await _userManager.AddToRoleAsync(identityUser, role);
            await _userManager.UpdateAsync(identityUser);

            return Result.Ok();
        }

    }
}

