DROP PROCEDURE IF EXISTS usp_GenerateMonthlySalesReport;

CREATE PROCEDURE usp_GenerateMonthlySalesReport(
    IN p_Year INT,
    IN p_Month INT
)
BEGIN
    DECLARE v_TotalOrders INT;
    DECLARE v_TotalRevenue DECIMAL(18,2);

    SELECT COUNT(*), COALESCE(SUM(TotalAmount), 0)
    INTO v_TotalOrders, v_TotalRevenue
    FROM Orders
    WHERE YEAR(OrderDate) = p_Year AND MONTH(OrderDate) = p_Month
      AND Status != 'Cancelled' AND IsDeleted = 0;

    SELECT p_Year AS ReportYear, p_Month AS ReportMonth,
           v_TotalOrders AS TotalOrders, v_TotalRevenue AS TotalRevenue;

    SELECT
        o.OrderId, o.OrderDate, c.FullName AS CustomerName,
        o.TotalAmount, o.Status, o.PaymentMethod
    FROM Orders o
    INNER JOIN Customers c ON o.CustomerId = c.CustomerId
    WHERE YEAR(o.OrderDate) = p_Year AND MONTH(o.OrderDate) = p_Month
      AND o.IsDeleted = 0
    ORDER BY o.OrderDate DESC;
END;
