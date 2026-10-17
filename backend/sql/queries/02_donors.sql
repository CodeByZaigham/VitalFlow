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

-- 3) Get donor by id
SET @donor_id := 1;
SELECT *
FROM donors
WHERE id = @donor_id;

-- 4) Create donor
SET @user_id := 5; -- or NULL
SET @name := 'Ali';
SET @age := 22;
SET @blood_type := 'A+';
SET @gender := 'Male';
SET @health_status := 'Fit';
SET @city := 'Karachi';
SET @phone := '03001234567';
SET @last_donation_date := NULL;
SET @is_available := 1;

INSERT INTO donors (user_id, name, age, blood_type, gender, health_status,
                    city, phone, last_donation_date, is_available)
VALUES (@user_id, @name, @age, @blood_type, @gender, @health_status,
        @city, @phone, @last_donation_date, @is_available);

-- 5) Update donor
SET @donor_id := 1;
UPDATE donors
SET city = 'Lahore',
    is_available = 1
WHERE id = @donor_id;

-- 6) Delete donor (cascades delete in donations)
SET @donor_id := 999;
DELETE FROM donors WHERE id = @donor_id;
