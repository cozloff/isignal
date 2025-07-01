using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SNN.Models
{
    public class Corporation
    {
        [Key]
        public int CorporationId { get; set; }

        [Required]
        public string CorporationName { get; set; }

        [Required]
        public string Industry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual ApplicationIdentity User { get; set; }

        [Required]
        public string UserId { get; set; }
    }
}
