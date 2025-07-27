using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace SNN.Services
{
    public interface ILogService
    {
        void LogMessage(string message, string userId);
    }

    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;

        public LogService(ILogger<LogService> logger)
        {
            _logger = logger;
        }

        public void LogMessage(string message, string userId)
        {
            _logger.LogInformation($"User [{userId}] - {message}");
        }
    }
}