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

-- D) HAVING: Cities with at least N available donors
SET @min_donors := 2;
SELECT city, COUNT(*) AS available_donors
FROM donors
WHERE is_available = 1
GROUP BY city
HAVING COUNT(*) >= @min_donors
ORDER BY available_donors DESC;

-- E) Subquery/Join: Pending requests where inventory is not enough
SELECT br.id, br.blood_type, br.quantity AS requested_qty, inv.quantity AS stock_qty, br.status
FROM blood_requests br
JOIN blood_inventory inv ON inv.blood_type = br.blood_type
WHERE br.status = 'Pending'
  AND inv.quantity < br.quantity
ORDER BY br.created_at DESC;

-- F) Correlated subquery: donors who donated more than avg donations per donor
SELECT dn.id, dn.name, dn.blood_type,
       (SELECT COUNT(*) FROM donations d WHERE d.donor_id = dn.id) AS donation_count
FROM donors dn
WHERE (SELECT COUNT(*) FROM donations d WHERE d.donor_id = dn.id)
      >
      (SELECT AVG(cnt) FROM (
          SELECT COUNT(*) AS cnt
          FROM donations
          GROUP BY donor_id
      ) x);

-- G) EXISTS: Pending requests that have at least one matching available donor in same city
SELECT br.*
FROM blood_requests br
WHERE br.status = 'Pending'
  AND EXISTS (
      SELECT 1
      FROM donors dn
      WHERE dn.is_available = 1
        AND dn.city = br.city
        AND dn.blood_type = br.blood_type
  );