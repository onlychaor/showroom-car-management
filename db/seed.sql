-- Seed sample data
-- Create users and remember ids for FK
WITH u AS (
  INSERT INTO users (name, email, phone) VALUES
  ('John Carter','john@example.com','0123456789'),
  ('Sophie Moore','sophie@example.com','0987654321')
  RETURNING id, email
)
INSERT INTO cars (owner_id, name, color, price, registration_expires_at) VALUES
((SELECT id FROM users WHERE email='john@example.com'), 'Ford Transit','xanh lam','800 triệu', now()::date + INTERVAL '10 days'),
((SELECT id FROM users WHERE email='sophie@example.com'), 'Honda Civic','tím','800tr', now()::date - INTERVAL '2 days');

INSERT INTO contacts (user_id, car_id, title, email, status, scheduled_at) VALUES
((SELECT id FROM users WHERE email='john@example.com'), (SELECT id FROM cars WHERE name='Ford Transit'), 'Contact A','contactA@example.com','Đã hoàn thành', now() - INTERVAL '3 days'),
((SELECT id FROM users WHERE email='sophie@example.com'), (SELECT id FROM cars WHERE name='Honda Civic'), 'Contact B','contactB@example.com','Chưa hoàn thành', now() + INTERVAL '2 days');