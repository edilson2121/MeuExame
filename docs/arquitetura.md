# Arquitetura do Sistema MeuExame

## Visão Geral

O MeuExame é uma plataforma educacional completa para preparação de exames de admissão em Moçambique, utilizando uma arquitetura moderna e escalável baseada em microserviços.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 16.2.9
- **Estilização**: TailwindCSS
- **Gerenciamento de Estado**: React Context API
- **Autenticação**: JWT com localStorage
- **Deploy**: Docker

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Autenticação**: JWT
- **Deploy**: Docker

## Estrutura de Pastas

```
MEUEXAME/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── docker/
│   ├── nginx/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── postgres/
│   │   └── init.sql
│   ├── redis/
│   │   └── redis.conf
│   └── backend/
│       └── Dockerfile
│
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── banners/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── institutions/
│   │   │   ├── courses/
│   │   │   ├── subjects/
│   │   │   ├── contents/
│   │   │   ├── exams/
│   │   │   ├── exercises/
│   │   │   ├── profile/
│   │   │   ├── search/
│   │   │   └── settings/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   ├── footer/
│   │   │   ├── cards/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── charts/
│   │   │   ├── modals/
│   │   │   └── buttons/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── middleware.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── middleware/
│   │   │   ├── pipes/
│   │   │   └── exceptions/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── institutions/
│   │   │   ├── courses/
│   │   │   ├── subjects/
│   │   │   ├── contents/
│   │   │   ├── exercises/
│   │   │   ├── questions/
│   │   │   ├── exams/
│   │   │   ├── simulations/
│   │   │   ├── study-contents/
│   │   │   ├── results/
│   │   │   ├── uploads/
│   │   │   ├── notifications/
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── database/
│   │   ├── storage/
│   │   ├── jobs/
│   │   ├── utils/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env
│   └── Dockerfile
│
├── docs/
│   ├── arquitetura.md
│   ├── api.md
│   ├── base-dados.md
│   ├── casos-de-uso.md
│   └── cronograma.md
│
├── scripts/
│   ├── backup.sh
│   ├── restore.sh
│   └── deploy.sh
│
├── uploads/
│   ├── profiles/
│   ├── documents/
│   └── images/
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Modelo de Dados

### Principais Entidades

#### User
- Autenticação e autorização
- Perfis de usuário (ADMIN, USER, TEACHER)
- Relacionamento com instituições

#### Institution
- Instituições de ensino moçambicanas
- Cursos associados
- Disciplinas por instituição

#### Course
- Cursos oferecidos pelas instituições
- Disciplinas por curso

#### Subject
- Disciplinas de estudo
- Conteúdos educativos
- Exames associados

#### Exam
- Exames de admissão
- Questões associadas
- Simulações realizadas

#### Question
- Questões de múltipla escolha
- Tipos: MULTIPLE_CHOICE, TRUE_FALSE, ESSAY, SHORT_ANSWER
- Pontuação e explicação

#### ExamQuestion
- Relacionamento entre exames e questões
- Ordem e pontuação por questão

#### ExamSimulation
- Simulações de exames realizadas por usuários
- Respostas e pontuação
- Status da simulação

#### StudyContent
- Conteúdos educativos para estudo
- Tipos: TEXT, VIDEO, PDF, QUIZ
- Views e likes

## Fluxo de Autenticação

1. **Registro**: Usuário cria conta com email e senha
2. **Login**: Credenciais validadas no backend
3. **Token**: JWT gerado e armazenado no localStorage
4. **Proteção**: Rotas protegidas verificam token válido
5. **Logout**: Token removido do localStorage

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/admin/login` - Login de administrador

### Instituições
- `GET /api/institutions` - Listar instituições
- `POST /api/institutions` - Criar instituição (ADMIN)
- `GET /api/institutions/:id` - Buscar instituição
- `PATCH /api/institutions/:id` - Atualizar instituição (ADMIN)
- `DELETE /api/institutions/:id` - Remover instituição (ADMIN)

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Criar curso (ADMIN)
- `GET /api/courses/:id` - Buscar curso
- `PATCH /api/courses/:id` - Atualizar curso (ADMIN)
- `DELETE /api/courses/:id` - Remover curso (ADMIN)

