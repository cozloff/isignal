using MimeKit;

namespace SNN.Models
{
    public class Message
    {
        public List<string> To { get; set; } = new();
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
