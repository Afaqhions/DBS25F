DROP TRIGGER IF EXISTS trg_CheckMerchantCountry;

CREATE TRIGGER trg_CheckMerchantCountry
BEFORE INSERT ON Merchants
FOR EACH ROW
BEGIN
    DECLARE v_CountryName VARCHAR(100);
    SELECT Name INTO v_CountryName FROM Countries WHERE CountryId = NEW.CountryId;
    IF v_CountryName = 'India' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Merchants from India are banned.';
    END IF;
END;
