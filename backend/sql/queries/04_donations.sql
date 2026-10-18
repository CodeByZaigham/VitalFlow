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