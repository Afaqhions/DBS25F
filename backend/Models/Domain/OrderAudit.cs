using backend.Models.Enums;

namespace backend.Models.Domain
{
    public class OrderAudit
    {
        public int AuditId { get; set; }
        public int OrderId { get; set; }
        public OrderStatus OldStatus { get; set; }
        public OrderStatus NewStatus { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string ChangedBy { get; set; } = string.Empty;
    }
}
