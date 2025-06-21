using System.ComponentModel.DataAnnotations;

namespace SNN.Models
{
    public class RegisterModel : LoginModel
    {
        [Required(ErrorMessage = "Confirm Password required")]
        [DataType(DataType.Password)]
        [Compare("Password")]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "First name is required")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public required string LastName { get; set; }

        public string? MiddleName { get; set; }

        public string? Institution { get; set; }

        public string? Phone { get; set; }


    }
}
