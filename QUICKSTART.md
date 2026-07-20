# 🚀 Quick Start - Comece Agora!

Um guia rápido para colocar o MeuExame em funcionamento em 5 minutos.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Porta 3000, 3001, 5432 disponíveis

## ⚡ 5 Minutos para Começar

### 1️⃣ Navegue até a pasta (30 segundos)

```powershell
cd C:\Users\Administrator\Desktop\meuexame\MeuExame
```

### 2️⃣ Configure ambiente (15 segundos)

O arquivo `.env` já tem valores padrão. Se quiser mudar algo:

```powershell
# Edite .env (opcional - pode ignorar para desenvolvimento)
notepad .env
```

Valores padrão (OK para desenvolvimento):
```
DB_USER=meuexame
DB_PASSWORD=meuexame123
DB_NAME=meuexame
REDIS_PORT=6379
BACKEND_PORT=3001
FRONTEND_PORT=3000
```

### 3️⃣ Inicie os serviços (2-3 minutos)

```powershell
docker-compose up -d
```

**O que vai aparecer**:
```
Creating meuexame-postgres ... done
Creating meuexame-redis ... done
Creating meuexame-backend ... done
Creating meuexame-frontend ... done
```

### 4️⃣ Aguarde o banco ficar pronto (1-2 minutos)

```powershell
# Aguarde ~10 segundos para PostgreSQL iniciar, depois execute:
docker-compose exec backend npm run prisma:migrate
```

Se tudo correr bem, vai ver:
```
✔ Generated Prisma Client
✔ Successfully created database
✔ Migrations applied
```

### 5️⃣ Acesse a aplicação (30 segundos)

Abra seu navegador:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Banco de dados**: localhost:5432 (com DBeaver/pgAdmin)

---

## ✅ Primeiro Teste

### Testar Backend

```powershell
# Listar layouts (deve retornar array vazio [])
curl http://localhost:3001/admin/layouts

# Deve retornar JSON
```

### Testar Frontend

Abra http://localhost:3000 em seu navegador - deve carregar a página inicial

---

## 🎯 Próximos Passos

### Opção 1: Testar como Admin

1. Faça login com conta ADMIN
2. Vá para "Admin" → "Páginas"
3. Clique "Nova Página"
4. Preencha:
   - Título: "Bem-vindo"
   - Slug: "bem-vindo"
   - Escolha um layout
   - Escreva conteúdo
5. Clique "Salvar"
6. Clique "Publicar"
7. Acesse http://localhost:3000 para ver a página

### Opção 2: Testar Pagamentos

1. Admin → Pagamentos → Nova Assinatura
2. Selecione um usuário
3. Escolha plano (BASIC)
4. Defina valor (100 MZN)
5. Clique Criar
6. Registre um pagamento
7. Aprove o pagamento

### Opção 3: Explorar API

Use Postman/Insomnia:

```bash
# Buscar layouts
GET http://localhost:3001/admin/layouts

# Buscar páginas publicadas
GET http://localhost:3001/public/pages/institution/{institutiondId}
```

---

## 🆘 Problemas Comuns

### ❌ Erro: "Não consegue conectar ao banco"

```powershell
# Espere 10 segundos e tente novamente
# Se persistir:
docker-compose restart postgres backend
```

### ❌ Porta já em uso

Se porta 3001 está em uso:

```powershell
# Edite docker-compose.yml
# Mude: "3001:3001" para "3002:3001"
```

### ❌ Docker não inicia

```powershell
# Verifique se Docker está rodando
docker ps

# Se não estiver, inicie o Docker Desktop
# Aguarde carregar completamente e tente novamente
```

### ❌ Migrations falham

```powershell
# Force reset (CUIDADO - deleta dados)
docker-compose down -v
docker-compose up -d postgres redis
docker-compose exec postgres psql -U meuexame -c "CREATE DATABASE meuexame;"
docker-compose up -d backend
docker-compose exec backend npm run prisma:migrate
```

---

## 📊 Ver Logs

```powershell
# Todos os serviços
docker-compose logs -f

# Só backend
docker-compose logs -f backend

# Só frontend
docker-compose logs -f frontend

# Só banco
docker-compose logs -f postgres
```

---

## 🔍 Verificar Status

```powershell
# Ver status dos containers
docker-compose ps

# Esperado:
# NAME                STATUS
# meuexame-postgres   Up (healthy)
# meuexame-redis      Up (healthy)
# meuexame-backend    Up
# meuexame-frontend   Up
```

---

## 📁 Arquivos Importantes

```
MeuExame/
├── .env                    # Variáveis de ambiente
├── docker-compose.yml      # Orquestração
├── SETUP.md               # Instalação completa
├── ADMIN_GUIDE.md         # Guia para admins
├── IMPLEMENTATION.md      # O que foi feito
├── backend/
│   └── prisma/schema.prisma  # Modelo de dados
└── frontend/src/
    ├── services/          # Serviços de API
    ├── hooks/             # React hooks
    └── components/        # Componentes
```

---

## 🎓 Documentação Completa

Depois que tudo estiver rodando, leia:

1. **SETUP.md** - Instalação e estrutura
2. **ADMIN_GUIDE.md** - Como usar como admin
3. **IMPLEMENTATION.md** - Tudo que foi implementado

---

## ⚡ Dicas Úteis

### Parar tudo sem deletar dados
```powershell
docker-compose stop
```

### Iniciar novamente após parar
```powershell
docker-compose start
```

### Deletar tudo (cuidado!)
```powershell
docker-compose down
```

### Ver apenas erros
```powershell
docker-compose logs --tail 50
```

---

## ✨ Sucesso!

Se chegou até aqui, o MeuExame está rodando!

**Acesse agora:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:3001
- 🗄️ Banco: localhost:5432

---

**Dúvidas?** Veja SETUP.md ou ADMIN_GUIDE.md

Desenvolvido com ❤️
