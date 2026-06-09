CREATE OR REPLACE VIEW vw_ProductInventoryStatus AS
SELECT
    p.ProductId,
    p.Name AS ProductName,
    c.Name AS CategoryName,
    p.StockQuantity,
    p.Price,
    CASE
        WHEN p.StockQuantity >= 50 THEN 'A'
        ELSE 'NA'
    END AS AvailabilityStatus,
    CASE
        WHEN p.StockQuantity = 0 THEN 'Out of Stock'
        WHEN p.StockQuantity <= 10 THEN 'Critical'
        WHEN p.StockQuantity <= 50 THEN 'Low'
        ELSE 'In Stock'
    END AS StockLevel,
    p.Status
FROM Products p
LEFT JOIN Categories c ON p.CategoryId = c.CategoryId
WHERE p.Status != 'Deleted';
