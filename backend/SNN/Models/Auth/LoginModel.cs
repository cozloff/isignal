using System.ComponentModel.DataAnnotations;

namespace SNN.Models;

public class LoginModel
{
    [EmailAddress]
    [Required(ErrorMessage = "The email address is required")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [DataType(DataType.Password)]
    public required string Password { get; set; }

}
