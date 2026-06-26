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
('sara_ahmed', 'sara@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1),
('michael_j', 'mike@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1),
('emma_w', 'emma@example.com', '$2a$11$K3x5O0qE5j6Y7i8u9o0aAeB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV', 'Customer', NOW(), 1);

-- Customers
INSERT INTO Customers (UserId, FullName, Phone, Address, DateOfBirth, LoyaltyPoints, IsDeleted) VALUES
(3, 'John Doe', '+1-555-0101', '123 Main St, New York, USA', '1990-05-15', 150, 0),
(4, 'Jane Smith', '+1-555-0102', '456 Oak Ave, Los Angeles, USA', '1988-11-22', 320, 0),
(5, 'Ali Khan', '+92-300-1234567', '15 Liberty Road, Lahore, Pakistan', '1995-03-08', 75, 0),
(6, 'Sara Ahmed', '+92-321-9876543', '42 Garden Block, Karachi, Pakistan', '1992-07-19', 200, 0),
(7, 'Michael Johnson', '+1-555-0103', '789 Pine St, Seattle, USA', '1985-02-14', 500, 0),
(8, 'Emma Watson', '+44-20-1234-5678', '10 Downing St, London, UK', '1990-04-15', 400, 0);

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
('Laptop Pro 15"', 'High-performance laptop with 16GB RAM', 899.99, 1000, 2, 'Active', NOW()),
('Gaming Mouse X1', 'RGB gaming mouse with 6 buttons', 49.99, 2000, 2, 'Active', NOW()),
('Smartphone Z10', '5G smartphone with 128GB storage', 699.99, 1500, 3, 'Active', NOW()),
('Phone Case', 'Silicone protective case', 14.99, 5000, 3, 'Active', NOW()),
('Cotton T-Shirt', 'Premium cotton t-shirt, all sizes', 19.99, 3000, 4, 'Active', NOW()),
('Jeans Classic', 'Classic fit blue jeans', 39.99, 2000, 4, 'Active', NOW()),
('Green Tea Pack', 'Organic green tea 100 bags', 12.99, 4000, 5, 'Active', NOW()),
('Basmati Rice 5kg', 'Premium basmati rice', 24.99, 2500, 5, 'Active', NOW()),
('Notebook Set', 'Pack of 5 spiral notebooks', 9.99, 6000, 6, 'Active', NOW()),
('Desk Lamp LED', 'Adjustable LED desk lamp', 34.99, 1800, 6, 'Active', NOW()),
('C# Programming Book', 'Complete guide to C# .NET', 44.99, 1200, 7, 'Active', NOW()),
('SQL Mastery Book', 'Advanced SQL techniques', 39.99, 900, 7, 'Active', NOW()),
('Yoga Mat Premium', 'Non-slip exercise yoga mat', 29.99, 1600, 8, 'Active', NOW()),
('Resistance Bands Set', 'Set of 5 resistance bands', 24.99, 2200, 8, 'Active', NOW()),
('Coffee Beans 1kg', 'Premium roasted coffee beans', 18.99, 3000, 5, 'Active', NOW()),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 800, 2, 'Active', NOW()),
('Office Chair', 'Ergonomic mesh office chair', 149.99, 500, 6, 'Active', NOW()),
('Running Shoes', 'Lightweight marathon running shoes', 89.99, 1200, 4, 'Active', NOW());

-- Product-Supplier relationships
INSERT INTO ProductSuppliers (ProductsProductId, SuppliersSupplierId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 4), (6, 4),
(7, 3), (8, 3),
(9, 5), (10, 5),
(11, 2), (12, 2),
(13, 2), (14, 2),
(15, 3), (16, 1), (17, 5), (18, 4);

-- Product-Merchant relationships
INSERT INTO ProductMerchants (ProductsProductId, MerchantsMerchantId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 2), (6, 2),
(7, 3), (8, 3),
(15, 3), (16, 1), (17, 2), (18, 2);

-- Orders
INSERT INTO Orders (CustomerId, OrderDate, TotalAmount, Status, PaymentMethod, IsDeleted) VALUES
(1, '2026-01-15 10:30:00', 45499.00, 'Delivered', 'Card', 0),
(1, '2026-02-20 14:00:00', 2048.50, 'Delivered', 'Cash', 0),
(2, '2026-01-25 09:15:00', 2999.00, 'Shipped', 'Bank', 0),
(3, '2026-03-05 11:45:00', 34999.50, 'Pending', 'Card', 0),
(4, '2026-02-10 16:30:00', 1999.00, 'Delivered', 'Cash', 0),
(2, '2026-03-15 08:00:00', 1749.50, 'Shipped', 'Card', 0),
(3, '2026-01-30 13:20:00', 649.50, 'Cancelled', 'Bank', 0),
(4, '2026-03-20 15:10:00', 47249.00, 'Pending', 'Card', 0),
(5, '2026-04-05 10:00:00', 9499.50, 'Delivered', 'Card', 0),
(6, '2026-04-12 11:30:00', 14999.00, 'Shipped', 'Bank', 0),
(1, '2026-04-18 14:20:00', 7499.50, 'Pending', 'Card', 0),
(2, '2026-05-02 09:45:00', 8999.00, 'Delivered', 'Cash', 0),
(3, '2026-05-10 16:15:00', 19999.00, 'Delivered', 'Card', 0),
(4, '2026-05-20 13:10:00', 1249.50, 'Cancelled', 'Bank', 0),
(5, '2026-05-25 10:50:00', 2499.50, 'Shipped', 'Card', 0),
(6, '2026-06-01 11:00:00', 9999.50, 'Delivered', 'Card', 0),
(1, '2026-06-08 14:30:00', 4499.50, 'Shipped', 'Card', 0),
(2, '2026-06-15 09:15:00', 5999.50, 'Pending', 'Bank', 0),
(3, '2026-06-20 15:45:00', 17999.00, 'Pending', 'Card', 0),
(4, '2026-06-25 12:20:00', 2249.50, 'Pending', 'Card', 0);

-- OrderItems (min 50 qty per business rule)
INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Subtotal) VALUES
(1, 1, 50, 899.99, 44999.50),
(1, 9, 50, 9.99, 499.50),
(2, 4, 50, 14.99, 749.50),
(2, 7, 100, 12.99, 1299.00),
(3, 5, 50, 19.99, 999.50),
(3, 6, 50, 39.99, 1999.50),
(4, 3, 50, 699.99, 34999.50),
(5, 4, 50, 14.99, 749.50),
(5, 8, 50, 24.99, 1249.50),
(6, 10, 50, 34.99, 1749.50),
(7, 7, 50, 12.99, 649.50),
(8, 1, 50, 899.99, 44999.50),
(8, 11, 50, 44.99, 2249.50),
(9, 15, 50, 18.99, 949.50),
(9, 18, 50, 89.99, 4499.50),
(10, 16, 50, 199.99, 9999.50),
(11, 17, 50, 149.99, 7499.50),
(12, 1, 50, 899.99, 44999.50),
(13, 16, 100, 199.99, 19999.00),
(14, 14, 50, 24.99, 1249.50),
(15, 2, 50, 49.99, 2499.50),
(16, 16, 50, 199.99, 9999.50),
(17, 18, 50, 89.99, 4499.50),
(18, 17, 50, 149.99, 7499.50),
(19, 1, 50, 899.99, 44999.50),
(19, 16, 50, 199.99, 9999.50),
(20, 11, 50, 44.99, 2249.50);

-- Reviews
INSERT INTO Reviews (ProductId, CustomerId, Rating, Comment, ReviewDate) VALUES
(1, 1, 5, 'Excellent laptop, very fast!', NOW()),
(3, 3, 4, 'Good phone, battery life could be better', NOW()),
(5, 2, 5, 'Great quality t-shirts', NOW()),
(9, 4, 4, 'Good notebooks for school', NOW()),
(7, 1, 5, 'Best green tea brand', NOW()),
(16, 5, 5, 'Amazing sound quality', NOW()),
(17, 6, 4, 'Very comfortable for long hours', NOW()),
(18, 1, 5, 'Lightweight and durable', NOW()),
(15, 2, 5, 'Best coffee beans I have tried', NOW());
