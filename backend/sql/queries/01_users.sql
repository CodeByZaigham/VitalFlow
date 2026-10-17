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

-- 4) Create user (password should be bcrypt-hashed in app)
SET @email := 'newuser@example.com';
SET @hashed_password := '$2b$12$example_hash_here';
SET @name := 'New User';

INSERT INTO users (email, password, name, role)
VALUES (@email, @hashed_password, @name, 'customer');

-- 5) Update user
SET @user_id := 1;
SET @new_name := 'Updated Name';
SET @new_role := 'customer'; -- 'admin' or 'customer'
UPDATE users
SET name = @new_name,
    role = @new_role
WHERE id = @user_id;

-- 6) Delete user (WARNING: cascades delete in blood_requests)
SET @user_id := 999;
DELETE FROM users WHERE id = @user_id;
