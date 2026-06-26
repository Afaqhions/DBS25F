DROP PROCEDURE IF EXISTS usp_PlaceBulkOrder;

CREATE PROCEDURE usp_PlaceBulkOrder(
    IN p_CustomerId INT,
    IN p_PaymentMethod VARCHAR(50),
    OUT p_OrderId INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO Orders (CustomerId, TotalAmount, Status, PaymentMethod, OrderDate)
    VALUES (p_CustomerId, 0.00, 'Pending', p_PaymentMethod, NOW());

    SET p_OrderId = LAST_INSERT_ID();

    COMMIT;
END;
