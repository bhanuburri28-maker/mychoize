-- Seed data for MyChoize database, compatible with the normalized schema.

INSERT INTO car_categories (name, description, created_at) VALUES
('Luxury', 'Premium luxury vehicles for special occasions.', NOW()),
('Economy', 'Affordable rental cars with reliable performance.', NOW()),
('SUV', 'Spacious SUVs suited for family travel and off-road comfort.', NOW());

INSERT INTO payment_methods (code, name, description, provider, is_active, created_at) VALUES
('credit_card', 'Credit Card', 'Pay with Visa, MasterCard, or Amex.', 'Stripe', TRUE, NOW()),
('paypal', 'PayPal', 'Pay securely with PayPal.', 'PayPal', TRUE, NOW()),
('cash', 'Cash', 'Pay with cash at pickup.', 'Manual', TRUE, NOW());

INSERT INTO booking_status (code, label, description, is_default, created_at) VALUES
('pending', 'Pending', 'Booking has been created and awaits confirmation.', TRUE, NOW()),
('confirmed', 'Confirmed', 'Booking has been confirmed and is active.', FALSE, NOW()),
('cancelled', 'Cancelled', 'Booking was cancelled by the user or admin.', FALSE, NOW()),
('completed', 'Completed', 'Booking has been completed successfully.', FALSE, NOW());

INSERT INTO users (first_name, last_name, email, phone, password, role, status, created_at, updated_at) VALUES
('Admin', 'User', 'admin@mychoize.com', '0000000000', '$2a$12$iyIlwKCgdbyBMAxIdswlDuqMEsCafFOCjmcSeSLzbZw7nyvUTeYy2', 'admin', 'active', NOW(), NOW()),
('John', 'Doe', 'john.doe@example.com', '1234567890', '$2a$12$iyIlwKCgdbyBMAxIdswlDuqMEsCafFOCjmcSeSLzbZw7nyvUTeYy2', 'user', 'active', NOW(), NOW());

INSERT INTO cars (category_id, make, model, vehicle_type, price_per_day, seats, transmission, fuel_type, image_url, description, status, is_active, created_at, updated_at) VALUES
(1, 'Mercedes-Benz', 'S-Class', 'Sedan', 249.99, 5, 'automatic', 'petrol', '', 'Luxury sedan with premium comfort and advanced safety.', 'available', TRUE, NOW(), NOW()),
(2, 'Toyota', 'Corolla', 'Sedan', 49.99, 5, 'automatic', 'petrol', '', 'Reliable economy car ideal for daily travel.', 'available', TRUE, NOW(), NOW()),
(3, 'Ford', 'Explorer', 'SUV', 79.99, 7, 'automatic', 'petrol', '', 'Roomy SUV perfect for family trips.', 'available', TRUE, NOW(), NOW());

INSERT INTO car_images (car_id, url, label, sort_order, is_primary, created_at, updated_at) VALUES
(1, '', 'Main', 0, TRUE, NOW(), NOW()),
(2, '', 'Main', 0, TRUE, NOW(), NOW()),
(3, '', 'Main', 0, TRUE, NOW(), NOW());

INSERT INTO car_availability (car_id, available_from, available_to, location, status, created_at, updated_at) VALUES
(1, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'City Center', 'available', NOW(), NOW()),
(2, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Airport', 'available', NOW(), NOW()),
(3, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Downtown', 'available', NOW(), NOW());

INSERT INTO bookings (user_id, car_id, booking_status_id, pickup_location, dropoff_location, pickup_datetime, return_datetime, price_total, currency, notes, status, created_at, updated_at) VALUES
(2, 2, 1, 'Airport', 'Downtown', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY), 149.97, 'USD', 'Need child seat.', 'pending', NOW(), NOW());

INSERT INTO payments (booking_id, user_id, payment_method_id, method, amount, currency, transaction_id, status, payment_date, created_at, updated_at) VALUES
(1, 2, 1, 'credit_card', 149.97, 'USD', 'TXN1001', 'completed', NOW(), NOW(), NOW());

INSERT INTO invoices (booking_id, payment_id, invoice_number, invoice_date, due_date, amount_due, tax_amount, tax_rate, currency, status, generated_at, created_at, updated_at) VALUES
(1, 1, 'INV-1001', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 149.97, 0.00, 0.00, 'USD', 'issued', NOW(), NOW(), NOW());

INSERT INTO reviews (user_id, car_id, rating, title, comment, created_at, updated_at) VALUES
(2, 2, 5, 'Great ride', 'Comfortable and fuel-efficient.', NOW(), NOW());

INSERT INTO favorites (user_id, car_id, created_at) VALUES
(2, 1, NOW());

INSERT INTO notifications (user_id, title, message, type, action_url, is_read, created_at, updated_at) VALUES
(2, 'Welcome to MyChoize', 'Your account has been created successfully.', 'info', NULL, FALSE, NOW(), NOW());
