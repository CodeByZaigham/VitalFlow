-- ==========================================
-- 02_DONORS.sql
-- CRUD + filter queries for DONORS table
-- ==========================================
USE blood_donation_db;

-- 1) List donors
SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone,
       last_donation_date, is_available, created_at, updated_at
FROM donors
ORDER BY created_at DESC;

-- 2) Filter donors (city, blood_type, availability)
-- Tip: set a variable to NULL to ignore that filter.
SET @city := 'Karachi';      -- or NULL
SET @blood_type := 'A+';     -- or NULL
SET @available := 1;         -- 1/0 or NULL

SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone,
       last_donation_date, is_available, created_at
FROM donors
WHERE (@city IS NULL OR city = @city)
  AND (@blood_type IS NULL OR blood_type = @blood_type)
  AND (@available IS NULL OR is_available = @available)
ORDER BY created_at DESC;