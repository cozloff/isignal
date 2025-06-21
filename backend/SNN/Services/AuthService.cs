using FluentResults;
using Microsoft.AspNetCore.Identity;
using SNN.Errors;
using SNN.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace SNN.Services
{
    public interface IAuthService
    {
        public Task<Result<JwtResponse>> Register(RegisterModel model);
        public Task<Result<JwtResponse>> Login(string email, string password);
        public Task<Result<JwtResponse>> RefreshToken(JwtResponse model);
    }
    public class AuthService : IAuthService
    {
        private UserManager<ApplicationIdentity> _userManager;
        private ITokenProvider _tokenProvider;
        private IConfiguration _configuration;
        public AuthService(
            UserManager<ApplicationIdentity> userManager,
            ITokenProvider tokenProvider,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _tokenProvider = tokenProvider;
            _configuration = configuration;
        }
        public async Task<Result<JwtResponse>> Register(RegisterModel model)
        {
            ApplicationIdentity existingUser = await _userManager.FindByEmailAsync(model.Email!);
            if (existingUser != null)
                return new EmailAlreadyExistError(model.Email);

            // Create claims
            ApplicationIdentity user = new ApplicationIdentity
            {
                Email = model.Email,
                UserName = model.Email,
            };
            var result = await _userManager.CreateAsync(user, model.Password!);

            if (!result.Succeeded)
                return new RegistrationFailedError("Registration Failed");


            // Get new user and add claims
            ApplicationIdentity newUser = await _userManager.FindByEmailAsync(model.Email!);
            IList<Claim> claims = [
                new Claim("FirstName", model.FirstName),
                new Claim("LastName", model.LastName),
                new Claim("Institution", model.Institution ?? ""),
                new Claim("Phone", model.Phone ?? "")
            ];
            await _userManager.AddClaimsAsync(newUser!, claims);
            return Result.Ok();
        }

        public async Task<Result<JwtResponse>> Login(string email, string password)
        {
            ApplicationIdentity user = await _userManager.FindByEmailAsync(email);

            // Check if user is found 
            if (user is null || await _userManager.CheckPasswordAsync(user, password) == false)
                return Result.Fail(new NotFoundError(email));

            IList<Claim> claims = await _userManager.GetClaimsAsync(user);
            IList<string> roles = await _userManager.GetRolesAsync(user);

            // Generate Tokens
            var token = _tokenProvider.Create(user, claims, roles);
            var refreshToken = _tokenProvider.CreateRefreshToken();

            // Update User identity values
            user.RefreshTokenExpiry = DateTime.UtcNow.AddHours(_configuration.GetValue<int>("Jwt:RefreshTokenExpirationInHours"));
            user.RefreshToken = refreshToken;
            await _userManager.UpdateAsync(user);

            JwtResponse response = new() { JwtToken = token, RefreshToken = refreshToken };

            return Result.Ok(response);
        }
        public async Task<Result<JwtResponse>> RefreshToken(JwtResponse model)
        {
            var token = await _tokenProvider.ValidateToken(model.JwtToken);

            // Check if token is valid
            if (!token.IsValid)
                return new InvalidToken();

            // Grab JWT Registered User Claim
            Claim userClaim = token?.ClaimsIdentity?.FindFirst(JwtRegisteredClaimNames.Sub);


            var identityUser = await _userManager.FindByIdAsync(userClaim.Value);
            if (identityUser is null || identityUser.RefreshToken != model.RefreshToken || identityUser.RefreshTokenExpiry < DateTime.UtcNow)
                return new InvalidToken();


            var claims = await _userManager.GetClaimsAsync(identityUser);
            var roles = await _userManager.GetRolesAsync(identityUser);
            // Generate Tokens
            var jwtToken = _tokenProvider.Create(identityUser, claims, roles);
            var refreshToken = _tokenProvider.CreateRefreshToken();

            // Update User identity claims
            identityUser.RefreshTokenExpiry = DateTime.UtcNow.AddHours(_configuration.GetValue<int>("Jwt:RefreshTokenExpirationInHours"));
            identityUser.RefreshToken = refreshToken;
            await _userManager.UpdateAsync(identityUser);

            // Generate response objects
            JwtResponse response = new() { JwtToken = jwtToken, RefreshToken = refreshToken };
            return Result.Ok(response);
        }


    }
}
