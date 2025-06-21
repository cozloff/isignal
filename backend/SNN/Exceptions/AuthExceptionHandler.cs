using System.Security.Authentication;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SNN.Exceptions
{
    public class AuthExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            int status = exception switch
            {
                UnauthorizedAccessException => StatusCodes.Status403Forbidden,
                AuthenticationException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };

            httpContext.Response.StatusCode = status;

            var problemDetails = new ProblemDetails
            {
                Status = status,
                Title = "An Error occurred",
                Type = exception.GetType().Name,
                Detail = exception.Message
            };

            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true;


        }
    }
}