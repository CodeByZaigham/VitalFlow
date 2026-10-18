-- ==========================================
-- 04_DONATIONS.sql
-- CRUD + common lookups for DONATIONS table
-- ==========================================
USE blood_donation_db;

-- 1) List donations
SELECT id, donor_id, donor_name, blood_type, quantity, donation_date, created_at
FROM donations
ORDER BY donation_date DESC, created_at DESC;

-- 2) Donations by donor
SET @donor_id := 1;
SELECT *
FROM donations
WHERE donor_id = @donor_id
ORDER BY donation_date DESC;

-- 3) Create donation (NOTE: inventory updates are usually done in app logic)
SET @donor_id := 1;
SET @donor_name := 'Ali';
SET @blood_type := 'A+';
SET @quantity := 1;
SET @donation_date := CURDATE();

INSERT INTO donations (donor_id, donor_name, blood_type, quantity, donation_date)
VALUES (@donor_id, @donor_name, @blood_type, @quantity, @donation_date);

-- 4) Delete donation
SET @donation_id := 999;
DELETE FROM donations WHERE id = @donation_id;