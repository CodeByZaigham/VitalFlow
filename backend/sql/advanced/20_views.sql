USE blood_donation_db;

-- 1) Available donors with account email (LEFT JOIN)
CREATE OR REPLACE VIEW v_available_donors AS
SELECT dn.id AS donor_id,
       dn.name,
       dn.age,
       dn.blood_type,
       dn.gender,
       dn.health_status,
       dn.city,
       dn.phone,
       dn.last_donation_date,
       dn.is_available,
       u.email AS account_email,
       dn.created_at
FROM donors dn
LEFT JOIN users u ON u.id = dn.user_id
WHERE dn.is_available = 1;