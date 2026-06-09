CREATE OR REPLACE VIEW vw_MonthlySalesSummary AS
SELECT
    YEAR(o.OrderDate) AS Year,
    MONTH(o.OrderDate) AS Month,
    COUNT(DISTINCT o.OrderId) AS TotalOrders,
    COUNT(DISTINCT o.CustomerId) AS UniqueCustomers,
    COALESCE(SUM(o.TotalAmount), 0) AS TotalRevenue,
    COALESCE(AVG(o.TotalAmount), 0) AS AvgOrderValue
FROM Orders o
WHERE o.Status != 'Cancelled' AND o.IsDeleted = 0
GROUP BY YEAR(o.OrderDate), MONTH(o.OrderDate)
ORDER BY Year DESC, Month DESC;
