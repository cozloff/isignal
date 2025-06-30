using Bogus;
using Bogus.DataSets;
using Bogus.Extensions.UnitedStates;
using SNN.Models;
using SNN.Services;
using SNN.Migrations;
using Microsoft.EntityFrameworkCore;

namespace SNN.Data.Seed
{
    public class Seed
    {
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;

        public Seed(IAuthService authService, ApplicationDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        public async Task SeedTablesAsync(CancellationToken ct)
        {
            var userIds = await SeedUsersAsync(ct);
            var corporations = SeedCorporations(userIds);

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
                    Phone = faker.Phone.PhoneNumber()
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

        private List<Corporation> SeedCorporations(List<string> userIds)
        {
            var industries = new[] { "Tech", "Finance", "Healthcare", "Retail", "Energy" };

            var faker = new Faker<Corporation>()
                .RuleFor(c => c.CorporationName, f => f.Company.CompanyName())
                .RuleFor(c => c.Industry, f => f.PickRandom(industries))
                .RuleFor(c => c.CreatedAt, f => DateTime.SpecifyKind(f.Date.Past(2), DateTimeKind.Utc))
                .RuleFor(c => c.UserId, f => f.PickRandom(userIds));

            return faker.Generate(100);
        }

    }
}
