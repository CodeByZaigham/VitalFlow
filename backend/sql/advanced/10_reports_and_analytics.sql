-- ==========================================
-- 10_REPORTS_AND_ANALYTICS.sql
-- Joins, subqueries, grouping, HAVING, EXISTS, UNION, CASE
-- (Great for DBMS demonstration)
-- ==========================================
USE blood_donation_db;

-- A) JOIN: Requests with user details (INNER JOIN)
SELECT br.id AS request_id,
       u.id AS user_id,
       u.email,
       u.name AS account_name,
       br.user_name AS request_name,
       br.blood_type,
       br.quantity,
       br.city,
       br.urgency,
       br.status,
       br.created_at
FROM blood_requests br
JOIN users u ON u.id = br.user_id
ORDER BY br.created_at DESC;

-- B) JOIN: Donations with donor + (optional) linked user account (LEFT JOIN)
SELECT d.id AS donation_id,
       dn.id AS donor_id,
       dn.name AS donor_name,
       dn.city AS donor_city,
       u.email AS donor_account_email,
       d.blood_type,
       d.quantity,
       d.donation_date
FROM donations d
JOIN donors dn ON dn.id = d.donor_id
LEFT JOIN users u ON u.id = dn.user_id
ORDER BY d.donation_date DESC;

-- C) Aggregation: Total available donors by city and blood type (GROUP BY)
SELECT city, blood_type, COUNT(*) AS available_donors
FROM donors
WHERE is_available = 1
GROUP BY city, blood_type
ORDER BY city, blood_type;