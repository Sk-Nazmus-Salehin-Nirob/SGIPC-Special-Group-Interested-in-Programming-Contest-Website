using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGIPC_final.Data;

namespace SGIPC_final.Controllers
{
    public class AdminController : Controller
    {
        private readonly AppDbContext _db;

        private const string SessionUserId   = "UserId";
        private const string SessionUserRole = "UserRole";

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        // ─────────────────────────────────────────────
        //  GET /Admin/Dashboard
        // ─────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> Dashboard()
        {
            if (!IsAdmin()) return RedirectToAction("Login", "Auth", new { role = "Admin" });

            var users = await _db.Users
                .Where(u => u.Role == "User")
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            ViewBag.TotalUsers  = users.Count;
            ViewBag.ActiveUsers = users.Count(u => u.IsActive);
            ViewBag.AdminName   = HttpContext.Session.GetString("UserName");

            return View(users);
        }

        // ─────────────────────────────────────────────
        //  POST /Admin/ToggleUser/{id}
        // ─────────────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleUser(int id)
        {
            if (!IsAdmin()) return RedirectToAction("Login", "Auth", new { role = "Admin" });

            var user = await _db.Users.FindAsync(id);
            if (user != null && user.Role != "Admin")
            {
                user.IsActive = !user.IsActive;
                await _db.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Dashboard));
        }

        // ─────────────────────────────────────────────
        //  Helpers
        // ─────────────────────────────────────────────
        private bool IsAdmin() =>
            HttpContext.Session.GetString(SessionUserRole) == "Admin";
    }
}
