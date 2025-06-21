using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
//using System.IdentityModel.Tokens.Jwt;

namespace SNN.Services;

public interface ITokenProvider
{
    public string Create(IdentityUser identityUser, IList<Claim> claims, IList<string> roles);
    public string CreateRefreshToken();
    public Task<TokenValidationResult> ValidateToken(string jwtToken);
}
public class TokenProvider(IConfiguration configuration) : ITokenProvider
{

    public string Create(IdentityUser identityUser, IList<Claim> claims, IList<string> roles)
    {
        string secretKey = configuration["Jwt:Secret"]!;
        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(secretKey));

        SigningCredentials credentials = new(securityKey, SecurityAlgorithms.HmacSha256);
        Claim instititution = claims.FirstOrDefault(n => n.Type == "Institution");

        var authClaims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, identityUser.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, identityUser.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var userRole in roles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        foreach (var claim in claims)
        {
            authClaims.Add(new Claim(claim.Type, claim.Value));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(authClaims),
            Expires = DateTime.UtcNow.AddMinutes(configuration.GetValue<int>("Jwt:TokenExpirationInMinutes")),
            SigningCredentials = credentials,
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"]
        };

        JsonWebTokenHandler handler = new();
        return handler.CreateToken(tokenDescriptor);
    }

    public string CreateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
        }
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<TokenValidationResult> ValidateToken(string jwtToken)
    {
        string secretKey = configuration["Jwt:Secret"]!;
        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(secretKey));
        var validationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = securityKey,
            ValidIssuer = configuration["Jwt:Issuer"] ?? "",
            ValidAudience = configuration["Jwt:Audience"] ?? "",
        };
        JsonWebTokenHandler handler = new();

        return await handler.ValidateTokenAsync(jwtToken, validationParameters);
    }
}