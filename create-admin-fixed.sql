DELETE FROM users WHERE email = 'admin@admin.com';
INSERT INTO users (id, email, password, name, role, \"createdAt\", \"updatedAt\")
VALUES (
  'admin_2',
  'admin@admin.com',
  '\\\',
  'Administrador',
  'ADMIN',
  NOW(),
  NOW()
);
