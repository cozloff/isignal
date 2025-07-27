public class UserClaimsAndRoles {
    public string UserId { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Institution { get; set; }
    public IList<string> Roles { get; set; } // comma-separated list
}
