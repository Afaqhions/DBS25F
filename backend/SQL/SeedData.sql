-- ─── Seed Data ─────────────────────────────────────────
-- Countries
INSERT INTO Countries (Name, Code, Continent, Currency, IsActive) VALUES
('Pakistan', 'PK', 'Asia', 'PKR', 1),
('India', 'IN', 'Asia', 'INR', 1),
('USA', 'US', 'North America', 'USD', 1),
('UK', 'GB', 'Europe', 'GBP', 1),
('China', 'CN', 'Asia', 'CNY', 1),
('Germany', 'DE', 'Europe', 'EUR', 1),
('Australia', 'AU', 'Oceania', 'AUD', 1),
('Brazil', 'BR', 'South America', 'BRL', 1);

-- Categories
INSERT INTO Categories (Name, Description, ParentCategoryId) VALUES
('Electronics', 'Electronic devices and accessories', NULL),
('Computers', 'Desktop and laptop computers', 1),
('Mobile Phones', 'Smartphones and accessories', 1),
('Clothing', 'Apparel and fashion items', NULL),
('Food & Beverages', 'Food items and drinks', NULL),
('Office Supplies', 'Stationery and office equipment', NULL),
('Books', 'Educational and fiction books', NULL),
('Sports Equipment', 'Sports and fitness gear', NULL);

