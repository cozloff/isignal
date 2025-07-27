using FluentResults;
using Microsoft.AspNetCore.Identity;
using SNN.Errors;
using SNN.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Microsoft.Extensions.ObjectPool;

namespace SNN.Services
{
    public interface IUserService
    {
        public Task<Result> UpdatePermission(string userId, string role);
        public Task<List<UserClaimsAndRoles>> GetAllUserInfo();
        public Task<UserClaimsAndRoles> GetUserInfo(string userId);
        public Task<List<UserClaimsAndRoles>> GetAllUserInstitution(string institution);
        public Task<Result> Update(string id, UserClaimsAndRoles updatedUser);
        public Task<Result> Delete(string id);
        public Task<bool> IsUserInScope(string manager, string user);
        public Task<bool> CanUpdate(IList<string> managerRoles, IList<string> updatingRoles);
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
                var institution = claims.FirstOrDefault(c => c.Type == "Institution")?.Value;

                result.Add(new UserClaimsAndRoles
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = firstName,
                    LastName = lastName,
                    Institution = institution,
                    Roles = roles
                });
            }

            return result;
        }

        public async Task<List<UserClaimsAndRoles>> GetAllUserInstitution(string institution)
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

                var userInstitution = claims.FirstOrDefault(c => c.Type == "Institution")?.Value;

                if (userInstitution != institution) continue;

                var firstName = claims.FirstOrDefault(c => c.Type == "FirstName")?.Value;
                var lastName = claims.FirstOrDefault(c => c.Type == "LastName")?.Value;

                result.Add(new UserClaimsAndRoles
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = firstName,
                    LastName = lastName,
                    Institution = userInstitution,
                    Roles = roles
                });
            }

            return result;
        }


        public async Task<UserClaimsAndRoles> GetUserInfo(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var claims = await _userManager.GetClaimsAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            var firstName = claims.FirstOrDefault(c => c.Type == "FirstName")?.Value;
            var lastName = claims.FirstOrDefault(c => c.Type == "LastName")?.Value;
            var institution = claims.FirstOrDefault(c => c.Type == "Institution")?.Value;

            var result = new UserClaimsAndRoles
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = firstName,
                LastName = lastName,
                Institution = institution,
                Roles = roles
            };

            return result;
        }

        public async Task<Result> Update(string id, UserClaimsAndRoles updatedUser)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return new NotFoundError($"User '{id}'");

            // Update Email and sync to other columns
            user.Email = updatedUser.Email;
            user.UserName = updatedUser.Email;
            user.NormalizedEmail = _userManager.NormalizeEmail(updatedUser.Email);
            user.NormalizedUserName = _userManager.NormalizeName(updatedUser.Email);

            // Remove existing roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                    return Result.Fail("Failed to remove old roles.");
            }

            // Add new roles
            var addResult = await _userManager.AddToRolesAsync(user, updatedUser.Roles);
            if (!addResult.Succeeded)
                return Result.Fail("Failed to add new roles.");


            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return new UserUpdateFailedError(user.Email);

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
            if (identityUser == null) return new NotFoundError($"User '{id}'");

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

            return Result.Ok();
        }

        public async Task<bool> IsUserInScope(string managerId, string userId)
        {
            var manager_user = await _userManager.FindByIdAsync(managerId);
            var claims = await _userManager.GetClaimsAsync(manager_user);
            var roles = await _userManager.GetRolesAsync(manager_user);
            var institution = claims.FirstOrDefault(c => c.Type == "Institution")?.Value;

            // If you are a Developer or SystemAdmin you have access to all users
            if (roles.Contains("Developer") || roles.Contains("SystemAdmin"))
            {
                return true;
            }
            else if (roles.Contains("SearchAdmin")) // SearchAdmins only have access to institution
            {
                var managed_user = await _userManager.FindByIdAsync(userId);
                var managed_claims = await _userManager.GetClaimsAsync(managed_user);
                var managed_institution = managed_claims.FirstOrDefault(c => c.Type == "Institution")?.Value;
                if (managed_institution == institution)
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<bool> CanUpdate(IList<string> managerRoles, IList<string> updatingRoles)
        {
            // SearchAdmins can only update searchers and below
            if (
                managerRoles.Contains("SearchAdmin") &&
                !(updatingRoles.Contains("Searcher") || updatingRoles.Contains("Base"))
            )
            {
                return false;
            }

            // SystemAdmin can't update to SystemAdmin or Developer
            if (
                managerRoles.Contains("SystemAdmin") &&
                (updatingRoles.Contains("SystemAdmin") || updatingRoles.Contains("Developer"))
            )
            {
                return false;
            }

            return true;
        }
    }
}