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