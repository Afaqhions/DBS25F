CREATE OR REPLACE VIEW vw_TopProductsByRevenue AS
SELECT
    p.ProductId,
    p.Name AS ProductName,
    c.Name AS CategoryName,
    COALESCE(SUM(oi.Quantity), 0) AS TotalSold,
    COALESCE(SUM(oi.Subtotal), 0) AS TotalRevenue,
    p.Price,
    p.StockQuantity
FROM Products p
LEFT JOIN OrderItems oi ON p.ProductId = oi.ProductId
LEFT JOIN Orders o ON oi.OrderId = o.OrderId AND o.IsDeleted = 0 AND o.Status != 'Cancelled'
LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
WHERE p.Status != 'Deleted'
GROUP BY p.ProductId, p.Name, c.Name, p.Price, p.StockQuantity
ORDER BY TotalRevenue DESC;
