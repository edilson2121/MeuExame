# 📚 MeuExame - Plataforma de Exames

Plataforma de exames e preparação para universidades de Moçambique.

## 🎯 O Que É?

O **MeuExame** é uma plataforma que permite:

- ✅ **Administradores** criar páginas de instituições sem programação
- ✅ **Administradores** controlar quem pagou e quem não pagou
- ✅ **Usuários** ver apenas conteúdo que foi publicado
- ✅ **Tudo em containers Docker** pronto para produção

## 🚀 Comece em 5 Minutos

```bash
# 1. Entre na pasta
cd C:\Users\Administrator\Desktop\meuexame\MeuExame

# 2. Inicie Docker (lê variáveis de .env)
docker-compose up -d

# 3. Execute migrations (aguarde 10 segundos)
docker-compose exec backend npm run prisma:migrate

# 4. Acesse
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

**Veja `QUICKSTART.md` para detalhes completos.**

## 📖 Documentação

| Arquivo | Para Quem | O Quê |
|---------|-----------|-------|
| **QUICKSTART.md** | Iniciantes | ⚡ Começar em 5 minutos |
| **SETUP.md** | DevOps/Infra | 🔧 Instalação detalhada |
| **ADMIN_GUIDE.md** | Administradores | 👨‍💼 Como usar o sistema |
| **API.md** | Developers | 📡 Endpoints da API |
| **CODE_STANDARDS.md** | Developers | 📐 Padrões de código |
| **FILE_GUIDE.md** | Developers | 🗂️ Estrutura de arquivos |
| **IMPLEMENTATION.md** | Gerentes | ✅ O que foi feito |

## 💻 Tech Stack

### Backend
- **NestJS** - Framework Node.js profissional
- **Prisma** - ORM (banco de dados)
- **PostgreSQL** - Banco de dados
- **Redis** - Cache e filas
- **JWT** - Autenticação

### Frontend
- **Next.js** - Framework React
- **React** - UI
- **TypeScript** - Tipagem

### Infraestrutura
- **Docker Compose** - Orquestração
- **PostgreSQL** - Dados
- **Redis** - Cache

## 📊 Arquitetura

```
┌─────────────────────┐
│   Navegador Web     │
│  (Usuário/Admin)    │
└──────────┬──────────┘
           │ HTTP
           ↓
┌─────────────────────┐
│   Frontend Next.js  │──→ Chama API
│  (localhost:3000)   │
└──────────┬──────────┘
           │ HTTP
           ↓
┌─────────────────────┐
│   Backend NestJS    │
│  (localhost:3001)   │
└──────────┬──────────┘
           │ SQL
           ↓
┌─────────────────────┐
│  PostgreSQL + Redis │
└─────────────────────┘
```

## 🎯 Funcionalidades

### Para Administradores

- 📄 **Gerenciar Páginas**
  - Criar páginas com layouts predefinidos
  - Editar conteúdo
  - Publicar/Despublicar
  - Adicionar ao menu

- 💳 **Controlar Pagamentos**
  - Criar assinaturas
  - Registrar pagamentos (M-Pesa, Bank, Cash)
  - Aprovar/Rejeitar
  - Ver status por instituição

- 🎨 **Usar Layouts**
  - Layouts reutilizáveis
  - Sem programação
  - Consistência visual

### Para Usuários

- 👁️ Ver apenas conteúdo publicado
- 📱 Interface responsiva
- ⚡ Carregamento rápido
- 🔒 Acesso baseado em pagamento

## 📁 Estrutura

```
MeuExame/
├── 📖 DOCUMENTAÇÃO (você está aqui)
│   ├── README.md               ← Você está aqui
│   ├── QUICKSTART.md
│   ├── SETUP.md
│   ├── ADMIN_GUIDE.md
│   ├── API.md
│   ├── CODE_STANDARDS.md
│   └── FILE_GUIDE.md
│
├── ⚙️ CONFIGURAÇÃO
│   ├── docker-compose.yml      Liga/desliga tudo
│   ├── .env                    Senhas e portas
│   └── .env.example            Template
│
├── backend/                    Servidor (Node.js + NestJS)
│   ├── src/
│   │   ├── admin/pages/        Gerenciar páginas
│   │   ├── admin/payments/     Gerenciar pagamentos
│   │   ├── public-pages/       Endpoints públicos
│   │   └── ...
│   └── prisma/schema.prisma    Banco de dados
│
└── frontend/                   Website (Next.js + React)
    └── src/
        ├── services/           Chama API
        ├── hooks/              Lógica React
        └── components/         UI
