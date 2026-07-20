# 🌐 MeuExame - Sistema Completo

## 📋 Rotas do Sistema

### 🔐 PÚBLICAS (sem login)
| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/login` | Login de usuário |
| `/register` | Registo de novo usuário |
| `/admin/login` | Login de administrador |
| `/recuperar-senha` | Recuperar palavra-passe |
| `/faq`, `/ajuda`, `/contacto` | Páginas informativas |

---

### 👤 USUÁRIO NORMAL (pode LER e FAZER, NÃO pode CRIAR/EDITAR/PUBLICAR)
| Rota | Descrição |
|------|-----------|
| `/home` | Dashboard pessoal - resultados, progresso |
| `/disciplinas` | Ver disciplinas disponíveis |
| `/disciplinas/[id]` | Ver detalhes de disciplina |
| `/meus-exames` | Meus exames (grátis/pagos) |
| `/exames/[id]` | Fazer exame |
| `/manuais` | Ver e baixar manuais PDF |
| `/instituicoes` | Ver instituições |
| `/instituicoes/[id]` | Ver detalhes de instituição |
| `/pagamentos/[examId]` | Comprar exame pago |
| `/perfil` | Editar nome, telefone, senha |

---

### 🛠️ ADMIN (pode TUDO: criar, editar, publicar, eliminar)
| Rota | Descrição |
|------|-----------|
| `/admin/login` | Login de administrador |
| `/admin` | Dashboard geral com estatísticas |
| `/admin/usuarios` | Gerir usuários (CRUD) |
| `/admin/instituicoes` | Gerir instituições (CRUD) |
| `/admin/disciplinas` | Gerir disciplinas (CRUD) |
| `/admin/exames` | Gerir exames (CRUD + PUBLICAR) |
| `/admin/exames/novo` | Criar novo exame |
| `/admin/pagamentos` | Ver/Criar pagamentos |
| `/admin/manuais` | Gerir manuais (CRUD) |
| `/admin/settings` | Configurações do sistema |

---

## 🚀 Como Testar

### 1. Iniciar Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

### 2. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Credenciais de Teste
```
👤 Admin:  admin@meuexame.com / admin123
👤 User:   user@meuexame.com / admin123
```

---

## 📊 Fluxo do Usuário Normal

```
/login 
  ↓
/home (dashboard com resultados)
  ├── /disciplinas → ver disciplinas
  ├── /meus-exames → ver exames disponíveis
  │     └── /exames/[id] → fazer exame (pinta verde/vermelho)
  ├── /manuais → baixar PDFs
  ├── /instituicoes → ver instituições
  ├── /pagamentos/[id] → comprar exame
  └── /perfil → editar nome/telefone/senha
```

---

## 📊 Fluxo do Admin

```
/admin/login
  ↓
/admin (dashboard)
  ├── /admin/usuarios → criar/editar/eliminar usuários
  ├── /admin/instituicoes → criar/editar/eliminar instituições
  ├── /admin/disciplinas → criar/editar/eliminar disciplinas
  ├── /admin/exames → criar/editar/PUBLICAR/excluir exames
  └── /admin/pagamentos → ver transações
```

---

## ✅ Funcionalidades Implementadas

- [x] Login/Registo de usuários
- [x] Login de admin separado
- [x] Dashboard do usuário com resultados
- [x] Barra de progresso (meta 80%)
- [x] Verde = corretas, Vermelho = erradas
- [x] CRUD de usuários (admin)
- [x] CRUD de instituições (admin)
- [x] CRUD de disciplinas (admin)
- [x] CRUD de exames (admin)
- [x] Publicar exame (admin)
- [x] Sistema de pagamento M-PESA
- [x] Manuais para download
- [x] Perfil editável (nome, telefone, senha)

---

## 🎯 Regras de Negócio

- **80%** é a nota mínima para passar
- Usuário normal **NÃO** pode criar/editar conteúdo
- Admin tem acesso total ao sistema
- Exames pagos precisam de comprovativo M-PESA
