CREATE OR REPLACE VIEW vw_ActiveCustomers AS
SELECT DISTINCT
    c.CustomerId,
    c.FullName,
    c.Phone,
    u.Email,
    c.Address,
    c.LoyaltyPoints,
    COUNT(o.OrderId) AS TotalOrders,
    COALESCE(SUM(o.TotalAmount), 0) AS TotalSpent
FROM Customers c
INNER JOIN Users u ON c.UserId = u.UserId
LEFT JOIN Orders o ON c.CustomerId = o.CustomerId AND o.IsDeleted = 0
WHERE c.IsDeleted = 0
GROUP BY c.CustomerId, c.FullName, c.Phone, u.Email, c.Address, c.LoyaltyPoints;
