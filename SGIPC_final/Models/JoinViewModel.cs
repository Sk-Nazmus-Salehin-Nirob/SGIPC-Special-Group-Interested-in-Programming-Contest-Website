using System.ComponentModel.DataAnnotations;

namespace SGIPC_final.Models
{
    public class JoinViewModel
    {
        [Required(ErrorMessage = "Full name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
        [Display(Name = "Full Name")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [Display(Name = "Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please select your experience level.")]
        [Display(Name = "Experience Level")]
        public string ExperienceLevel { get; set; } = string.Empty;
    }
}
