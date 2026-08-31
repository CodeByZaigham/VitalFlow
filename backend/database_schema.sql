-- Blood Donation System Database Schema
-- MySQL Database

-- Create database
CREATE DATABASE blood_donation_db;
USE blood_donation_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Donors table
CREATE TABLE donors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    health_status ENUM('Fit', 'Not Fit') NOT NULL DEFAULT 'Fit',
    city VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    last_donation_date DATE NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_blood_type (blood_type),
    INDEX idx_city (city),
    INDEX idx_is_available (is_available)
);

-- Blood requests table
CREATE TABLE blood_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_name VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    quantity INT NOT NULL,
    city VARCHAR(255) NOT NULL,
    urgency ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_blood_type (blood_type)
);

-- Donations table
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NULL,
    donor_name VARCHAR(255) NOT NULL,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    quantity INT NOT NULL,
    donation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE SET NULL,
    INDEX idx_donor_id (donor_id),
    INDEX idx_blood_type (blood_type),
    INDEX idx_donation_date (donation_date)
);

-- Blood inventory table
CREATE TABLE blood_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') UNIQUE NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blood_type (blood_type)
);

-- Insert initial blood inventory (all types with 0 quantity)
INSERT INTO blood_inventory (blood_type, quantity) VALUES
('A+', 0),
('A-', 0),
('B+', 0),
('B-', 0),
('AB+', 0),
('AB-', 0),
('O+', 0),
('O-', 0);

use blood_donation_db;
select * from donors;




