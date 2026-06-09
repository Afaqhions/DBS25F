using backend.Models.Domain;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Supplier> Suppliers => Set<Supplier>();
        public DbSet<Merchant> Merchants => Set<Merchant>();
        public DbSet<Country> Countries => Set<Country>();
        public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<OrderAudit> OrderAudits => Set<OrderAudit>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── User ───────────────────────────────────────
            modelBuilder.Entity<User>(e =>
            {
                e.HasKey(u => u.UserId);
                e.Property(u => u.Username).IsRequired().HasMaxLength(100);
                e.Property(u => u.Email).IsRequired().HasMaxLength(200);
                e.Property(u => u.PasswordHash).IsRequired();
                e.Property(u => u.Role).HasConversion<string>().HasMaxLength(50);
                e.Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.HasIndex(u => u.Email).IsUnique();
                e.HasIndex(u => u.Username).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_User_Email", "`Email` LIKE '%_@__%.__%'"));
            });

            // ─── Customer ───────────────────────────────────
            modelBuilder.Entity<Customer>(e =>
            {
                e.HasKey(c => c.CustomerId);
                e.Property(c => c.FullName).IsRequired().HasMaxLength(100);
                e.Property(c => c.Phone).HasMaxLength(20);
                e.Property(c => c.Address).HasMaxLength(500);
                e.HasOne(c => c.User).WithOne(u => u.Customer).HasForeignKey<Customer>(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasQueryFilter(c => !c.IsDeleted);
                e.ToTable(t => t.HasCheckConstraint("CK_Customer_Age", "TIMESTAMPDIFF(YEAR, `DateOfBirth`, CURDATE()) >= 18"));
            });

            // ─── Country ────────────────────────────────────
            modelBuilder.Entity<Country>(e =>
            {
                e.HasKey(c => c.CountryId);
                e.Property(c => c.Name).IsRequired().HasMaxLength(100);
                e.Property(c => c.Code).IsRequired().HasMaxLength(10);
                e.Property(c => c.Continent).HasMaxLength(50);
                e.Property(c => c.Currency).IsRequired().HasMaxLength(50);
                e.HasIndex(c => c.Name).IsUnique();
                e.HasIndex(c => c.Code).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_Country_Required", "`Name` IS NOT NULL AND `Code` IS NOT NULL AND `Currency` IS NOT NULL"));
            });

            // ─── Merchant ───────────────────────────────────
            modelBuilder.Entity<Merchant>(e =>
            {
                e.HasKey(m => m.MerchantId);
                e.Property(m => m.CompanyName).IsRequired().HasMaxLength(200);
                e.Property(m => m.ContactPerson).HasMaxLength(100);
                e.Property(m => m.Email).IsRequired().HasMaxLength(200);
                e.Property(m => m.Phone).HasMaxLength(20);
                e.HasOne(m => m.Country).WithMany(c => c.Merchants).HasForeignKey(m => m.CountryId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasIndex(m => m.Email).IsUnique();
            });

            // ─── Category ───────────────────────────────────
            modelBuilder.Entity<Category>(e =>
            {
                e.HasKey(c => c.CategoryId);
                e.Property(c => c.Name).IsRequired().HasMaxLength(100);
                e.Property(c => c.Description).HasMaxLength(500);
                e.HasOne(c => c.ParentCategory).WithMany(c => c.SubCategories)
                    .HasForeignKey(c => c.ParentCategoryId).OnDelete(DeleteBehavior.Restrict);
            });

            // ─── Product ────────────────────────────────────
            modelBuilder.Entity<Product>(e =>
            {
                e.HasKey(p => p.ProductId);
                e.Property(p => p.Name).IsRequired().HasMaxLength(100);
                e.Property(p => p.Description).HasMaxLength(2000);
                e.Property(p => p.Price).HasColumnType("decimal(18,2)");
                e.Property(p => p.Status).HasMaxLength(50);
                e.Property(p => p.CreatedDate).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.ToTable(t => t.HasCheckConstraint("CK_Product_Price", "`Price` >= 0"));
                e.ToTable(t => t.HasCheckConstraint("CK_Product_Status", "`Status` IN ('Active','Inactive','Deleted')"));
            });

            // ─── Order ──────────────────────────────────────
            modelBuilder.Entity<Order>(e =>
            {
                e.HasKey(o => o.OrderId);
                e.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
                e.Property(o => o.Status).HasConversion<string>().HasMaxLength(50);
                e.Property(o => o.PaymentMethod).HasMaxLength(50);
                e.Property(o => o.OrderDate).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.HasOne(o => o.Customer).WithMany(c => c.Orders).HasForeignKey(o => o.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasIndex(o => o.OrderDate);
                e.HasQueryFilter(o => !o.IsDeleted);
            });

            // ─── OrderItem ──────────────────────────────────
            modelBuilder.Entity<OrderItem>(e =>
            {
                e.HasKey(oi => oi.OrderItemId);
                e.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
                e.Property(oi => oi.Subtotal).HasColumnType("decimal(18,2)");
                e.HasOne(oi => oi.Order).WithMany(o => o.OrderItems).HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(oi => oi.Product).WithMany(p => p.OrderItems).HasForeignKey(oi => oi.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasQueryFilter(oi => !oi.Order.IsDeleted);
                e.ToTable(t => t.HasCheckConstraint("CK_OrderItem_Quantity", "`Quantity` >= 50"));
            });

            // ─── Supplier ───────────────────────────────────
            modelBuilder.Entity<Supplier>(e =>
            {
                e.HasKey(s => s.SupplierId);
                e.Property(s => s.CompanyName).IsRequired().HasMaxLength(200);
                e.Property(s => s.ContactPerson).HasMaxLength(100);
                e.Property(s => s.Email).IsRequired().HasMaxLength(200);
                e.Property(s => s.Phone).HasMaxLength(20);
                e.Property(s => s.Address).HasMaxLength(500);
                e.HasIndex(s => s.Email).IsUnique();
                e.ToTable(t => t.HasCheckConstraint("CK_Supplier_Email", "`Email` LIKE '%_@__%.__%'"));
            });

            // Product-Supplier many-to-many
            modelBuilder.Entity<Product>(e =>
            {
                e.HasMany(p => p.Suppliers).WithMany(s => s.Products)
                    .UsingEntity(j => j.ToTable("ProductSuppliers"));
            });

            // Product-Merchant many-to-many
            modelBuilder.Entity<Product>(e =>
            {
                e.HasMany(p => p.Merchants).WithMany(m => m.Products)
                    .UsingEntity(j => j.ToTable("ProductMerchants"));
            });

            // ─── InventoryTransaction ────────────────────────
            modelBuilder.Entity<InventoryTransaction>(e =>
            {
                e.HasKey(it => it.TransactionId);
                e.Property(it => it.TransactionType).HasConversion<string>().HasMaxLength(50);
                e.Property(it => it.Remarks).HasMaxLength(500);
                e.Property(it => it.TransactionDate).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.HasOne(it => it.Product).WithMany(p => p.InventoryTransactions)
                    .HasForeignKey(it => it.ProductId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(it => it.Supplier).WithMany(s => s.InventoryTransactions)
                    .HasForeignKey(it => it.SupplierId).OnDelete(DeleteBehavior.SetNull);
            });

            // ─── Payment ────────────────────────────────────
            modelBuilder.Entity<Payment>(e =>
            {
                e.HasKey(p => p.PaymentId);
                e.Property(p => p.Amount).HasColumnType("decimal(18,2)");
                e.Property(p => p.TransactionReference).HasMaxLength(200);
                e.HasOne(p => p.Order).WithOne(o => o.Payment).HasForeignKey<Payment>(p => p.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasQueryFilter(p => !p.Order.IsDeleted);
            });

            // ─── Review ─────────────────────────────────────
            modelBuilder.Entity<Review>(e =>
            {
                e.HasKey(r => r.ReviewId);
                e.Property(r => r.Comment).HasMaxLength(2000);
                e.Property(r => r.ReviewDate).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.HasOne(r => r.Product).WithMany(p => p.Reviews).HasForeignKey(r => r.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(r => r.Customer).WithMany(c => c.Reviews).HasForeignKey(r => r.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
                e.HasQueryFilter(r => !r.Customer.IsDeleted);
                e.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "`Rating` >= 1 AND `Rating` <= 5"));
            });

            // ─── OrderAudit ─────────────────────────────────
            modelBuilder.Entity<OrderAudit>(e =>
            {
                e.HasKey(a => a.AuditId);
                e.Property(a => a.ChangedBy).HasMaxLength(100);
                e.Property(a => a.ChangedAt).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
                e.Property(a => a.OldStatus).HasConversion<string>().HasMaxLength(50);
                e.Property(a => a.NewStatus).HasConversion<string>().HasMaxLength(50);
            });

            // ─── AuditLog ──────────────────────────────────
            modelBuilder.Entity<AuditLog>(e =>
            {
                e.HasKey(al => al.AuditLogId);
                e.Property(al => al.EntityName).HasMaxLength(100);
                e.Property(al => al.Operation).HasMaxLength(50);
                e.Property(al => al.PerformedBy).HasMaxLength(100);
                e.Property(al => al.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
            });
        }
    }
}
