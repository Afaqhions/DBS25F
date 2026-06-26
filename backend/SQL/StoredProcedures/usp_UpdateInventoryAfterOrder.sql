DROP PROCEDURE IF EXISTS usp_UpdateInventoryAfterOrder;

CREATE PROCEDURE usp_UpdateInventoryAfterOrder(
    IN p_OrderId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE Products p
    INNER JOIN OrderItems oi ON p.ProductId = oi.ProductId
    SET p.StockQuantity = p.StockQuantity - oi.Quantity
    WHERE oi.OrderId = p_OrderId;

    INSERT INTO InventoryTransactions (ProductId, SupplierId, TransactionType, Quantity, TransactionDate, Remarks)
    SELECT oi.ProductId, NULL, 'Sale', oi.Quantity, UTC_TIMESTAMP(),
           CONCAT('Auto: Order #', p_OrderId)
    FROM OrderItems oi WHERE oi.OrderId = p_OrderId;

    UPDATE Products p
    INNER JOIN OrderItems oi ON p.ProductId = oi.ProductId
    SET p.Status = CASE WHEN (p.StockQuantity - oi.Quantity) >= 50 THEN 'Active' ELSE 'Inactive' END
    WHERE oi.OrderId = p_OrderId;

    COMMIT;
END;
