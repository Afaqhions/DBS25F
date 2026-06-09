CREATE OR REPLACE VIEW vw_SupplierPerformance AS
SELECT
    s.SupplierId,
    s.CompanyName,
    s.ContactPerson,
    s.Email,
    COUNT(DISTINCT it.TransactionId) AS TotalTransactions,
    COALESCE(SUM(it.Quantity), 0) AS TotalUnitsSupplied,
    COUNT(DISTINCT it.ProductId) AS ProductsSupplied,
    MAX(it.TransactionDate) AS LastSupplyDate
FROM Suppliers s
LEFT JOIN InventoryTransactions it ON s.SupplierId = it.SupplierId
WHERE s.IsActive = 1
GROUP BY s.SupplierId, s.CompanyName, s.ContactPerson, s.Email;
