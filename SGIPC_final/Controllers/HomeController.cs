using Microsoft.AspNetCore.Mvc;
using SGIPC_final.Models;
using System.Diagnostics;

namespace SGIPC_final.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // GET: /Home/Index  (default route: /)
        public IActionResult Index()
        {
            var model = BuildHomeViewModel();
            return View(model);
        }

        // GET: /Home/Join
        [HttpGet]
        public IActionResult Join()
        {
            return View(new JoinViewModel());
        }

        // POST: /Home/Join
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Join(JoinViewModel model)
        {
            if (!ModelState.IsValid)
            {
                // Re-display the form with validation errors
                return View(model);
            }

            _logger.LogInformation("New join request: Name={Name}, Email={Email}, Level={Level}",
                model.FullName, model.Email, model.ExperienceLevel);

            // Pass success data to the confirmation view via TempData
            TempData["SuccessName"] = model.FullName;
            TempData["SuccessEmail"] = model.Email;

            return RedirectToAction(nameof(JoinConfirmation));
        }

        // GET: /Home/JoinConfirmation
        public IActionResult JoinConfirmation()
        {
            if (TempData["SuccessName"] == null)
            {
                return RedirectToAction(nameof(Index));
            }
            return View();
        }

        // GET: /Home/About
        public IActionResult About()
        {
            return View();
        }

        // GET: /Home/Activities
        public IActionResult Activities()
        {
            var activities = GetActivities();
            return View(activities);
        }

        // GET: /Home/Contact
        public IActionResult Contact()
        {
            return View();
        }

        // GET: /Home/Privacy
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }

        // -------------------------------------------------------
        // Private helpers – centralised data source
        // -------------------------------------------------------

        private HomeViewModel BuildHomeViewModel()
        {
            return new HomeViewModel
            {
                Activities = GetActivities(),
                Stats = GetStats(),
                Features = GetFeatures(),
                JoinForm = new JoinViewModel()
            };
        }

        private static List<ActivityModel> GetActivities()
        {
            return new List<ActivityModel>
            {
                new() { Icon = "🏆", Title = "Contests",
                    Description = "Regular competitive programming contests at multiple difficulty levels. Test your skills and climb the leaderboard." },
                new() { Icon = "📚", Title = "Workshops",
                    Description = "Interactive sessions on algorithms, data structures, and advanced programming techniques led by experienced members." },
                new() { Icon = "💡", Title = "Training",
                    Description = "Structured learning paths and mentoring programs designed to help you excel in competitive programming." }
            };
        }

        private static List<StatModel> GetStats()
        {
            return new List<StatModel>
            {
                new() { Value = "500+",  Label = "Members" },
                new() { Value = "50+",   Label = "Contests" },
                new() { Value = "1000+", Label = "Problems Solved" }
            };
        }

        private static List<string> GetFeatures()
        {
            return new List<string>
            {
                "Expert Mentorship",
                "Regular Contests",
                "Skill Development",
                "Community Support"
            };
        }
    }
}
