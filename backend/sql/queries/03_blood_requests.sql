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

-- 3) Requests by user (customer dashboard)
SET @user_id := 5;
SELECT *
FROM blood_requests
WHERE user_id = @user_id
ORDER BY created_at DESC;

-- 4) Create request
SET @user_id := 5;
SET @user_name := 'John';
SET @blood_type := 'A+';
SET @quantity := 2;
SET @city := 'Karachi';
SET @urgency := 'High';
SET @reason := 'Emergency surgery';

INSERT INTO blood_requests (user_id, user_name, blood_type, quantity, city, urgency, reason, status)
VALUES (@user_id, @user_name, @blood_type, @quantity, @city, @urgency, @reason, 'Pending');

-- 5) Update request status (Admin)
SET @request_id := 1;
SET @new_status := 'Approved'; -- 'Approved'/'Rejected'/'Pending'
UPDATE blood_requests
SET status = @new_status
WHERE id = @request_id;

-- 6) Delete request
SET @request_id := 999;
DELETE FROM blood_requests WHERE id = @request_id;