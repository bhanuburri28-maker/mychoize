-- ALTER TABLE script for improving the existing users table without losing current data.
ALTER TABLE users
  ADD COLUMN status ENUM('active','inactive','pending','banned') NOT NULL DEFAULT 'active' AFTER role,
  ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
  ADD COLUMN last_login_at DATETIME NULL AFTER updated_at;

ALTER TABLE users
  ADD INDEX idx_users_email (email),
  ADD INDEX idx_users_role (role);

-- If the users table already contains an email index and duplicate entries exist, remove duplicate rows first.
-- Use the following query before applying the index if needed:
-- DELETE t1 FROM users t1
-- JOIN users t2 ON t1.email = t2.email AND t1.id > t2.id;
