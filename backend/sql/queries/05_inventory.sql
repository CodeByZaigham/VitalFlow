-- ==========================================
-- 05_INVENTORY.sql
-- CRUD + common lookups for BLOOD_INVENTORY table
-- ==========================================
USE blood_donation_db;

-- 1) List inventory
SELECT blood_type, quantity, last_updated
FROM blood_inventory
ORDER BY blood_type;

-- 2) Get inventory by blood type
SET @blood_type := 'A+';
SELECT blood_type, quantity, last_updated
FROM blood_inventory
WHERE blood_type = @blood_type;
