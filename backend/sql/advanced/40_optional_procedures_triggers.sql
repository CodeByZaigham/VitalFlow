-- ==========================================
-- 40_OPTIONAL_PROCEDURES_TRIGGERS.sql
-- OPTIONAL DBMS FEATURES (Stored Procedures + Triggers)
--
-- ⚠️ IMPORTANT:
-- Your FastAPI backend already updates inventory / donor status in Python.
-- If you enable triggers here on the SAME database, you might update twice.
--
-- Best practice for demo:
--   1) Make a COPY database (blood_donation_demo)
--   2) Run schema, then run this file on the demo DB
--   3) Show your teacher procedures/triggers working in SQL
-- ==========================================

-- ---------- (A) Stored Procedure: approve a request atomically ----------
-- Approves a request ONLY if inventory is enough, and deducts stock.
-- Also sets status to 'Approved' or keeps it 'Pending' if not enough.

DELIMITER $$

CREATE PROCEDURE sp_approve_request(IN p_request_id INT)
BEGIN
    DECLARE v_blood_type VARCHAR(3);
    DECLARE v_qty INT;
    DECLARE v_stock INT;

    -- get request info
    SELECT blood_type, quantity INTO v_blood_type, v_qty
    FROM blood_requests
    WHERE id = p_request_id
    FOR UPDATE;

    -- get stock
    SELECT quantity INTO v_stock
    FROM blood_inventory
    WHERE blood_type = v_blood_type
    FOR UPDATE;

    START TRANSACTION;

    IF v_stock >= v_qty THEN
        UPDATE blood_inventory
        SET quantity = quantity - v_qty
        WHERE blood_type = v_blood_type;

        UPDATE blood_requests
        SET status = 'Approved'
        WHERE id = p_request_id;
    ELSE
        -- not enough stock: keep Pending (or you can set Rejected)
        UPDATE blood_requests
        SET status = 'Pending'
        WHERE id = p_request_id;
    END IF;

    COMMIT;
END$$

DELIMITER ;

-- Usage:
-- USE blood_donation_db;
-- CALL sp_approve_request(1);
-- SELECT * FROM blood_requests WHERE id = 1;
-- SELECT * FROM blood_inventory WHERE blood_type = (SELECT blood_type FROM blood_requests WHERE id=1);


-- ---------- (B) Trigger: auto-update inventory after a donation ----------
-- Again: only enable if your app is NOT already doing the same update.

DELIMITER $$

CREATE TRIGGER trg_after_donation_insert
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    UPDATE blood_inventory
    SET quantity = quantity + NEW.quantity
    WHERE blood_type = NEW.blood_type;
END$$

DELIMITER ;

-- Test:
-- INSERT INTO donations (donor_id, donor_name, blood_type, quantity, donation_date)
-- VALUES (1, 'Ali', 'A+', 1, CURDATE());
-- SELECT * FROM blood_inventory WHERE blood_type='A+';

-- ---------- (C) Trigger: mark donor unavailable + update last donation date ----------
DELIMITER $$

CREATE TRIGGER trg_after_donation_insert_update_donor
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    UPDATE donors
    SET last_donation_date = NEW.donation_date,
        is_available = 0
    WHERE id = NEW.donor_id;
END$$

DELIMITER ;

-- Test:
-- SELECT id, last_donation_date, is_available FROM donors WHERE id=1;