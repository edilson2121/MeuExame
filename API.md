# 📚 API Documentation - MeuExame

Documentação completa de todos os endpoints da API.

## Base URL

```
http://localhost:3001
```

## Authentication

A maioria dos endpoints `/admin/*` requer autenticação JWT:

```
Authorization: Bearer {token}
```

Obtenha o token fazendo login em `/auth/login`

---

## 📄 Pages (Páginas Publicadas)

### GET /public/pages/institution/:institutionId

Lista todas as páginas publicadas de uma instituição.

**Parâmetros**:
- `institutionId` (string, required): ID da instituição

**Resposta**: Array de páginas publicadas

```json
[
  {
    "id": "cuid123",
    "title": "Bem-vindo",
    "slug": "bem-vindo",
    "description": "Página inicial",
    "content": "Conteúdo HTML",
    "status": "PUBLISHED",
    "publishedAt": "2025-01-15T10:30:00Z",
    "layout": {
      "id": "layout1",
      "name": "Layout Padrão",
      "html": "<div>...</div>",
      "css": "body { ... }"
    },
    "institution": {
      "id": "inst1",
      "name": "Instituição X"
    }
  }
]
```

**Exemplo**:
```bash
curl http://localhost:3001/public/pages/institution/inst123
```

---

### GET /public/pages/institution/:institutionId/slug/:slug

Obtém uma página específica por slug.

**Parâmetros**:
- `institutionId` (string, required): ID da instituição
- `slug` (string, required): Slug da página

**Resposta**: Objeto de página (mesmo formato acima)

**Exemplo**:
```bash
curl http://localhost:3001/public/pages/institution/inst123/slug/bem-vindo
```

---

### GET /public/pages/institution/:institutionId/menu

Obtém apenas as páginas que devem aparecer no menu.

**Parâmetros**:
- `institutionId` (string, required): ID da instituição

**Resposta**:
```json
[
  {
    "id": "page1",
    "title": "Início",
    "slug": "inicio",
    "menuOrder": 1
  },
  {
    "id": "page2",
    "title": "Sobre",
    "slug": "sobre",
    "menuOrder": 2
  }
]
```

---

## 🔐 Admin - Pages (Requer Autenticação)

### POST /admin/pages

Cria uma nova página de instituição.

**Body**:
```json
{
  "institutionId": "inst123",
  "title": "Sobre Nós",
  "slug": "sobre-nos",
  "description": "Conheça nossa instituição",
  "content": "<p>Conteúdo HTML aqui</p>",
  "layoutId": "layout1",
  "settings": {},
  "showInMenu": true,
  "menuOrder": 2,
  "seoTitle": "Sobre a Instituição",
  "seoKeywords": "sobre,instituição,educação"
}
```

**Resposta**:
```json
{
  "id": "page123",
  "institutionId": "inst123",
  "title": "Sobre Nós",
  "slug": "sobre-nos",
  "status": "DRAFT",
  "createdAt": "2025-01-15T10:30:00Z",
  ...
}
```

**Exemplo**:
```bash
curl -X POST http://localhost:3001/admin/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "institutionId": "inst123",
    "title": "Sobre Nós",
    "slug": "sobre-nos",
    "layoutId": "layout1"
  }'
```

---

### PUT /admin/pages/:id

Atualiza uma página existente.

**Parâmetros**:
- `id` (string, required): ID da página

**Body** (todos opcionais):
```json
{
  "title": "Novo Título",
  "slug": "novo-slug",
  "description": "Nova descrição",
  "content": "<p>Novo conteúdo</p>",
  "layoutId": "layout2",
  "status": "DRAFT",
  "showInMenu": false,
  "menuOrder": 5
}
```

**Resposta**: Página atualizada

**Exemplo**:
```bash
curl -X PUT http://localhost:3001/admin/pages/page123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"title": "Novo Título"}'
```

---

### PUT /admin/pages/:id/publish

Publica ou despublica uma página.

**Parâmetros**:
- `id` (string, required): ID da página

**Body**:
```json
{
  "publish": true  // ou false para despublicar
}
```

**Resposta**: Página com status atualizado

**Exemplo**:
```bash
curl -X PUT http://localhost:3001/admin/pages/page123/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"publish": true}'
```

---

### GET /admin/pages/institution/:institutionId

Lista todas as páginas (rascunho e publicadas) de uma instituição.

**Parâmetros**:
- `institutionId` (string, required): ID da instituição

**Resposta**: Array de páginas

---

### GET /admin/pages/:id

Obtém detalhes completos de uma página.

**Parâmetros**:
- `id` (string, required): ID da página

**Resposta**: Objeto completo da página

---

### DELETE /admin/pages/:id

Deleta uma página permanentemente.

**Parâmetros**:
- `id` (string, required): ID da página

**Resposta**: 204 No Content

---

## 🎨 Admin - Layouts

### GET /admin/layouts

Lista todos os layouts.

**Query Parameters** (opcionais):
- `active=true`: Apenas layouts ativos

**Resposta**:
```json
[
  {
    "id": "layout1",
    "name": "Layout Padrão",
    "description": "Layout simples e limpo",
    "html": "<div>...</div>",
    "css": "body { ... }",
    "thumbnail": "url",
    "isActive": true,
    "createdAt": "2025-01-10T00:00:00Z"
  }
]
```

---

### POST /admin/layouts

Cria um novo layout template.

**Body**:
```json
{
  "name": "Novo Layout",
  "description": "Descrição do layout",
  "html": "<div class='container'>{{content}}</div>",
  "css": "body { font-family: Arial; }",
  "thumbnail": "base64 ou URL"
}
```

**Resposta**: Layout criado

---

### PUT /admin/layouts/:id

