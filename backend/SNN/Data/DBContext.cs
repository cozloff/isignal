using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SNN.Models;

namespace SNN.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationIdentity>
    {
        public DbSet<ApplicationIdentity> ApplicationIdentities { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationIdentity>().ToTable("Users");
        }
    }
}
