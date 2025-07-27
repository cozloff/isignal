namespace SNN.Models
{
    public class EmailConfiguration
    {
        public string From { get; set; } = null!;
        public string SmtpServer { get; set; } = null!;
        public int Port { get; set; }
        public string UserName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public required string Link { get; set; }
        public required string Redirect { get; set; }
    }
}