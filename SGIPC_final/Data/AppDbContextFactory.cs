using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SGIPC_final.Data
{
    /// <summary>
    /// Design-time factory so "dotnet ef migrations add" works
    /// even when the live MySQL server is unavailable.
    /// The connection string here is only used at design time.
    /// </summary>
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            // Use a dummy connection string for scaffolding / migration generation
            // Pinned to MySQL 8.0 so no live server connection is needed at design time
            var connStr = "Server=localhost;Port=3306;Database=sgipc_db;User=root;Password=;SslMode=none;";
            optionsBuilder.UseMySql(connStr, new MySqlServerVersion(new Version(8, 0, 0)));
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
