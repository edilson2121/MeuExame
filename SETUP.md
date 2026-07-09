# MeuExame - Sistema de Gerenciamento de Conteúdo Educacional

Um sistema completo de gerenciamento de conteúdo educacional com foco em Moçambique, permitindo que administradores criem e gerenciem páginas de instituições, controle de pagamentos e publicação de conteúdo.

## Características

- 📚 **Gerenciamento de Páginas**: Admins podem criar e editar páginas de instituições usando layouts predefinidos
- 💳 **Sistema de Pagamentos**: Controle completo de assinaturas e pagamentos dos usuários
- 🔒 **Publicação Controlada**: Frontend exibe apenas conteúdo publicado pelos admins
- 📱 **Interface Responsiva**: Frontend moderno com Next.js
- 🏗️ **Arquitetura Escalável**: Backend com NestJS e Prisma ORM
- 🗄️ **Banco de Dados PostgreSQL**: Persistência robusta
- 🐳 **Docker Compose**: Deployment simplificado

## Requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- PostgreSQL 15+ (se rodando fora do Docker)
- Redis (para cache e filas de processamento)

## Instalação Rápida com Docker

1. **Clone o repositório**:
```bash
cd C:\Users\Administrator\Desktop\meuexame\MeuExame
```

2. **Configure as variáveis de ambiente**:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env conforme necessário (valores padrão estão OK para desenvolvimento)
```

3. **Inicie os serviços**:
```bash
docker-compose up -d
```

4. **Execute as migrations do banco**:
```bash
docker-compose exec backend npm run prisma:migrate
```

5. **Seed do banco com dados iniciais** (opcional):
```bash
docker-compose exec backend npm run prisma:seed
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## Instalação para Desenvolvimento Local

### Backend

```bash
cd backend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações locais

# Execute migrations
npm run prisma:migrate

# Inicie em modo desenvolvimento
npm run start:dev
```

### Frontend

```bash
cd frontend

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Inicie em modo desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
MeuExame/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── admin/          # Módulo de administração
│   │   ├── auth/           # Autenticação e autorização
│   │   ├── institutions/   # Gerenciamento de instituições
│   │   ├── public-pages/   # Páginas públicas
│   │   └── ...
│   ├── prisma/             # Schema Prisma e migrations
│   └── Dockerfile
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Aplicação Next.js
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   └── ...
│   └── Dockerfile
├── docker/                 # Configurações Docker
├── docker-compose.yml      # Orquestração de containers
└── README.md
```

## API Endpoints Principais

### Admin - Gerenciamento de Páginas

```
POST   /admin/pages                              # Criar página
PUT    /admin/pages/:id                          # Editar página
PUT    /admin/pages/:id/publish                  # Publicar/Despublicar
GET    /admin/pages/institution/:institutionId  # Listar páginas da instituição
GET    /admin/pages/:id                          # Obter detalhes da página
DELETE /admin/pages/:id                          # Deletar página
```

### Admin - Gerenciamento de Layouts

```
POST   /admin/layouts                 # Criar layout
PUT    /admin/layouts/:id            # Editar layout
GET    /admin/layouts                # Listar layouts
GET    /admin/layouts/:id            # Obter layout
DELETE /admin/layouts/:id            # Deletar layout
```

### Admin - Gerenciamento de Pagamentos

```
POST   /admin/payments/subscription              # Criar assinatura
POST   /admin/payments/record                    # Registrar pagamento
PUT    /admin/payments/approve/:paymentId        # Aprovar/Rejeitar pagamento
GET    /admin/payments/pending                   # Pagamentos pendentes
GET    /admin/payments/subscription/:userId      # Assinatura do usuário
GET    /admin/payments/institution/:institutionId/status  # Status de pagamento
```

### Público - Páginas Publicadas

```
GET    /public/pages/institution/:institutionId            # Listar páginas publicadas
GET    /public/pages/institution/:institutionId/slug/:slug # Obter página por slug
GET    /public/pages/institution/:institutionId/menu       # Obter menu
```

## Modelo de Dados - Contexto Moçambicano

### Instituição
- Nome único
- Descrição
- Informações de contato (email, telefone, endereço)
- Cidade e país (padrão: Moçambique)
- Status de pagamento
- Páginas associadas

### Usuário
- Email único
- Senha com hash
- Nome
- Telefone
- Papel (USER, ADMIN, TEACHER)
- Associação com instituição
- Assinatura/Pagamento

### Página de Instituição
- Título e slug únicos por instituição
- Layout template associado
- Status de publicação (DRAFT, PUBLISHED, ARCHIVED)
- SEO (título, keywords)
- Menu (mostrar em menu, ordem)
- Configurações customizadas por layout

### Assinatura
- Plano (BASIC, PREMIUM, ENTERPRISE)
- Status (INACTIVE, ACTIVE, SUSPENDED, CANCELLED)
- Valor em MZN (Metical)
- Data de início e fim

### Transação de Pagamento
- Método de pagamento (Mobile Money, Bank Transfer, Cash, Card)
- Referência (para Mobile Money: número de celular, para bank: comprovante)
- Status (PENDING, APPROVED, REJECTED, REFUNDED)
- Aprovação por admin

## Fluxo de Publicação

1. **Admin cria página** → Status: DRAFT
2. **Admin edita layout e conteúdo** → Pode visualizar em preview
3. **Admin publica página** → Status: PUBLISHED, publishedAt: agora
4. **Frontend consome API pública** → Mostra apenas páginas com status PUBLISHED
5. **Admin pode arquivar** → Status: ARCHIVED

## Fluxo de Pagamento

1. **User/Instituição solicita assinatura** → Criada com status INACTIVE
2. **Admin registra pagamento** → Cria PaymentTransaction com status PENDING
3. **Admin aprova pagamento** → PaymentTransaction: APPROVED, Subscription: ACTIVE
4. **Frontend verifica status** → Mostra recursos disponíveis apenas para ACTIVE
5. **Admin pode rejeitar** → PaymentTransaction: REJECTED

## Segurança

- Autenticação JWT
- CORS configurado
- Validação de entrada com class-validator
- Proteção contra SQL Injection (Prisma)
- Controle de acesso baseado em papéis (RBAC)
- Hashing de senhas com bcryptjs

## Logs e Monitoramento

Os containers estão configurados para:
- Logs padrão do Docker
- Verificação de saúde automática
- Restart automático em caso de falha

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Ver status
docker-compose ps
```

## Desenvolvimento

### Adicionar Novo Endpoint

1. Crie DTO em `src/module/dto/`
2. Crie service em `src/module/module.service.ts`
3. Crie controller em `src/module/module.controller.ts`
4. Registre no module em `src/module/module.module.ts`

### Adicionar Migration Prisma

```bash
# Faz alterações no schema.prisma
# Depois execute:
npm run prisma:migrate
```

## Troubleshooting

### Porta já em uso
```bash
# Altere em docker-compose.yml ou .env
# Exemplo: BACKEND_PORT=3002 se 3001 está ocupada
```

### Conexão recusada ao banco
```bash
# Aguarde 10-15 segundos para o PostgreSQL iniciar
# Ou execute:
docker-compose restart postgres backend
```

### Erro em migration
```bash
# Reset do banco (CUIDADO - deleta dados):
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npm run prisma:migrate
```

## Licença

ISC

## Suporte

Para issues ou dúvidas, abra uma issue no repositório.

---

**Desenvolvido para Moçambique com ❤️**
