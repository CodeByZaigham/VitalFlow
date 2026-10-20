-- 001_fix_donations_fk.sql
-- Goal: Keep donation history even if a donor row is deleted.
-- This changes the donations.donor_id FK from ON DELETE CASCADE to ON DELETE SET NULL
-- and makes donations.donor_id nullable.

-- IMPORTANT:
-- MySQL auto-generates the FK name (often donations_ibfk_1).
-- If the DROP FOREIGN KEY line fails, run:
--   SHOW CREATE TABLE donations;
-- and replace the FK name below with the one shown there.
use blood_donation_db;
SHOW CREATE TABLE donations;
ALTER TABLE donations
  DROP FOREIGN KEY donations_ibfk_1;

ALTER TABLE donations
  MODIFY donor_id INT NULL;

ALTER TABLE donations
  ADD CONSTRAINT fk_donations_donor
  FOREIGN KEY (donor_id) REFERENCES donors(id)
  ON DELETE SET NULL;
  