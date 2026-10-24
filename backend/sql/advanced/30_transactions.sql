-- ==========================================
-- 30_TRANSACTIONS.sql
-- Demonstrates ACID / transaction control (DBMS demo)
-- ==========================================
USE blood_donation_db;

-- Scenario: donation should be atomic:
-- 1) INSERT donation
-- 2) UPDATE inventory (+qty)
-- 3) UPDATE donor status/date

SET @donor_id := 1;
SET @donor_name := (SELECT name FROM donors WHERE id = @donor_id);
SET @blood_type := (SELECT blood_type FROM donors WHERE id = @donor_id);
SET @qty := 1;
SET @donation_date := CURDATE();

START TRANSACTION;

INSERT INTO donations (donor_id, donor_name, blood_type, quantity, donation_date)
VALUES (@donor_id, @donor_name, @blood_type, @qty, @donation_date);

UPDATE blood_inventory
SET quantity = quantity + @qty
WHERE blood_type = @blood_type;

UPDATE donors
SET last_donation_date = @donation_date,
    is_available = 0
WHERE id = @donor_id;

COMMIT;