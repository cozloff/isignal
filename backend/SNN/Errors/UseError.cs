using FluentResults;

namespace SNN.Errors
{

    public class NotFoundError : Error
    {
        public string _entityName { get; }
        //public object _id { get; }
        public NotFoundError(string entityName)
            : base($"'{entityName}' not found")
        {
            _entityName = entityName;
            //_id = id;
        }
    }

    public class InvalidToken : Error
    {
        public InvalidToken()
        : base("Invalid Token") { }
    }

    public class RoleAlreadyExist : Error
    {
        public string _entityName { get; }
        public string _entityQuality { get; }
        public RoleAlreadyExist(string entityQuality, string entityName)
            : base($"'{entityQuality}' role already exist for user '{entityName}'")
        {
            _entityName = entityName;
            _entityQuality = entityQuality;
        }
    }

    public class EmailAlreadyExistError : Error
    {
        public string Email { get; }

        public EmailAlreadyExistError(string email)
            : base("AUTH_EMAIL_ALREADY_EXISTS")
        {
            Email = email;
        }
    }

    public class RegistrationFailedError : Error
    {
        public string _entityName { get; }
        public RegistrationFailedError(string entityName)
            : base("AUTH_REGISTRATION_FAILED")
        {
            _entityName = entityName;
        }
    }

    public class EmailNotConfirmedError : Error
    {
        public string Email { get; }

        public EmailNotConfirmedError(string email)
            : base("AUTH_EMAIL_NOT_CONFIRMED")
        {
            Email = email;
        }
    }

    public class EmailAlreadyConfirmedError : Error
    {
        public string Email { get; }

        public EmailAlreadyConfirmedError(string email)
            : base("AUTH_USER_ALREADY_CONFIRMED")
        {
            Email = email;
        }
    }

    public class UserUpdateFailedError : Error
    {
        public string Email { get; }

        public UserUpdateFailedError(string email)
            : base($"User '{email}' has not been updated.")
        {
            Email = email;
        }
    }

    public class IncorrectEmail : Error
    {
        public string Email { get; }

        public IncorrectEmail(string email)
            : base("AUTH_USER_NOT_FOUND")
        {
            Email = email;
        }
    }

    public class IncorrectPassword : Error
    {
        public string Password { get; }

        public IncorrectPassword(string password)
            : base("AUTH_INVALID_PASSWORD")
        {
            Password = password;
        }
    }
    
    public class UnexpectedError : Error
    {
        public UnexpectedError(string message) : base(message) { }
    }

}