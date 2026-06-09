using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCountryAndMerchantTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderItem_Quantity",
                table: "OrderItems");

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Code = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Continent = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Currency = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryId);
                    table.CheckConstraint("CK_Country_Required", "`Name` IS NOT NULL AND `Code` IS NOT NULL AND `Currency` IS NOT NULL");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Merchants",
                columns: table => new
                {
                    MerchantId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CompanyName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ContactPerson = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Merchants", x => x.MerchantId);
                    table.ForeignKey(
                        name: "FK_Merchants_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductMerchants",
                columns: table => new
                {
                    MerchantsMerchantId = table.Column<int>(type: "int", nullable: false),
                    ProductsProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductMerchants", x => new { x.MerchantsMerchantId, x.ProductsProductId });
                    table.ForeignKey(
                        name: "FK_ProductMerchants_Merchants_MerchantsMerchantId",
                        column: x => x.MerchantsMerchantId,
                        principalTable: "Merchants",
                        principalColumn: "MerchantId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductMerchants_Products_ProductsProductId",
                        column: x => x.ProductsProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddCheckConstraint(
                name: "CK_User_Email",
                table: "Users",
                sql: "`Email` LIKE '%_@__%.__%'");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Supplier_Email",
                table: "Suppliers",
                sql: "`Email` LIKE '%_@__%.__%'");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Product_Status",
                table: "Products",
                sql: "`Status` IN ('Active','Inactive','Deleted')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderItem_Quantity",
                table: "OrderItems",
                sql: "`Quantity` >= 50");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Customer_Age",
                table: "Customers",
                sql: "TIMESTAMPDIFF(YEAR, `DateOfBirth`, CURDATE()) >= 18");

            migrationBuilder.CreateIndex(
                name: "IX_Countries_Code",
                table: "Countries",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Countries_Name",
                table: "Countries",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Merchants_CountryId",
                table: "Merchants",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Merchants_Email",
                table: "Merchants",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductMerchants_ProductsProductId",
                table: "ProductMerchants",
                column: "ProductsProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductMerchants");

            migrationBuilder.DropTable(
                name: "Merchants");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropCheckConstraint(
                name: "CK_User_Email",
                table: "Users");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Supplier_Email",
                table: "Suppliers");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Product_Status",
                table: "Products");

            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderItem_Quantity",
                table: "OrderItems");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Customer_Age",
                table: "Customers");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderItem_Quantity",
                table: "OrderItems",
                sql: "`Quantity` > 0");
        }
    }
}
