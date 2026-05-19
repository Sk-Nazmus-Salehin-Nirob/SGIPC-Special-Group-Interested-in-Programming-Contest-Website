using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGIPC_final.Data;
using SGIPC_final.Models;

namespace SGIPC_final.Controllers
{
    public class AuthController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ILogger<AuthController> _logger;

        private const string SessionUserId   = "UserId";
        private const string SessionUserName = "UserName";
        private const string SessionUserRole = "UserRole";

        public AuthController(AppDbContext db, ILogger<AuthController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ─────────────────────────────────────────────
        //  GET /Auth/Login?role=User  (default)
        //  GET /Auth/Login?role=Admin
        // ─────────────────────────────────────────────
        [HttpGet]
        public IActionResult Login(string role = "User")
        {
            if (IsAuthenticated()) return RedirectToDashboard();
            return View(new LoginViewModel { Role = role });
        }

        // ─────────────────────────────────────────────
        //  POST /Auth/Login
        // ─────────────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.IsActive);

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            // Verify role matches what the tab requested
            if (model.Role == "Admin" && user.Role != "Admin")
            {
                ModelState.AddModelError(string.Empty, "This account does not have admin privileges.");
                return View(model);
            }

            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            // Create session
            HttpContext.Session.SetInt32(SessionUserId, user.Id);
            HttpContext.Session.SetString(SessionUserName, user.FullName);
            HttpContext.Session.SetString(SessionUserRole, user.Role);

            _logger.LogInformation("User {Email} ({Role}) logged in.", user.Email, user.Role);

            return RedirectToDashboard();
        }

        // ─────────────────────────────────────────────
        //  GET /Auth/Register
        // ─────────────────────────────────────────────
        [HttpGet]
        public IActionResult Register()
        {
            if (IsAuthenticated()) return RedirectToDashboard();
            return View(new RegisterViewModel());
        }

        // ─────────────────────────────────────────────
        //  POST /Auth/Register
        // ─────────────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            // Check duplicate email
            if (await _db.Users.AnyAsync(u => u.Email == model.Email))
            {
                ModelState.AddModelError("Email", "An account with this email already exists.");
                return View(model);
            }

            var user = new AppUser
            {
                FullName     = model.FullName,
                Email        = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Role         = "User",
                CreatedAt    = DateTime.UtcNow,
                IsActive     = true
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // Auto-login after registration
            HttpContext.Session.SetInt32(SessionUserId, user.Id);
            HttpContext.Session.SetString(SessionUserName, user.FullName);
            HttpContext.Session.SetString(SessionUserRole, user.Role);

            _logger.LogInformation("New user registered: {Email}", user.Email);

            TempData["RegisterSuccess"] = "Welcome to SGIPC KUET, " + user.FullName + "!";
            return RedirectToAction(nameof(UserDashboard));
        }

        // ─────────────────────────────────────────────
        //  GET /Auth/UserDashboard
        // ─────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> UserDashboard()
        {
            if (!IsAuthenticated()) return RedirectToAction(nameof(Login));
            if (GetSessionRole() == "Admin") return RedirectToAction("Dashboard", "Admin");

            var user = await _db.Users.FindAsync(GetSessionUserId());
            if (user == null) return RedirectToAction(nameof(Logout));

            return View(user);
        }

        // ─────────────────────────────────────────────
        //  POST /Auth/Logout
        // ─────────────────────────────────────────────
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        // ─────────────────────────────────────────────
        //  Helpers
        // ─────────────────────────────────────────────
        private bool IsAuthenticated() =>
            HttpContext.Session.GetInt32(SessionUserId).HasValue;

        private string GetSessionRole() =>
            HttpContext.Session.GetString(SessionUserRole) ?? string.Empty;

        private int GetSessionUserId() =>
            HttpContext.Session.GetInt32(SessionUserId) ?? 0;

        private IActionResult RedirectToDashboard() =>
            GetSessionRole() == "Admin"
                ? RedirectToAction("Dashboard", "Admin")
                : RedirectToAction(nameof(UserDashboard));
    }
}
