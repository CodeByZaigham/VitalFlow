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