namespace SGIPC_final.Models
{
    public class HomeViewModel
    {
        public List<ActivityModel> Activities { get; set; } = new();
        public List<StatModel> Stats { get; set; } = new();
        public List<string> Features { get; set; } = new();
        public JoinViewModel JoinForm { get; set; } = new();
    }
}
