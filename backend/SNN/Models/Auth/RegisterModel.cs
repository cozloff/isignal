using System.ComponentModel.DataAnnotations;

namespace SNN.Models
{
    public class RegisterModel : LoginModel
    {
        [Required(ErrorMessage = "Confirm Password required")]
        [DataType(DataType.Password)]
        [Compare("Password")]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Institution is required")]
        public string Institution { get; set; }

        [Required(ErrorMessage = "First name is required")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        public required string LastName { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Phone is required")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Work Street Address is required")]
        public string WorkStreetAddress { get; set; }

        [Required(ErrorMessage = "Work City is required")]
        public string WorkCity { get; set; }

        [Required(ErrorMessage = "Work State is required")]
        public string WorkState { get; set; }

        [Required(ErrorMessage = "Work Zip is required")]
        public string WorkZip { get; set; }

    }
}
