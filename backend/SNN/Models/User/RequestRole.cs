using System.ComponentModel.DataAnnotations;

namespace SNN.Models
{
    public class RequestRole
    {
        [Required]
        public string? Role { get; set; }
    }
}