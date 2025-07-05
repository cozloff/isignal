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
        : base("Invalid Token"){}
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
        public string _entityName { get; }
        public EmailAlreadyExistError(string entityName)
            : base($"'{entityName}' already exist")
        {
            _entityName = entityName;
        }
    }
 
    public class RegistrationFailedError : Error
    {
        public string _entityName { get; }
        public RegistrationFailedError(string entityName)
            : base($"Failed to register user '{entityName}'")
        {
            _entityName = entityName;
        }
    }

    public class EmailNotConfirmedError : Error
    {
        public string Email { get; }

        public EmailNotConfirmedError(string email)
            : base($"Email '{email}' has not been confirmed.")
        {
            Email = email;
        }
    }


}