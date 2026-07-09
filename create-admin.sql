INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin',
  'admin@admin.com',
  'Admin User',
  '\\\.Mr/.rqYh9wVj5wG7dQYtY5yV5V5V5V5',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id, email;