```

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Validação de dados (class-validator)
- ✅ Proteção contra SQL injection (Prisma ORM)
- ✅ Hash de senhas (bcryptjs)
- ✅ CORS configurado
- ✅ Roles (USER, ADMIN, TEACHER)

## 🌍 Contexto Moçambicano

- 💱 Moeda: **MZN** (Metical)
- 📱 Pagamentos: **M-Pesa, Airtel Money, Bank Transfer, Cash**
- 🗺️ Localização: **Moçambique**
- 🗣️ Idioma: **Português**

## 📊 API Endpoints

### Públicos (sem autenticação)
```
GET  /public/pages/institution/:id
GET  /public/pages/institution/:id/slug/:slug
GET  /public/pages/institution/:id/menu
```

### Admin Páginas
```
POST   /admin/pages
PUT    /admin/pages/:id
PUT    /admin/pages/:id/publish
GET    /admin/pages/institution/:id
DELETE /admin/pages/:id
```

### Admin Pagamentos
```
POST   /admin/payments/subscription
POST   /admin/payments/record
PUT    /admin/payments/approve/:id
GET    /admin/payments/pending
GET    /admin/payments/institution/:id/status
```

**Veja `API.md` para documentação completa.**

## 🗄️ Banco de Dados

### Models Principais

- **User** - Usuários (email, role, subscription)
- **Institution** - Instituições (nome, logo, status de pagamento)
- **InstitutionPage** - Páginas (título, slug, status de publicação)
- **LayoutTemplate** - Templates de design
- **Subscription** - Planos de assinatura
- **PaymentTransaction** - Histórico de pagamentos

**Veja `CODE_STANDARDS.md` para entender cada model.**

## 🚀 Deploy

### Docker Compose (Desenvolvimento/Produção)

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose stop

# Deletar (cuidado!)
docker-compose down -v
```

### Variáveis de Ambiente

Copie `.env.example` para `.env` e customize:

```bash
DB_USER=meuexame
DB_PASSWORD=meuexame123
BACKEND_PORT=3001
FRONTEND_PORT=3000
JWT_SECRET=seu-segredo-aqui
```

## 📝 Como Usar

### Como Admin

1. Faça login como ADMIN
2. Vá para "Gerenciamento"
3. Clique "Nova Página"
4. Preencha título, slug, escolha layout
5. Escreva conteúdo
6. Clique "Publicar"
7. Usuários agora veem a página

**Veja `ADMIN_GUIDE.md` para guia completo.**

### Como Desenvolvedor

1. Leia `CODE_STANDARDS.md` para entender padrões
2. Leia `FILE_GUIDE.md` para entender estrutura
3. Faça pequenas mudanças para aprender
4. Teste com `docker-compose up`

## 🆘 Problemas Comuns

### Docker não inicia
```bash
# Verifique se Docker está rodando
docker ps

# Se falhar, inicie Docker Desktop e aguarde
```

### Porta ocupada
Edite `.env`:
```
BACKEND_PORT=3002  # Mude para outra porta
```

### Banco não conecta
```bash
# Aguarde 10 segundos e tente novamente
# Ou reinicie
docker-compose restart postgres backend
```

## 📚 Para Treinar Alguém

### Nível 1 (Iniciantes)
1. Leia este README
2. Siga QUICKSTART.md
3. Abra localhost:3000

### Nível 2 (Intermediário)
1. Leia CODE_STANDARDS.md
2. Leia FILE_GUIDE.md
3. Faça pequenas mudanças

### Nível 3 (Avançado)
1. Leia API.md
2. Consulte os arquivos reais
3. Adicione nova funcionalidade

## 🎓 Aprenda Rápido

**5 minutos**: `QUICKSTART.md`  
**30 minutos**: `CODE_STANDARDS.md`  
**1 hora**: `FILE_GUIDE.md`  
**2 horas**: Entenda todo o código

## 📞 Suporte

1. Consulte a documentação acima
2. Verifique os logs: `docker-compose logs -f`
3. Teste a API: `http://localhost:3001/admin/layouts`

## ✅ Status

| Funcionalidade | Status | Notas |
|---|---|---|
| Gerenciamento de Páginas | ✅ Completo | CRUD + Publicação |
| Layouts Reutilizáveis | ✅ Completo | Admin pode criar/editar |
| Sistema de Pagamentos | ✅ Completo | M-Pesa, Bank, Cash |
| Frontend Responsivo | ✅ Completo | Mobile + Desktop |
| Docker Setup | ✅ Completo | Production-ready |
| Documentação | ✅ Completa | 7 arquivos |

## 📄 Licença

ISC

## 👨‍💻 Desenvolvido Para

Educação em Moçambique com ❤️

---

## 🚀 Próximos Passos

1. **Leia** `QUICKSTART.md` agora
2. **Inicie** `docker-compose up -d`
3. **Acesse** http://localhost:3000
4. **Explore** o sistema
5. **Leia** `ADMIN_GUIDE.md` se for usar como admin
6. **Leia** `CODE_STANDARDS.md` se for desenvolver

---

**Bem-vindo ao MeuExame! 🎉**
