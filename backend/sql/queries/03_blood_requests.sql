-- ==========================================
-- 03_BLOOD_REQUESTS.sql
-- CRUD + filter queries for BLOOD_REQUESTS table
-- ==========================================
USE blood_donation_db;

-- 1) List all requests
SELECT id, user_id, user_name, blood_type, quantity, city, urgency, reason,
       status, created_at, updated_at
FROM blood_requests
ORDER BY created_at DESC;

-- 2) Filter requests (status, city, blood_type)
SET @status := 'Pending';  -- 'Pending'/'Approved'/'Rejected' or NULL
SET @city := NULL;         -- e.g. 'Karachi' or NULL
SET @blood_type := NULL;   -- e.g. 'A+' or NULL

SELECT id, user_id, user_name, blood_type, quantity, city, urgency, status, created_at
FROM blood_requests
WHERE (@status IS NULL OR status = @status)
  AND (@city IS NULL OR city = @city)
  AND (@blood_type IS NULL OR blood_type = @blood_type)
ORDER BY created_at DESC;