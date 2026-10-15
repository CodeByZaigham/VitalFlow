-- ==========================================
-- 01_USERS.sql
-- CRUD + common lookups for USERS table
-- ==========================================
USE blood_donation_db;

-- 1) List all users (Admin)
SELECT id, email, name, role, created_at, updated_at
FROM users
ORDER BY created_at DESC;

-- 2) Get user by id
SET @user_id := 1;
SELECT id, email, name, role, created_at, updated_at
FROM users
WHERE id = @user_id;

-- 3) Get user by email (used by login)
SET @email := 'test@gmail.com';
SELECT id, email, password, name, role, created_at, updated_at
FROM users
WHERE email = @email