DROP PROCEDURE IF EXISTS usp_GetTopSellingProducts;

CREATE PROCEDURE usp_GetTopSellingProducts(
    IN p_TopN INT,
    IN p_StartDate DATE,
    IN p_EndDate DATE
)
BEGIN
    SELECT
        p.ProductId, p.Name AS ProductName,
        cat.Name AS CategoryName,
        COALESCE(SUM(oi.Quantity), 0) AS TotalQuantity,
        COALESCE(SUM(oi.Subtotal), 0) AS TotalRevenue
    FROM Products p
    INNER JOIN OrderItems oi ON p.ProductId = oi.ProductId
    INNER JOIN Orders o ON oi.OrderId = o.OrderId
    INNER JOIN Categories cat ON p.CategoryId = cat.CategoryId
    WHERE o.IsDeleted = 0 AND o.Status != 'Cancelled'
      AND (p_StartDate IS NULL OR o.OrderDate >= p_StartDate)
      AND (p_EndDate IS NULL OR o.OrderDate <= p_EndDate)
    GROUP BY p.ProductId, p.Name, cat.Name
    ORDER BY TotalRevenue DESC
    LIMIT p_TopN;
END;
