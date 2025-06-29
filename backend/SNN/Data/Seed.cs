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
        public Seed(IAuthService authService)
        {
            _authService = authService;
        }

        public static async Task SeedTables(DbContext context, bool _, CancellationToken ct)
        {
            // List<Employee> fakeEmployees = await SeedUsersAsync();
            // await context.Set<Employee>().AddRangeAsync(fakeEmployees, ct);
            // await context.SaveChangesAsync(ct);
        }

        public async Task SeedUsersAsync()
        {
            var faker = new Bogus.Faker();

            for (int i = 0; i < 100; i++)
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

                if (result.IsFailed)
                {
                    Console.WriteLine($"Failed to register: {model.Email}");
                }
            }
        }
    }
}