DROP TRIGGER IF EXISTS trg_AuditOrderStatusChange;

CREATE TRIGGER trg_AuditOrderStatusChange
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF OLD.Status <> NEW.Status THEN
        INSERT INTO OrderAudits (OrderId, OldStatus, NewStatus, ChangedAt, ChangedBy)
        VALUES (NEW.OrderId, OLD.Status, NEW.Status, NOW(),
                COALESCE((SELECT Username FROM Users WHERE UserId = @LoggedInUserId), 'SYSTEM'));
    END IF;
END;
