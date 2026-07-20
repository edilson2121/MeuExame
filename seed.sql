INSERT INTO "users" (id, email, password, name, phone, role, "createdAt", "updatedAt") 
VALUES (
    gen_random_uuid()::text, 
    'admin@meuexame.com', 
    '.yPZY9kFZce9x6.5t3JPXqW5vqv2MPz4zY8nH.z4xW', 
    'Administrador', 
    '823456789', 
    'ADMIN', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO "users" (id, email, password, name, phone, role, "createdAt", "updatedAt") 
VALUES (
    gen_random_uuid()::text, 
    'joao@teste.com', 
    '.yPZY9kFZce9x6.5t3JPXqW5vqv2MPz4zY8nH.z4xW', 
    'João Silva', 
    '823456789', 
    'USER', 
    NOW(), 
    NOW()
) ON CONFLICT (email) DO NOTHING;
