DROP TRIGGER IF EXISTS trg_UpdateStockOnOrder;

CREATE TRIGGER trg_UpdateStockOnOrder
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Products
    SET StockQuantity = StockQuantity - NEW.Quantity,
        Status = CASE WHEN (StockQuantity - NEW.Quantity) >= 50 THEN 'Active' ELSE 'Inactive' END
    WHERE ProductId = NEW.ProductId;

    INSERT INTO InventoryTransactions (ProductId, SupplierId, TransactionType, Quantity, TransactionDate, Remarks)
    VALUES (NEW.ProductId, NULL, 'Sale', NEW.Quantity, NOW(),
            CONCAT('Auto: OrderItem #', NEW.OrderItemId));
END;
