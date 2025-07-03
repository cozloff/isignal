using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Bogus;
using Bogus.DataSets;
using Bogus.Extensions.UnitedStates;
using SNN.Models;
using SNN.Services;
using SNN.Migrations;


namespace SNN.Data.Seed
{
    public class Seed
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        private readonly UserManager<ApplicationIdentity> _userManager;

        public Seed(
            IAuthService authService,
            ApplicationDbContext context,
            UserManager<ApplicationIdentity> userManager
        )
        {
            _authService = authService;
            _context = context;
            _userManager = userManager; 
        }

        public async Task SeedTablesAsync(CancellationToken ct)
        {
            var userIds = await SeedUsersAsync(ct);
            var corporations = SeedCorporations(userIds);

            await SeedSuperUserAsync(ct);

            await _context.Corporations.AddRangeAsync(corporations, ct);
            await _context.SaveChangesAsync(ct);
        }

        private async Task<List<string>> SeedUsersAsync(CancellationToken ct)
        {
            var faker = new Faker();
            var userIds = new List<string>();

            for (int i = 0; i < 50; i++)
            {
                var model = new RegisterModel
                {
                    Email = faker.Internet.Email(),
                    Password = "password",
                    ConfirmPassword = "password",
                    FirstName = faker.Name.FirstName(),
                    LastName = faker.Name.LastName(),
                    Institution = faker.Company.CompanyName(),
                    Phone = faker.Phone.PhoneNumber("##########"), // 10-digit numeric string
                    Title = faker.Name.JobTitle(),
                    WorkStreetAddress = faker.Address.StreetAddress(),
                    WorkCity = faker.Address.City(),
                    WorkState = faker.Address.StateAbbr(),
                    WorkZip = faker.Address.ZipCode("#####") // 5-digit ZIP
                };

                var result = await _authService.Register(model);

                if (result.IsSuccess)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email, ct);
                    if (user != null)
                        userIds.Add(user.Id);
                }
                else
                {
                    Console.WriteLine($"Failed to register: {model.Email}");
                }
            }

            return userIds;
        }

        private async Task SeedSuperUserAsync(CancellationToken ct)
        {
            var model = new RegisterModel
            {
                Email = "super@gmail.com",
                Password = "password",
                ConfirmPassword = "password",
                FirstName = "Super",
                LastName = "Man",
                Institution = "Google",
                Phone = "5555555555",
                Title = "Super Hero",
                WorkStreetAddress = "1st Street",
                WorkCity = "New York",
                WorkState = "New York",
                WorkZip = "55555"
            };

            var registration = await _authService.Register(model);
            if (!registration.IsSuccess) return;

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return;

            var roles = new[] { "Base", "General", "Admin", "Developer" };
            foreach (var role in roles)
            {
                await _userManager.AddToRoleAsync(user, role);
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            await _userManager.ConfirmEmailAsync(user, token);
        }


        private List<Corporation> SeedCorporations(List<string> userIds)
        {
            var industries = new[] { "Mine", "Manufacture", "Design", "Cloud", "Software" };

            var faker = new Faker<Corporation>()
                .RuleFor(c => c.CorporationName, f => f.Company.CompanyName())
                .RuleFor(c => c.Industry, f => f.PickRandom(industries))
                .RuleFor(c => c.CreatedAt, f => DateTime.SpecifyKind(f.Date.Past(2), DateTimeKind.Utc))
                .RuleFor(c => c.UserId, f => f.PickRandom(userIds));

            return faker.Generate(100);
        }

    }
}