Atualiza um layout existente.

**Body** (todos opcionais):
```json
{
  "name": "Nome Atualizado",
  "html": "<div>...</div>",
  "isActive": true
}
```

---

### GET /admin/layouts/:id

Obtém detalhes de um layout específico.

---

### DELETE /admin/layouts/:id

Deleta um layout (se não estiver sendo usado).

---

## 💳 Admin - Payments (Pagamentos)

### POST /admin/payments/subscription

Cria uma nova assinatura para um usuário.

**Body**:
```json
{
  "userId": "user123",
  "plan": "PREMIUM",
  "amount": 500,
  "currency": "MZN"
}
```

**Planos disponíveis**: BASIC, PREMIUM, ENTERPRISE

**Resposta**:
```json
{
  "id": "sub123",
  "userId": "user123",
  "plan": "PREMIUM",
  "amount": 500,
  "status": "INACTIVE",
  "isActive": false
}
```

---

### POST /admin/payments/record

Registra um novo pagamento para uma assinatura.

**Body**:
```json
{
  "userId": "user123",
  "subscriptionId": "sub123",
  "amount": 500,
  "method": "MOBILE_MONEY",
  "reference": "+258 82 123 4567",
  "currency": "MZN"
}
```

**Métodos disponíveis**:
- MOBILE_MONEY (M-Pesa, Airtel Money)
- BANK_TRANSFER
- CASH
- CREDIT_CARD
- OTHER

**Resposta**:
```json
{
  "id": "payment123",
  "userId": "user123",
  "status": "PENDING",
  "method": "MOBILE_MONEY",
  "reference": "+258 82 123 4567",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### PUT /admin/payments/approve/:paymentId

Aprova ou rejeita um pagamento.

**Body**:
```json
{
  "approve": true,
  "reason": "Motivo opcional se rejeitado"
}
```

**Resposta**: Pagamento atualizado

**Efeito colateral se approve=true**:
- Status da assinatura muda para ACTIVE
- Instituição do usuário fica marcada como PAID

---

### GET /admin/payments/pending

Lista todos os pagamentos pendentes de aprovação.

**Resposta**: Array de pagamentos

---

### GET /admin/payments/subscription/:userId

Obtém a assinatura de um usuário.

**Resposta**:
```json
{
  "id": "sub123",
  "userId": "user123",
  "plan": "PREMIUM",
  "status": "ACTIVE",
  "amount": 500,
  "startDate": "2025-01-15T00:00:00Z",
  "endDate": "2026-01-15T00:00:00Z",
  "payments": [...]
}
```

---

### GET /admin/payments/user/:userId

Lista todos os pagamentos de um usuário.

**Resposta**: Array de transações

---

### GET /admin/payments/institution/:institutionId/status

Obtém o status de pagamento de uma instituição.

**Resposta**:
```json
{
  "institution": { ... },
  "isPaid": true,
  "paidAt": "2025-01-10T00:00:00Z",
  "users": [ ... ]
}
```

---

## 📋 Data Models

### Page Object
```json
{
  "id": "string",
  "institutionId": "string",
  "title": "string",
  "slug": "string",
  "description": "string | null",
  "content": "string | null",
  "layoutId": "string",
  "status": "DRAFT | PUBLISHED | ARCHIVED",
  "publishedAt": "ISO8601 | null",
  "showInMenu": "boolean",
  "menuOrder": "number",
  "seoTitle": "string | null",
  "seoKeywords": "string | null",
  "isActive": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Layout Object
```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "html": "string",
  "css": "string | null",
  "thumbnail": "string | null",
  "config": "object | null",
  "isActive": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Subscription Object
```json
{
  "id": "string",
  "userId": "string",
  "plan": "BASIC | PREMIUM | ENTERPRISE",
  "status": "INACTIVE | ACTIVE | SUSPENDED | CANCELLED",
  "amount": "number",
  "currency": "string",
  "startDate": "ISO8601 | null",
  "endDate": "ISO8601 | null",
  "isActive": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### PaymentTransaction Object
```json
{
  "id": "string",
  "userId": "string",
  "subscriptionId": "string",
  "amount": "number",
  "currency": "string",
  "status": "PENDING | APPROVED | REJECTED | REFUNDED",
  "method": "MOBILE_MONEY | BANK_TRANSFER | CASH | CREDIT_CARD | OTHER",
  "reference": "string | null",
  "approvedBy": "string | null",
  "approvedAt": "ISO8601 | null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

---

## ❌ Erro Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Página não encontrada",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 🧪 Exemplos com cURL

### Listar páginas publicadas

```bash
curl http://localhost:3001/public/pages/institution/inst123
```

### Criar página como admin

```bash
curl -X POST http://localhost:3001/admin/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "institutionId": "inst123",
    "title": "Sobre",
    "slug": "sobre",
    "layoutId": "layout1",
    "content": "<p>Conteúdo</p>"
  }'
```

### Publicar página

```bash
curl -X PUT http://localhost:3001/admin/pages/page123/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"publish": true}'
```

### Registrar pagamento

```bash
curl -X POST http://localhost:3001/admin/payments/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "userId": "user123",
    "subscriptionId": "sub123",
    "amount": 500,
    "method": "MOBILE_MONEY",
    "reference": "+258 82 123 4567"
  }'
```

### Aprovar pagamento

```bash
curl -X PUT http://localhost:3001/admin/payments/approve/payment123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"approve": true}'
```

---

## 📊 Status Codes

| Code | Significado |
|------|------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 204 | No Content - Deletado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Sem autenticação |
| 404 | Not Found - Recurso não existe |
| 500 | Internal Server Error - Erro no servidor |

---

Desenvolvido com ❤️ para Moçambique
