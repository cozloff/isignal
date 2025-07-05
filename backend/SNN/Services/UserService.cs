using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using FluentResults;
using System.Security.Claims;
using SNN.Errors;
using SNN.Models;



namespace SNN.Services
{
    public interface IUserService
    {
        public Task<Result> UpdatePermission(string userId, string role);
        public Task<List<UserClaimsAndRoles>> GetAllUserInfo();
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

        public async Task<List<UserClaimsAndRoles>> GetAllUserInfo()
        {
            var users = await _userManager.Users
                .Select(u => new { u.Id, u.Email })
                .ToListAsync();

            var result = new List<UserClaimsAndRoles>();

            foreach (var user in users)
            {
                var identityUser = await _userManager.FindByIdAsync(user.Id);

                var claims = await _userManager.GetClaimsAsync(identityUser);
                var roles = await _userManager.GetRolesAsync(identityUser);

                var firstName = claims.FirstOrDefault(c => c.Type == "FirstName")?.Value;
                var lastName = claims.FirstOrDefault(c => c.Type == "LastName")?.Value;

                result.Add(new UserClaimsAndRoles
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = firstName,
                    LastName = lastName,
                    Roles = roles
                });
            }

            return result;
        }

        public async Task<Result> Update(string id, UserClaimsAndRoles updatedUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return new NotFoundError();

            // Update Email and sync to other columns
            user.Email = updatedUser.Email;
            user.UserName = updatedUser.Email;
            user.NormalizedEmail = _userManager.NormalizeEmail(updatedUser.Email);
            user.NormalizedUserName = _userManager.NormalizeName(updatedUser.Email);


            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(updateResult.Errors);

            // Optionally update claims
            var existingClaims = await _userManager.GetClaimsAsync(user);
            var firstNameClaim = existingClaims.FirstOrDefault(c => c.Type == "FirstName");
            var lastNameClaim = existingClaims.FirstOrDefault(c => c.Type == "LastName");

            if (firstNameClaim != null)
                await _userManager.RemoveClaimAsync(user, firstNameClaim);
            if (lastNameClaim != null)
                await _userManager.RemoveClaimAsync(user, lastNameClaim);

            if (!string.IsNullOrWhiteSpace(updatedUser.FirstName))
                await _userManager.AddClaimAsync(user, new Claim("FirstName", updatedUser.FirstName));
            if (!string.IsNullOrWhiteSpace(updatedUser.LastName))
                await _userManager.AddClaimAsync(user, new Claim("LastName", updatedUser.LastName));

            return Result.Ok();
        }

        public async Task<Result> Delete(string id)
        {
            var identityUser = await _userManager.FindByIdAsync(id);
            if (identityUser == null) return new NotFoundError();

            // Remove Claims
            var claims = await _userManager.GetClaimsAsync(identityUser);
            var res = await _userManager.RemoveClaimsAsync(identityUser, claims);

            // Remove Roles
            var roles = await _userManager.GetRolesAsync(identityUser);
            foreach (var role in roles)
            {
                await _userManager.RemoveFromRoleAsync(identityUser, role);
            }

            // Remove User
            await _userManager.DeleteAsync(identityUser);
        }

    }
}

