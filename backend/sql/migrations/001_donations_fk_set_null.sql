-- Make donation history survive donor deletion
-- Run this ONCE on your existing database: blood_donation_db
-- It changes the donations.donor_id FK from CASCADE to SET NULL.

ALTER TABLE donations DROP FOREIGN KEY fk_donations_donor;
ALTER TABLE donations MODIFY donor_id INT NULL;
ALTER TABLE donations
  ADD CONSTRAINT fk_donations_donor
  FOREIGN KEY (donor_id) REFERENCES donors(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;