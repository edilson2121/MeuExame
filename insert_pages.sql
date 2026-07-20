INSERT INTO pages (id, title, slug, content, showInMenu, menuOrder, status, authorId, createdAt, updatedAt)
VALUES 
  (gen_random_uuid()::text, 'Página Inicial', 'home', 'Conteúdo da página inicial', true, 1, 'PUBLISHED', 'admin@meuexame.com', NOW(), NOW()),
  (gen_random_uuid()::text, 'Sobre Nós', 'sobre', 'Conteúdo sobre nós', true, 2, 'PUBLISHED', 'admin@meuexame.com', NOW(), NOW()),
  (gen_random_uuid()::text, 'Nossos Cursos', 'cursos', 'Conteúdo dos cursos', true, 3, 'PUBLISHED', 'admin@meuexame.com', NOW(), NOW()),
  (gen_random_uuid()::text, 'Contato', 'contato', 'Conteúdo de contato', true, 4, 'PUBLISHED', 'admin@meuexame.com', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
