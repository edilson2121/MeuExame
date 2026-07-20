╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    📖 MEUEXAME - DOCUMENTAÇÃO DA API                         ║
║                                                                              ║
║  URL BASE: http://localhost:3001/api                                        ║
║  VERSÃO: 1.0.0                                                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          🔐 AUTENTICAÇÃO                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  POST /api/auth/login                                                        ║
║  ├─ Descrição: Login de usuário                                             ║
║  ├─ Body: { "email": "admin@admin.com", "password": "admin123" }            ║
║  └─ Response: { "token": "jwt_token", "user": { ... } }                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          👥 USUÁRIOS                                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  GET  /api/users            - Listar todos os usuários                      ║
║  GET  /api/users/:id        - Buscar usuário por ID                         ║
║  PATCH /api/users/:id       - Atualizar usuário                             ║
║  DELETE /api/users/:id      - Remover usuário                               ║
║                                                                              ║
║  🔒 Todas as rotas requerem autenticação (Bearer Token)                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          🏛️ INSTITUIÇÕES                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  POST /api/institutions      - Criar instituição                            ║
║  GET  /api/institutions      - Listar todas as instituições                 ║
║  GET  /api/institutions/:id  - Buscar instituição por ID                    ║
║  PATCH /api/institutions/:id - Atualizar instituição                        ║
║  DELETE /api/institutions/:id- Remover instituição                          ║
║                                                                              ║
║  📝 Body: { "name": "Universidade Federal", "description": "..." }         ║
║  🔒 Requer autenticação                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          📚 CURSOS                                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  POST /api/courses           - Criar curso                                  ║
║  GET  /api/courses           - Listar todos os cursos                       ║
║  GET  /api/courses/:id       - Buscar curso por ID                          ║
║  PATCH /api/courses/:id      - Atualizar curso                              ║
║  DELETE /api/courses/:id     - Remover curso                                ║
║                                                                              ║
║  📝 Body: { "name": "Engenharia de Software", "institutionId": "..." }     ║
║  🔒 Requer autenticação                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          📖 DISCIPLINAS                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  POST /api/subjects          - Criar disciplina                             ║
║  GET  /api/subjects          - Listar todas as disciplinas                  ║
║  GET  /api/subjects/:id      - Buscar disciplina por ID                     ║
║  PATCH /api/subjects/:id     - Atualizar disciplina                         ║
║  DELETE /api/subjects/:id    - Remover disciplina                           ║
║                                                                              ║
║  📝 Body: { "name": "Banco de Dados", "courseId": "..." }                  ║
║  🔒 Requer autenticação                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          📄 CONTEÚDOS                                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  POST /api/contents          - Criar conteúdo                               ║
║  GET  /api/contents          - Listar todos os conteúdos                    ║
║  GET  /api/contents/:id      - Buscar conteúdo por ID                       ║
║  PATCH /api/contents/:id     - Atualizar conteúdo                           ║
║  DELETE /api/contents/:id    - Remover conteúdo                             ║
║                                                                              ║
║  📝 Body: { "title": "Introdução", "body": "...", "userId": "..." }        ║
║  🔒 Requer autenticação                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          📄 PÁGINAS DINÂMICAS (NOVO!)                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  📌 ADMIN ROUTES (requer autenticação)                                     ║
║                                                                              ║
║  POST /api/pages              - Criar página                                ║
║  GET  /api/pages/admin        - Listar todas as páginas                     ║
║  GET  /api/pages/admin/:id    - Buscar página por ID                        ║
║  PATCH /api/pages/:id         - Atualizar página                            ║
║  DELETE /api/pages/:id        - Remover página                              ║
║  PATCH /api/pages/:id/publish - Publicar página                             ║
║  PATCH /api/pages/:id/unpublish - Despublicar página                       ║
║                                                                              ║
║  📝 Body: {                                                                 ║
║    "title": "Sobre Nós",                                                    ║
║    "slug": "sobre",                                                         ║
║    "content": "<h1>Sobre</h1><p>...</p>",                                  ║
║    "description": "Descrição para SEO",                                    ║
║    "showInMenu": true,                                                      ║
║    "status": "published"                                                    ║
║  }                                                                          ║
║                                                                              ║
║  📌 SEÇÕES                                                                  ║
║                                                                              ║
║  POST /api/pages/:id/sections   - Adicionar seção à página                  ║
║  PATCH /api/pages/sections/:id  - Atualizar seção                           ║
║  DELETE /api/pages/sections/:id - Remover seção                             ║
║                                                                              ║
║  📌 PUBLIC ROUTES (não requer autenticação)                                ║
║                                                                              ║
║  GET /api/pages/menu            - Listar páginas do menu                    ║
║  GET /api/pages/:slug           - Buscar página publicada por slug          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          🔑 AUTENTICAÇÃO                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Todas as rotas que requerem autenticação devem enviar o token no header:   ║
║                                                                              ║
║  Authorization: Bearer <seu_token_jwt>                                     ║
║                                                                              ║
║  Exemplo:                                                                   ║
║  curl -X GET http://localhost:3001/api/users \                             ║
║    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          📊 FRONTEND - ROTAS                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  🌐 http://localhost:3003                                                   ║
║                                                                              ║
║  /                     - Página inicial (Landing)                           ║
║  /login               - Página de login                                    ║
║  /register            - Página de registro                                 ║
║  /dashboard           - Dashboard do usuário                               ║
║  /admin               - Painel Administrativo                              ║
║  /admin/pages         - Gerenciar páginas                                  ║
║  /admin/pages/new     - Criar nova página                                  ║
║  /pages/:slug         - Visualizar página dinâmica                         ║
║  /institutions        - Listar instituições                                ║
║  /courses             - Listar cursos                                      ║
║  /subjects            - Listar disciplinas                                 ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║                          🚀 EXEMPLOS DE USO                                ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  1. Login:                                                                  ║
║     POST /api/auth/login                                                    ║
║     Body: { "email": "admin@admin.com", "password": "admin123" }            ║
║                                                                              ║
║  2. Criar instituição:                                                      ║
║     POST /api/institutions                                                  ║
║     Body: { "name": "Universidade Federal" }                               ║
║                                                                              ║
║  3. Criar curso:                                                            ║
║     POST /api/courses                                                       ║
║     Body: { "name": "Engenharia", "institutionId": "..." }                 ║
║                                                                              ║
║  4. Criar página:                                                           ║
║     POST /api/pages                                                         ║
║     Body: { "title": "Sobre", "slug": "sobre", "content": "<h1>...</h1>" } ║
║                                                                              ║
║  5. Visualizar página:                                                      ║
║     GET /api/pages/sobre                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
