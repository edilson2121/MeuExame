# 🚀 Guia de Configuração - Windows

## Problema Atual
O backend está com erros de TypeScript porque o PrismaClient não foi gerado.

## Solução - Execute estes comandos:

### 1. Gerar PrismaClient
```powershell
cd C:\Users\Administrator\Desktop\meuexame\MeuExame\backend
npx prisma generate
```

### 2. Rodar migrações (se necessário)
```powershell
npx prisma migrate dev
```

### 3. Seed (popular dados iniciais)
```powershell
npm run prisma:seed
```

### 4. Iniciar backend
```powershell
npm run start:dev
```

---

## Se der erro "Missing script: dev"

O script correto é `start:dev`, não `dev`.

```powershell
npm run start:dev
```

---

## Se o Prisma der erro de conexão com banco

Verifique o `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/meuexame"
```

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | Iniciar em modo desenvolvimento |
| `npm run start:debug` | Iniciar em modo debug |
| `npm run start:prod` | Iniciar em produção |
| `npm run prisma:generate` | Gerar PrismaClient |
| `npm run prisma:migrate` | Rodar migrações |
| `npm run prisma:seed` | Popular dados |
| `npm run prisma:studio` | Abrir Prisma Studio |

---

## Credenciais Padrão (após seed)

- **Admin:** admin@meuexame.com / admin123
- **User:** user@meuexame.com / admin123
