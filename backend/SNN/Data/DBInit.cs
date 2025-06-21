using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SNN.Data
{
    public static class DBInit
    {
        public async static Task DBInitAsync(IServiceProvider serviceProvider)
        {
            var appDbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            await appDbContext.Database.MigrateAsync(); // Applies all migrations

            var roles = new[] { "Developer", "Admin", "General", "Base" };
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}
