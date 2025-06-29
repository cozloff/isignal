// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// namespace SNN.Models
// {
//     public class Corporation
//     {
//         [Key]
//         public int Id { get; set; }

//         [Required]
//         public string CorporationName { get; set; }

//         [Required]
//         public string Industry { get; set; } = "General";

//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

//         [Required]
//         public string UserId { get; set; }
//         public virtual ApplicationUser User { get; set; } = null!;
//     }
// }
