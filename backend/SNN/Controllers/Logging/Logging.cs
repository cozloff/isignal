using Microsoft.AspNetCore.Mvc;
using SNN.Models;
using SNN.Services;
using System.Security.Claims;

namespace SNN.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoggingController : ControllerBase
    {
        private readonly ILogService _logger;

        public LoggingController(ILogService logger)
        {
            _logger = logger;
        }

        [HttpGet("write")]
        public IActionResult WriteLog()
        {
            var manager = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            _logger.LogMessage("Called LogController.WriteLog endpoint.", manager);
            return Ok("Log message written");
        }
    }
}