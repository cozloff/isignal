using Microsoft.AspNetCore.Identity;

namespace SNN.Models;

public class ApplicationIdentity : IdentityUser
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }
    public ICollection<Corporation> Corporations { get; set; }
}