using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;

namespace SNN.Models
{
    public class RegisterInternalModel
    {
        [EmailAddress]
        [Required(ErrorMessage = "The email address is required")]
        public required string Email { get; set; }
        
        [Required(ErrorMessage = "First name is required")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public required string LastName { get; set; }
    }
}