-- Users (password: Test@123 hashed with BCrypt)
INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsActive) VALUES
('admin', 'admin@wms.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Admin', NOW(), 1),
('manager1', 'manager@wms.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Manager', NOW(), 1),
('john_doe', 'john@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1),
('jane_smith', 'jane@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1),
('ali_khan', 'ali@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1),
('sara_ahmed', 'sara@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1);

-- Customers
INSERT INTO Customers (UserId, FullName, Phone, Address, DateOfBirth, LoyaltyPoints, IsDeleted) VALUES
(3, 'John Doe', '+1-555-0101', '123 Main St, New York, USA', '1990-05-15', 150, 0),
(4, 'Jane Smith', '+1-555-0102', '456 Oak Ave, Los Angeles, USA', '1988-11-22', 320, 0),
(5, 'Ali Khan', '+92-300-1234567', '15 Liberty Road, Lahore, Pakistan', '1995-03-08', 75, 0),
(6, 'Sara Ahmed', '+92-321-9876543', '42 Garden Block, Karachi, Pakistan', '1992-07-19', 200, 0);

-- Suppliers
INSERT INTO Suppliers (CompanyName, ContactPerson, Email, Phone, Address, IsActive) VALUES
('TechWorld Distributors', 'Ahmed Raza', 'ahmed@techworld.com', '+92-42-111-1234', '12 Industrial Area, Lahore', 1),
('Global Goods Co.', 'Sarah Lee', 'sarah@globalgoods.com', '+1-555-0201', '500 Commerce Blvd, Chicago', 1),
('Pak Agro Foods', 'Usman Malik', 'usman@pakagro.com', '+92-21-111-5678', '88 Port Road, Karachi', 1),
('EuroStyle Fashion', 'Marie Dubois', 'marie@eurostyle.de', '+49-30-123456', '10 Fashion Street, Berlin', 1),
('OfficePro Solutions', 'David Chen', 'david@officepro.cn', '+86-10-87654321', '200 Tech Park, Beijing', 1);

-- Merchants
INSERT INTO Merchants (CompanyName, ContactPerson, Email, Phone, CountryId, IsActive) VALUES
('PakTech Electronics', 'Bilal Hassan', 'bilal@paktech.com', '+92-42-111-9999', 1, 1),
('US West Traders', 'Mike Johnson', 'mike@uswest.com', '+1-555-0301', 3, 1),
('EuroTrade GmbH', 'Hans Mueller', 'hans@eurotrade.de', '+49-40-987654', 6, 1);

-- Products
INSERT INTO Products (Name, Description, Price, StockQuantity, CategoryId, Status, CreatedDate) VALUES
('Laptop Pro 15"', 'High-performance laptop with 16GB RAM', 899.99, 100, 2, 'Active', NOW()),
('Gaming Mouse X1', 'RGB gaming mouse with 6 buttons', 49.99, 200, 2, 'Active', NOW()),
('Smartphone Z10', '5G smartphone with 128GB storage', 699.99, 150, 3, 'Active', NOW()),
('Phone Case', 'Silicone protective case', 14.99, 500, 3, 'Active', NOW()),
('Cotton T-Shirt', 'Premium cotton t-shirt, all sizes', 19.99, 300, 4, 'Active', NOW()),
('Jeans Classic', 'Classic fit blue jeans', 39.99, 200, 4, 'Active', NOW()),
('Green Tea Pack', 'Organic green tea 100 bags', 12.99, 400, 5, 'Active', NOW()),
('Basmati Rice 5kg', 'Premium basmati rice', 24.99, 250, 5, 'Active', NOW()),
('Notebook Set', 'Pack of 5 spiral notebooks', 9.99, 600, 6, 'Active', NOW()),
('Desk Lamp LED', 'Adjustable LED desk lamp', 34.99, 180, 6, 'Active', NOW()),
('C# Programming Book', 'Complete guide to C# .NET', 44.99, 120, 7, 'Active', NOW()),
('SQL Mastery Book', 'Advanced SQL techniques', 39.99, 90, 7, 'Active', NOW()),
('Yoga Mat Premium', 'Non-slip exercise yoga mat', 29.99, 160, 8, 'Active', NOW()),
('Resistance Bands Set', 'Set of 5 resistance bands', 24.99, 220, 8, 'Active', NOW());

-- Product-Supplier relationships
INSERT INTO ProductSuppliers (ProductsProductId, SuppliersSupplierId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 4), (6, 4),
(7, 3), (8, 3),
(9, 5), (10, 5),
(11, 2), (12, 2),
(13, 2), (14, 2);

-- Product-Merchant relationships
INSERT INTO ProductMerchants (ProductsProductId, MerchantsMerchantId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 2), (6, 2),
(7, 3), (8, 3);

-- Orders
INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status, PaymentMethod, IsDeleted) VALUES
(1, '2026-01-15 10:30:00', 1949.97, 'Delivered', 'Card', 0),
(1, '2026-02-20 14:00:00', 124.97, 'Delivered', 'Cash', 0),
(2, '2026-01-25 09:15:00', 749.98, 'Shipped', 'Bank', 0),
(3, '2026-03-05 11:45:00', 699.99, 'Pending', 'Card', 0),
(4, '2026-02-10 16:30:00', 89.97, 'Delivered', 'Cash', 0),
(2, '2026-03-15 08:00:00', 44.99, 'Shipped', 'Card', 0),
(3, '2026-01-30 13:20:00', 64.98, 'Cancelled', 'Bank', 0),
(4, '2026-03-20 15:10:00', 1299.98, 'Pending', 'Card', 0);

-- OrderItems (min 50 qty per business rule)
INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal) VALUES
(1, 1, 2, 899.99, 1799.98),
(1, 9, 15, 9.99, 149.85),
(2, 4, 50, 14.99, 749.50),
(2, 7, 100, 12.99, 1299.00),
(3, 5, 50, 19.99, 999.50),
(3, 6, 50, 39.99, 1999.50),
(4, 3, 1, 699.99, 699.99),
(5, 4, 50, 14.99, 749.50),
(5, 8, 1, 24.99, 24.99),
(6, 10, 1, 34.99, 34.99),
(7, 7, 5, 12.99, 64.95),
(8, 1, 1, 899.99, 899.99),
(8, 11, 10, 44.99, 449.90);

-- Payments
INSERT INTO Payments (OrderId, Amount, PaymentDate, TransactionReference) VALUES
(1, 1949.97, '2026-01-15 10:35:00', 'TXN-001'),
(2, 124.97, '2026-02-20 14:05:00', 'TXN-002'),
(3, 749.98, '2026-01-25 09:20:00', 'TXN-003'),
(5, 89.97, '2026-02-10 16:35:00', 'TXN-004'),
(6, 44.99, '2026-03-15 08:05:00', 'TXN-005');

-- Reviews
INSERT INTO Reviews (ProductId, CustomerId, Rating, Comment, ReviewDate) VALUES
(1, 1, 5, 'Excellent laptop, very fast!', NOW()),
(3, 3, 4, 'Good phone, battery life could be better', NOW()),
(5, 2, 5, 'Great quality t-shirts', NOW()),
(9, 4, 4, 'Good notebooks for school', NOW()),
(7, 1, 5, 'Best green tea brand', NOW());
