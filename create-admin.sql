INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(), 
  'admin@teste.com', 
  '\\\', 
  'Admin', 
  'ADMIN', 
  NOW(), 
  NOW()
);