### Disciplinas
- `GET /api/subjects` - Listar disciplinas
- `POST /api/subjects` - Criar disciplina (ADMIN)
- `GET /api/subjects/:id` - Buscar disciplina
- `PATCH /api/subjects/:id` - Atualizar disciplina (ADMIN)
- `DELETE /api/subjects/:id` - Remover disciplina (ADMIN)

### Exames
- `GET /api/exams` - Listar exames
- `POST /api/exams` - Criar exame (ADMIN/TEACHER)
- `GET /api/exams/:id` - Buscar exame
- `PATCH /api/exams/:id` - Atualizar exame (ADMIN/TEACHER)
- `DELETE /api/exams/:id` - Remover exame (ADMIN/TEACHER)
- `POST /api/exams/:id/questions` - Adicionar questão (ADMIN/TEACHER)
- `DELETE /api/exams/:id/questions/:questionId` - Remover questão (ADMIN/TEACHER)
- `POST /api/exams/:id/publish` - Publicar exame (ADMIN/TEACHER)

### Questões
- `GET /api/questions` - Listar questões
- `POST /api/questions` - Criar questão (ADMIN/TEACHER)
- `GET /api/questions/:id` - Buscar questão
- `PATCH /api/questions/:id` - Atualizar questão (ADMIN/TEACHER)
- `DELETE /api/questions/:id` - Remover questão (ADMIN/TEACHER)

### Simulações
- `POST /api/simulations` - Criar simulação
- `GET /api/simulations` - Listar simulações (ADMIN)
- `GET /api/simulations/:id` - Buscar simulação
- `POST /api/simulations/start/:examId` - Iniciar simulação
- `POST /api/simulations/:id/complete` - Completar simulação

### Conteúdos de Estudo
- `GET /api/study-contents` - Listar conteúdos
- `POST /api/study-contents` - Criar conteúdo (ADMIN/TEACHER)
- `GET /api/study-contents/:id` - Buscar conteúdo
- `PATCH /api/study-contents/:id` - Atualizar conteúdo (ADMIN/TEACHER)
- `DELETE /api/study-contents/:id` - Remover conteúdo (ADMIN/TEACHER)
- `POST /api/study-contents/:id/publish` - Publicar conteúdo (ADMIN/TEACHER)

## Segurança

### Autenticação
- JWT tokens com expiração
- Senhas encriptadas com bcrypt
- Validação de email

### Autorização
- Guards de rota baseados em roles
- Decoradores para controle de acesso
- Proteção de endpoints sensíveis

### Validação
- DTOs com class-validator
- Sanitização de inputs
- Proteção contra SQL injection (Prisma)

## Deploy

### Desenvolvimento
```bash
docker-compose up
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Variáveis de Ambiente
- `DATABASE_URL` - String de conexão PostgreSQL
- `JWT_SECRET` - Segredo para assinatura JWT
- `REDIS_URL` - String de conexão Redis
- `NEXT_PUBLIC_API_URL` - URL da API para frontend

## Monitoramento

### Logs
- Sistema de logging estruturado
- Níveis de log: ERROR, WARN, INFO, DEBUG
- Logs centralizados em produção

### Métricas
- Tempo de resposta das APIs
- Taxa de erro
- Uso de recursos do servidor

## Backup

### Banco de Dados
- Backup diário automático
- Retenção de 7 dias
- Backup manual disponível

### Arquivos
- Backup de uploads
- Backup de configurações
- Backup de logs

## Escalabilidade

### Horizontal
- Múltiplas instâncias do backend
- Load balancing com Nginx
- Cache distribuído com Redis

### Vertical
- Aumento de recursos do servidor
- Otimização de consultas
- Indexação do banco de dados
