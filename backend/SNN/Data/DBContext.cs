using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SNN.Models;

namespace SNN.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationIdentity>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<ApplicationIdentity> ApplicationIdentities { get; set; }
        public DbSet<Corporation> Corporations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationIdentity>().ToTable("Users");

            modelBuilder.Entity<ApplicationIdentity>(entity =>
            {
                entity.HasMany(a => a.Corporations);
            });

            modelBuilder.Entity<Corporation>(entity =>
            {
                entity.HasKey(c => c.CorporationId);
                entity
                    .HasOne(c => c.User)
                    .WithMany(u => u.Corporations)
                    .HasForeignKey(c => c.UserId);
            });

        }
    }
}
