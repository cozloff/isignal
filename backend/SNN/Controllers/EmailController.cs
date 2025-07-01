using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SNN.Data;
using SNN.Models;
using SNN.Services;
using SNN.Errors;

namespace SNN.Controllers
{
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] Message message)
        {
            if (message == null || !message.To.Any() || string.IsNullOrEmpty(message.Subject) || string.IsNullOrEmpty(message.Content))
            {
                return BadRequest("Invalid email message.");
            }

            await _emailService.SendEmail(message);
            return Ok("Email sent successfully.");
        }
    }
}