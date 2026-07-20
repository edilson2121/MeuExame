# 📚 Documentação Completa do MeuExame

## 🗂️ Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Comandos Essenciais](#comandos-essenciais)
5. [Backend - NestJS](#backend---nestjs)
6. [Frontend - Next.js](#frontend---nextjs)
7. [Banco de Dados](#banco-de-dados)
8. [Sistema de Pagamentos](#sistema-de-pagamentos)
9. [Autenticação e Autorização](#autenticação-e-autorização)
10. [Sistema de Backup](#sistema-de-backup)
11. [Deploy](#deploy)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **MeuExame** é uma plataforma educacional moçambicana completa com:

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + TailwindCSS
- **Pagamentos**: DebitoPay (M-Pesa, E-Mola)
- **Autenticação**: JWT + Google OAuth
- **Backup**: Sistema automático diário
- **Design**: Cores da bandeira de Moçambique

### URLs Padrão
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5432`

---

## 📁 Estrutura do Projeto

```
MeuExame/
├── 📄 DOCUMENTAÇÃO
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── DOCUMENTACAO_COMPLETA.md ← Você está aqui
│   └── ...
│
├── ⚙️ CONFIGURAÇÃO
│   ├── .env                    ← Variáveis de ambiente
│   ├── .env.example            ← Template
│   ├── docker-compose.yml      ← Orquestração Docker
│   ├── tsconfig.json           ← Config TypeScript
│   └── schema.prisma           ← Schema do banco
│
├── backend/                    ← SERVIDOR NESTJS
│   ├── src/
│   │   ├── admin/              ← Rotas admin
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.module.ts
│   │   ├── auth/               ← Autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── roles.decorator.ts
│   │   │   ├── google-auth.guard.ts
│   │   │   ├── profile.controller.ts
│   │   │   └── dto/
│   │   ├── payments/           ← Pagamentos
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.module.ts
│   │   │   ├── debitopay.service.ts
│   │   │   └── dto/
│   │   ├── materials/          ← Conteúdo educacional
│   │   │   ├── materials.controller.ts
│   │   │   ├── materials.service.ts
│   │   │   └── materials.module.ts
│   │   ├── pages/              ← Páginas dinâmicas
│   │   │   ├── pages.controller.ts
│   │   │   └── pages.module.ts
│   │   ├── uploads/            ← Upload de arquivos
│   │   │   ├── uploads.controller.ts
│   │   │   ├── uploads.service.ts
│   │   │   └── uploads.module.ts
│   │   ├── backup/             ← Sistema de backup
│   │   │   ├── backup.controller.ts
│   │   │   ├── backup.service.ts
│   │   │   └── backup.module.ts
│   │   ├── prisma/             ← ORM
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts       ← Módulo principal
│   │   └── main.ts             ← Entry point
│   ├── prisma/
│   │   └── schema.prisma       ← Schema do banco
│   ├── uploads/                ← Arquivos uploadados
│   │   ├── avatars/
│   │   └── exams/
│   ├── backups/                ← Backups do banco
│   ├── package.json            ← Dependências backend
│   └── tsconfig.json           ← Config TypeScript
│
└── frontend/                   ← WEBSITE NEXTJS
    ├── src/
    │   ├── app/                ← Rotas Next.js
    │   │   ├── page.tsx        ← Home
    │   │   ├── login/          ← Login
    │   │   ├── register/       ← Registro
    │   │   ├── perfil/         ← Perfil do usuário
    │   │   ├── pagamento/      ← Pagamento
    │   │   ├── instituicoes/   ← Instituições
    │   │   ├── admin/          ← Painel admin
    │   │   ├── auth/           ← Callback OAuth
    │   │   └── paginas/        ← Páginas dinâmicas
    │   ├── components/         ← Componentes React
    │   │   └── payments/
    │   │       ├── TransactionMpesa.tsx
    │   │       └── TransactionEmola.tsx
    │   ├── app/
    │   │   ├── api/            ← API routes
    │   │   │   └── payments/
    │   │   │       └── route.ts
    │   │   └── globals.css      ← Estilos globais
    ├── package.json            ← Dependências frontend
    ├── next.config.js          ← Config Next.js
    └── tailwind.config.js      ← Config Tailwind
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Docker (opcional)
- Git

### 1. Clonar o Projeto
```bash
cd C:\Users\Administrator\Desktop\meuexame\MeuExame
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar template
cp .env.example .env

# Editar .env com suas credenciais
```

**Variáveis essenciais no .env:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/meuexame"

# JWT
JWT_SECRET="seu-segredo-super-secreto"
JWT_EXPIRES_IN="7d"

# URLs
BACKEND_PORT=3001
FRONTEND_PORT=3000
FRONTEND_URL="http://localhost:3000"

# DebitoPay
DEBITO_SECRET_KEY="sk_live_..."
DEBITO_WALLET_CODE="15156"
DEBITO_WALLET_CODE_EMOLA="61526"
DEBITO_MERCHANT_ID="..."
DEBITO_API_URL="https://..."
DEBITO_WEBHOOK="whsec_..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

### 3. Instalar Dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configurar Banco de Dados
```bash
# Backend
cd backend

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# (Opcional) Seed inicial
npx prisma db seed
```

---

## 💻 Comandos Essenciais

### Backend (NestJS)
```bash
cd backend

# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Prisma
npx prisma generate              # Gerar client
npx prisma migrate dev           # Criar migration
npx prisma migrate deploy        # Deploy migration
npx prisma studio                # Visualizador DB
npx prisma db seed               # Seed inicial
```

### Frontend (Next.js)
```bash
cd frontend

# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start

# Lint
npm run lint
```

### Docker
```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose stop

# Reiniciar
docker-compose restart

# Limpar tudo
docker-compose down -v
```

---

## 🔙 Backend - NestJS

### Localização
- **Diretório**: `backend/`
- **Porta**: 3001
- **Entry Point**: `backend/src/main.ts`

### Estrutura de Módulos

#### 1. Auth Module (`backend/src/auth/`)
**Responsável**: Autenticação e autorização

**Arquivos**:
- `auth.controller.ts` - Endpoints de login/registro
- `auth.service.ts` - Lógica de autenticação
- `auth.module.ts` - Configuração do módulo
- `jwt.strategy.ts` - Estratégia JWT
- `google.strategy.ts` - Estratégia Google OAuth
- `jwt-auth.guard.ts` - Guard JWT
- `roles.guard.ts` - Guard de roles
- `roles.decorator.ts` - Decorador de roles
- `google-auth.guard.ts` - Guard Google
- `profile.controller.ts` - Endpoints de perfil
- `dto/` - DTOs de validação

**Endpoints**:
```typescript
POST   /auth/login              ← Login normal
POST   /auth/admin/login        ← Login admin
POST   /auth/register           ← Registro
GET    /auth/google             ← Iniciar Google OAuth
GET    /auth/google/callback    ← Callback Google OAuth
GET    /auth/profile            ← Obter perfil
PUT    /auth/profile            ← Atualizar perfil
```

**Dependências**:
```json
{
  "@nestjs/passport": "*",
  "@nestjs/jwt": "*",
  "passport": "*",
  "passport-jwt": "*",
  "passport-google-oauth20": "*",
  "bcryptjs": "*",
  "class-validator": "*",
  "class-transformer": "*"
}
```

#### 2. Payments Module (`backend/src/payments/`)
**Responsável**: Sistema de pagamentos

**Arquivos**:
- `payments.controller.ts` - Endpoints de pagamento
- `payments.service.ts` - Lógica de pagamentos
- `payments.module.ts` - Configuração
- `debitopay.service.ts` - Integração DebitoPay
- `dto/create-payment.dto.ts` - DTO de criação

**Endpoints**:
```typescript
POST   /payments/initiate       ← Iniciar pagamento
GET    /payments/status/:id     ← Verificar status
GET    /payments/user           ← Pagamentos do usuário
GET    /payments/all            ← Todos os pagamentos (admin)
PUT    /payments/status/:id     ← Atualizar status (admin)
GET    /payments/subscription   ← Assinatura do usuário
```

**Dependências**:
```json
{
  "axios": "*",
  "class-validator": "*"
}
```

#### 3. Materials Module (`backend/src/materials/`)
**Responsável**: Conteúdo educacional

**Arquivos**:
- `materials.controller.ts` - Endpoints de materiais
- `materials.service.ts` - Lógica de materiais
- `materials.module.ts` - Configuração

**Endpoints**:
```typescript
POST   /materials               ← Criar material (admin)
GET    /materials/published     ← Materiais publicados
GET    /materials/:id           ← Material específico
PUT    /materials/:id           ← Atualizar (admin)
DELETE /materials/:id           ← Deletar (admin)
POST   /materials/:id/submit    ← Submeter exame
GET    /materials/:id/results    ← Resultados
```

#### 4. Admin Module (`backend/src/admin/`)
**Responsável**: Painel administrativo

**Arquivos**:
- `admin.controller.ts` - Endpoints admin
- `admin.module.ts` - Configuração

**Endpoints**:
```typescript
GET    /admin/dashboard          ← Estatísticas
GET    /admin/users             ← Todos os usuários
GET    /admin/users/:id         ← Usuário específico
PUT    /admin/users/:id/role    ← Atualizar role
GET    /admin/institutions      ← Todas instituições
POST   /admin/institutions      ← Criar instituição
PUT    /admin/institutions/:id  ← Atualizar instituição
DELETE /admin/institutions/:id  ← Deletar instituição
GET    /admin/subjects          ← Todas disciplinas
POST   /admin/subjects          ← Criar disciplina
PUT    /admin/subjects/:id      ← Atualizar disciplina
DELETE /admin/subjects/:id      ← Deletar disciplina
GET    /admin/materials         ← Todos os materiais
GET    /admin/pages             ← Todas páginas
POST   /admin/pages             ← Criar página
PUT    /admin/pages/:id         ← Atualizar página
DELETE /admin/pages/:id         ← Deletar página
PUT    /admin/pages/:id/publish ← Publicar página
```

#### 5. Pages Module (`backend/src/pages/`)
**Responsável**: Páginas públicas

**Arquivos**:
- `pages.controller.ts` - Endpoints públicos
- `pages.module.ts` - Configuração

**Endpoints**:
```typescript
GET    /pages/:slug             ← Página por slug
GET    /pages                   ← Todas as páginas publicadas
```

#### 6. Uploads Module (`backend/src/uploads/`)
**Responsável**: Upload de arquivos

**Arquivos**:
- `uploads.controller.ts` - Endpoints de upload
- `uploads.service.ts` - Lógica de upload
- `uploads.module.ts` - Configuração

**Endpoints**:
```typescript
POST   /uploads/avatar          ← Upload avatar (usuário)
POST   /uploads/image           ← Upload imagem (admin/teacher)
POST   /uploads/exam-image      ← Upload exame (admin/teacher)
```

**Dependências**:
```json
{
  "@nestjs/platform-express": "*",
  "multer": "*",
  "@types/multer": "*"
}
```

#### 7. Backup Module (`backend/src/backup/`)
**Responsável**: Sistema de backup

**Arquivos**:
- `backup.controller.ts` - Endpoints de backup
- `backup.service.ts` - Lógica de backup
- `backup.module.ts` - Configuração

**Endpoints**:
```typescript
POST   /backup/manual           ← Backup manual
GET    /backup/list             ← Listar backups
POST   /backup/restore          ← Restaurar backup
```

**Dependências**:
```json
{
  "@nestjs/schedule": "*"
}
```

### Prisma Service
**Localização**: `backend/src/prisma/prisma.service.ts`

**Responsável**: Conexão com banco de dados

```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

## 🎨 Frontend - Next.js

### Localização
- **Diretório**: `frontend/`
- **Porta**: 3000
- **Entry Point**: `frontend/src/app/page.tsx`

### Estrutura de Rotas

#### 1. Página Principal (`frontend/src/app/page.tsx`)
**Responsável**: Landing page

**Componentes**:
- Logo
- Título
- Botões de navegação
- Link para pagamento

#### 2. Login (`frontend/src/app/login/page.tsx`)
**Responsável**: Autenticação

**Funcionalidades**:
- Login com email/senha
- Login com Google OAuth
- Link para registro
- Recuperação de senha

#### 3. Registro (`frontend/src/app/register/page.tsx`)
**Responsável**: Novos usuários

**Funcionalidades**:
- Registro com email/senha
- Registro com Google OAuth
- Validação de senha
- Link para login

#### 4. Perfil (`frontend/src/app/perfil/page.tsx`)
**Responsável**: Gerenciamento de perfil

**Funcionalidades**:
- Upload de avatar
- Editar nome
- Editar telefone
- Editar bio
- Ver assinatura

#### 5. Pagamento (`frontend/src/app/pagamento/page.tsx`)
**Responsível**: Processamento de pagamento

**Funcionalidades**:
- Seleção de método (M-Pesa/E-Mola)
- Componentes de transação
- Polling de status
- Modais de feedback

**Componentes**:
- `TransactionMpesa.tsx` - Interface M-Pesa
- `TransactionEmola.tsx` - Interface E-Mola

#### 6. Instituições (`frontend/src/app/instituicoes/`)
**Responsável**: Navegação por instituição

**Rotas**:
- `/instituicoes` - Lista de instituições
- `/instituicoes/[id]` - Detalhes da instituição
- `/instituicoes/[id]/disciplinas` - Disciplinas da instituição
- `/instituicoes/[id]/disciplinas/[subjectId]/exames` - Exames da disciplina

#### 7. Admin (`frontend/src/app/admin/`)
**Responsável**: Painel administrativo

**Rotas**:
- `/admin/dashboard` - Dashboard
- `/admin/paginas` - Gerenciar páginas
- `/admin/usuarios` - Gerenciar usuários
- `/admin/pagamentos` - Gerenciar pagamentos

#### 8. Páginas Dinâmicas (`frontend/src/app/paginas/[slug]/page.tsx`)
**Responsável**: Páginas públicas

**Funcionalidades**:
- Renderização de páginas
- Exibição de conteúdo
- Navegação

### API Routes
**Localização**: `frontend/src/app/api/`

#### Payments API (`frontend/src/app/api/payments/route.ts`)
**Responsável**: Proxy para backend

**Endpoints**:
```typescript
POST   /api/payments           ← Iniciar pagamento
GET    /api/payments/:id       ← Verificar status
```

### Componentes
**Localização**: `frontend/src/components/`

#### Payment Components (`frontend/src/components/payments/`)
- `TransactionMpesa.tsx` - Interface M-Pesa
- `TransactionEmola.tsx` - Interface E-Mola

### Estilos Globais
**Localização**: `frontend/src/app/globals.css`

**Características**:
- Cores da bandeira de Moçambique
- Variáveis CSS
- Classes utilitárias
- Componentes estilizados

---

## 🗄️ Banco de Dados

### Localização
- **Schema**: `schema.prisma`
- **Tipo**: PostgreSQL
- **Porta**: 5432

### Models Principais

#### User
```prisma
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  password      String
  name          String
  avatar        String?
  phone         String?
  bio           String?
  role          Role        @default(USER)
  institutionId String?
  institution   Institution?
  subscriptions Subscription[]
  payments      Payment[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

#### Institution
```prisma
model Institution {
  id          String   @id @default(cuid())
  name        String
  description String?
  city        String?
  country     String   @default("Moçambique")
  users       User[]
  subjects    Subject[]
  materials   EducationalMaterial[]
  pages       InstitutionPage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Subject (Disciplina)
```prisma
model Subject {
  id             String   @id @default(cuid())
  name           String
  description    String?
  institutionId  String
  institution    Institution @relation(fields: [institutionId], references: [id])
  materials      EducationalMaterial[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

#### EducationalMaterial (Material)
```prisma
model EducationalMaterial {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String
  type        ContentType @default(TEXT)
  imageUrl    String?
  subjectId   String
  creatorId   String
  isPublished Boolean  @default(false)
  isBlocked   Boolean  @default(false)
  subject     Subject  @relation(fields: [subjectId], references: [id])
  creator     User     @relation(fields: [creatorId], references: [id])
  questions   Question[]
  results     Result[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Question
```prisma
model Question {
  id              String   @id @default(cuid())
  text            String
  imageUrl        String?
  options         String[]
  correctAnswer   String
  explanation     String?
  difficulty     Difficulty @default(MEDIUM)
  materialId      String
  material        EducationalMaterial @relation(fields: [materialId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### Result
```prisma
model Result {
  id          String   @id @default(cuid())
  score       Float
  userId      String
  materialId  String
  user        User     @relation(fields: [userId], references: [id])
  material    EducationalMaterial @relation(fields: [materialId], references: [id])
  createdAt   DateTime @default(now())
}
```

#### Subscription
```prisma
model Subscription {
  id          String   @id @default(cuid())
  plan        String
  status      SubscriptionStatus @default(ACTIVE)
  startDate   DateTime @default(now())
  endDate     DateTime
  isActive    Boolean  @default(true)
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  payments    Payment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Payment
```prisma
model Payment {
  id              String   @id @default(cuid())
  amount          Float
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  transactionId   String?
  phone           String?
  userId          String
  subscriptionId  String?
  user            User         @relation(fields: [userId], references: [id])
  subscription    Subscription? @relation(fields: [subscriptionId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### InstitutionPage
```prisma
model InstitutionPage {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  content     String?
  layoutId    String   @default("default")
  settings    Json?
  status      PageStatus @default(DRAFT)
  showInMenu  Boolean  @default(false)
  menuOrder   Int      @default(0)
  publishedAt DateTime?
  institutionId String
  institution Institution @relation(fields: [institutionId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Enums
```prisma
enum Role {
  USER
  ADMIN
  TEACHER
}

enum ContentType {
  TEXT
  VIDEO
  PDF
  QUIZ
  MANUAL
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum PaymentMethod {
  MPESA
  EMOLA
  BANK
  CASH
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PageStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

## 💳 Sistema de Pagamentos

### DebitoPay Integration
**Localização**: `backend/src/payments/debitopay.service.ts`

**Funcionalidades**:
- Iniciar pagamento M-Pesa
- Iniciar pagamento E-Mola
- Verificar status de pagamento
- Polling automático

**Métodos**:
```typescript
async initiateMpesaPayment(phone: string, amount: number)
async initiateEmolaPayment(phone: string, amount: number)
async checkPaymentStatus(transactionId: string)
```

### Endpoints de Pagamento
```typescript
POST   /payments/initiate
  Body: {
    phone: string,
    method: "MPESA" | "EMOLA",
    amount: number
  }

GET    /payments/status/:id

GET    /payments/user

GET    /payments/all (admin)

PUT    /payments/status/:id (admin)
  Body: {
    status: "COMPLETED" | "FAILED"
  }
```

### Frontend Payment Flow
1. Usuário seleciona método (M-Pesa/E-Mola)
2. Digita número de telefone
3. Sistema inicia pagamento via DebitoPay
4. Sistema faz polling de status
5. Usuário recebe feedback em tempo real
6. Após pagamento, assinatura é ativada

---

## 🔐 Autenticação e Autorização

### JWT Strategy
**Localização**: `backend/src/auth/jwt.strategy.ts`

**Funcionalidade**:
- Valida token JWT
- Retorna usuário do banco
- Inclui role no payload

### Google OAuth
**Localização**: `backend/src/auth/google.strategy.ts`

**Funcionalidade**:
- Autenticação com Google
- Criação automática de usuário
- Atualização de avatar

### Guards
**Localização**: `backend/src/auth/`

**JwtAuthGuard**:
- Protege rotas que requerem autenticação
- Valida token JWT

**RolesGuard**:
- Protege rotas por role
- Usa decorator @Roles()

**GoogleAuthGuard**:
- Protege rotas OAuth
- Redireciona para Google

### Decorators
**@Roles()**:
```typescript
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
async adminOnlyEndpoint() {
  // Apenas admin pode acessar
}
```

### Fluxo de Autenticação
1. Usuário faz login (email/senha ou Google)
2. Backend gera token JWT
3. Frontend armazena token no localStorage
4. Frontend envia token em cada requisição
5. Backend valida token com guards
6. Backend verifica role com RolesGuard

---

## 💾 Sistema de Backup

### Backup Service
**Localização**: `backend/src/backup/backup.service.ts`

**Funcionalidades**:
- Backup automático diário (meia-noite)
- Backup manual
- Limpeza automática (mantém 7 dias)
- Restauração de backup

### Cron Job
```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async handleDailyBackup() {
  // Executa backup automaticamente
}
```

### Endpoints de Backup
```typescript
POST   /backup/manual           ← Backup manual
GET    /backup/list             ← Listar backups
POST   /backup/restore          ← Restaurar backup
  Body: {
    fileName: string
  }
```

### Localização dos Backups
- **Diretório**: `backend/backups/`
- **Formato**: `.sql.gz` (comprimido)
- **Nome**: `backup-TIMESTAMP.sql.gz`

---

## 🚀 Deploy

### Produção com Docker
```bash
# Build imagens
docker-compose build

# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Variáveis de Produção
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@prod-db:5432/meuexame"
JWT_SECRET="seu-segredo-producao"
BACKEND_PORT=3001
FRONTEND_PORT=3000
FRONTEND_URL="https://seu-dominio.com"
```

### Deploy Manual (Sem Docker)

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

### Nginx (Proxy Reverso)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🛠️ Troubleshooting

### Problema: Backend não inicia
**Solução**:
```bash
# Verificar se PostgreSQL está rodando
docker ps

# Verificar logs
docker-compose logs backend

# Reiniciar backend
docker-compose restart backend
```

### Problema: Frontend não conecta ao backend
**Solução**:
```bash
# Verificar variável NEXT_PUBLIC_API_URL
# No frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Reiniciar frontend
npm run dev
```

### Problema: Pagamento falha
**Solução**:
```bash
# Verificar chaves DebitoPay no .env
DEBITO_SECRET_KEY=...
DEBITO_WALLET_CODE=...

# Verificar logs do backend
docker-compose logs backend | grep payment
```

### Problema: Google OAuth não funciona
**Solução**:
```bash
# Verificar credenciais Google
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Verificar callback URL no Google Console
# Deve ser: http://localhost:3000/auth/google/callback
```

### Problema: Backup não funciona
**Solução**:
```bash
# Verificar se pg_dump está instalado
pg_dump --version

# Verificar permissões do diretório backups
ls -la backend/backups

# Testar backup manual
curl -X POST http://localhost:3001/backup/manual \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Problema: Upload de avatar falha
**Solução**:
```bash
# Verificar se diretório existe
mkdir -p backend/uploads/avatars

# Verificar permissões
chmod 755 backend/uploads/avatars

# Verificar tamanho do arquivo (máximo 5MB)
```

---

## 📞 Suporte

### Logs
```bash
# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# PostgreSQL
docker-compose logs -f postgres
```

### Debug
```bash
# Backend com debug
cd backend
npm run start:debug

# Frontend com debug
cd frontend
npm run dev
```

### Testar API
```bash
# Health check
curl http://localhost:3001

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@meuexame.com","password":"admin123"}'
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [NestJS](https://docs.nestjs.com/)
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)

### Ferramentas
- [Prisma Studio](https://www.prisma.io/docs/concepts/components/prisma-studio)
- [Postman](https://www.postman.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## ✅ Checklist de Implementação

- [x] Backend NestJS configurado
- [x] Frontend Next.js configurado
- [x] PostgreSQL configurado
- [x] Prisma ORM configurado
- [x] Autenticação JWT
- [x] Google OAuth
- [x] Sistema de pagamentos DebitoPay
- [x] Upload de arquivos
- [x] Sistema de backup
- [x] Guards de autorização
- [x] Roles (USER, ADMIN, TEACHER)
- [x] Páginas dinâmicas
- [x] Interface responsiva
- [x] Cores moçambicanas
- [x] 3 questões gratuitas por exame
- [x] Perfil do usuário
- [x] Manuais por disciplina

---

## 🎓 Conclusão

Esta documentação cobre todos os aspectos do sistema MeuExame. Para dúvidas específicas, consulte os arquivos de documentação adicionais ou verifique os logs do sistema.

**Sistema pronto para produção! 🚀**
