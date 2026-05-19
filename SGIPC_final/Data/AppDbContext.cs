using Microsoft.EntityFrameworkCore;
using SGIPC_final.Models;

namespace SGIPC_final.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<AppUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).HasMaxLength(150).IsRequired();
                entity.Property(e => e.FullName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Role).HasMaxLength(20).HasDefaultValue("User");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            });

            // Seed the default Admin account (password: Admin@1234)
            modelBuilder.Entity<AppUser>().HasData(new AppUser
            {
                Id = 1,
                FullName = "SGIPC Admin",
                Email = "admin@sgipc.kuet.ac.bd",
                // BCrypt hash of "Admin@1234"
                PasswordHash = "$2a$11$7V8TMiTHXf9Nuwr1zh009O7elj8OfqAl4l99qjG/qp8GePl8VmXsG",
                Role = "Admin",
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true
            });
        }
    }
}
