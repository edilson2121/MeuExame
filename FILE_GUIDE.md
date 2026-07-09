# 🗂️ Guia de Arquivos - Entender Tudo Rapidinho

Uma visão rápida de cada arquivo importante do projeto.

## 📱 Para Iniciantes Rápido

```
MeuExame/
├── docker-compose.yml          👈 "Liga/desliga tudo" - docker-compose up -d
├── .env                        👈 "Configurações" - senhas, portas, etc
│
├── backend/                    👈 "Cérebro da aplicação"
│   ├── src/
│   │   ├── app.module.ts       👈 "Registra todos módulos"
│   │   ├── admin/pages/
│   │   │   ├── admin-pages.controller.ts    👈 "Recebe requisições HTTP"
│   │   │   ├── admin-pages.service.ts       👈 "Processa dados"
│   │   │   └── dto/institution-page.dto.ts  👈 "Valida dados"
│   │   └── public-pages/                    👈 "Páginas públicas (sem senha)"
│   │
│   └── prisma/
│       └── schema.prisma       👈 "Define estrutura do banco de dados"
│
└── frontend/                   👈 "Interface (o que usuário vê)"
    ├── src/
    │   ├── services/           👈 "Chama API do backend"
    │   ├── hooks/              👈 "Estado e lógica React"
    │   ├── components/         👈 "Componentes reutilizáveis"
    │   └── lib/config.ts       👈 "URLs, configurações"
    └── Dockerfile
```

---

## 🚀 Backend

### 1. `docker-compose.yml` - O Maestro

```yaml
# Liga/desliga tudo com um comando
# docker-compose up -d    = Liga tudo
# docker-compose down     = Desliga tudo
# docker-compose logs -f  = Ver logs

services:
  postgres:      # Banco de dados
  redis:         # Cache
  backend:       # Servidor Node.js
  frontend:      # Website React
```

**Quando mexer**: Quando precisa mudar porta (ex: de 3001 para 3002)

---

### 2. `.env` - Senhas e Configurações

```bash
# Passwords e credenciais
DB_USER=meuexame
DB_PASSWORD=meuexame123
DB_NAME=meuexame

# Portas
DB_PORT=5432
BACKEND_PORT=3001
FRONTEND_PORT=3000

# Chaves de segurança
JWT_SECRET=seu-segredo-aqui
```

**Quando mexer**: 
- Mudar porta
- Mudar senha (em produção)
- Adicionar variável nova

**IMPORTANTE**: Nunca comita `.env` com senhas reais! 🔒

---

### 3. `backend/prisma/schema.prisma` - Mapa do Banco de Dados

```prisma
// Define TUDO que será armazenado

model User {
  id        String  @id @default(cuid())    // Campo ID
  email     String  @unique                  // Email único
  password  String
  role      Role    @default(USER)          // Campo tipo Enum
  subscription Subscription?                // Relação (um user, uma subscription)
}

model InstitutionPage {
  id          String  @id @default(cuid())
  title       String
  slug        String
  status      PublishStatus @default(DRAFT)
  
  @@unique([institutionId, slug])           // Combinação única
  @@map("institution_pages")                // Nome da tabela
}

enum PublishStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

**Quando mexer**:
- Adicionar novo campo
- Criar novo model
- Alterar tipo de campo

**Depois mexer**: Execute `docker-compose exec backend npm run prisma:migrate`

---

### 4. `backend/src/app.module.ts` - Registro de Tudo

```typescript
// Registra todos os módulos (como um índice)

@Module({
  imports: [
    PrismaModule,        // Banco de dados
    AuthModule,          // Login
    AdminModule,         // Admin pages + payments
    PublicPagesModule,   // Públicas
    // ... mais módulos
  ],
})
export class AppModule {}
```

**Quando mexer**: Quando adiciona novo módulo (ex: CommentsModule)

---

### 5. `backend/src/admin/pages/` - Exemplo de Módulo Completo

#### Estrutura
```
admin/pages/
├── admin-pages.module.ts      # Registra controller + service
├── admin-pages.controller.ts  # Recebe HTTP
├── admin-pages.service.ts     # Processa
└── dto/
    └── institution-page.dto.ts # Valida
```

#### `admin-pages.controller.ts` - Endpoints HTTP

```typescript
@Controller('admin/pages')  // Rota base: /admin/pages
export class AdminPagesController {
  
  @Post()  // POST /admin/pages
  async create(@Body() dto: CreateInstitutionPageDto) {
    return this.pagesService.createPage(dto);
  }

  @Get(':id')  // GET /admin/pages/123
  async getById(@Param('id') id: string) {
    return this.pagesService.getPageById(id);
  }

  @Put(':id')  // PUT /admin/pages/123
  async update(@Param('id') id: string, @Body() dto: UpdateInstitutionPageDto) {
    return this.pagesService.updatePage(id, dto);
  }
}
```

**Rotas criadas**:
```
POST   /admin/pages              (criar)
GET    /admin/pages/:id          (obter)
PUT    /admin/pages/:id          (editar)
PUT    /admin/pages/:id/publish  (publicar)
DELETE /admin/pages/:id          (deletar)
```

**Quando mexer**: Adicionar novo endpoint HTTP

---

#### `admin-pages.service.ts` - Lógica de Negócio

```typescript
@Injectable()
export class AdminPagesService {
  
  async createPage(dto: CreateInstitutionPageDto) {
    // 1. Valida se instituição existe
    const institution = await this.prisma.institution.findUnique({
      where: { id: dto.institutionId }
    });
    if (!institution) throw new NotFoundException(...);

    // 2. Valida se slug é único
    const existing = await this.prisma.institutionPage.findUnique({...});
    if (existing) throw new BadRequestException(...);

    // 3. Cria página
    return this.prisma.institutionPage.create({ data: dto });
  }

  async publishPage(pageId: string, publish: boolean) {
    // Muda status e data de publicação
    return this.prisma.institutionPage.update({
      where: { id: pageId },
      data: {
        status: publish ? PublishStatus.PUBLISHED : PublishStatus.DRAFT,
        publishedAt: publish ? new Date() : null
      }
    });
  }
}
```

**Quando mexer**: Adicionar lógica de negócio, validações

---

#### `dto/institution-page.dto.ts` - Validação

```typescript
// Define quais campos são obrigatórios e seus tipos

export class CreateInstitutionPageDto {
  @IsString()
  institutionId: string;  // Obrigatório, string

  @IsString()
  title: string;

  @IsOptional()           // Opcional!
  @IsString()
  description?: string;
}

export class UpdateInstitutionPageDto {
  @IsOptional()           // Tudo opcional em update
  @IsString()
  title?: string;
}
```

**Função**: Rejeita dados ruins ANTES de entrar no service

**Quando mexer**: Adicionar/remover campos de entrada

---

### 6. `backend/src/public-pages/` - Endpoints Públicos

```typescript
// SEM autenticação! Qualquer um acessa

@Controller('public/pages')
export class PublicPagesController {
  
  // GET /public/pages/institution/inst123
  @Get('institution/:institutionId')
  async getPublishedByInstitution(@Param('institutionId') id: string) {
    // Retorna APENAS páginas com status PUBLISHED
    return this.pagesService.getPublishedPagesByInstitution(id);
  }

  // GET /public/pages/institution/inst123/slug/sobre
  @Get('institution/:institutionId/slug/:slug')
  async getBySlug(@Param('slug') slug: string, ...) {
    // Retorna página específica se publicada
  }
}
```

**Quando mexer**: Adicionar endpoints públicos (sem autenticação)

---

## 💻 Frontend

### 1. `frontend/src/lib/config.ts` - Configuração Centralizada

```typescript
// URLs base da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Configurações
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENCY = 'MZN';

// Feature flags
export const FEATURES = {
  ENABLE_ADMIN_PANEL: true,
  ENABLE_SUBSCRIPTIONS: true,
};
```

**Quando mexer**: Mudar URL de API, adicionar configuração global

**Dica**: Tudo em um lugar = fácil mudar depois

---

### 2. `frontend/src/services/` - Comunicação com Backend

#### `pages.service.ts` - Páginas Públicas

```typescript
// Funções para CHAMAR a API

export const pagesService = {
  // GET /public/pages/institution/:id
  async getPublishedPages(institutionId: string) {
    const response = await fetch(
      `${API_URL}/public/pages/institution/${institutionId}`
    );
    return response.json();
  },

  // GET /public/pages/institution/:id/slug/:slug
  async getPageBySlug(institutionId: string, slug: string) {
    const response = await fetch(
      `${API_URL}/public/pages/institution/${institutionId}/slug/${slug}`
    );
    return response.json();
  }
};
```

**Quando mexer**: Adicionar novo serviço de API

---

#### `admin-pages.service.ts` - Admin de Páginas

```typescript
// Mesma ideia, mas para endpoints ADMIN

export const adminPagesService = {
  async createPage(data: CreatePageRequest, token: string) {
    // POST /admin/pages
    return fetch(`${API_URL}/admin/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`  // ← Autenticação!
      },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
};
```

---

### 3. `frontend/src/hooks/` - Estado React

#### `usePages.ts` - Carregar Páginas

```typescript
// Hook = função que gerencia estado

export function usePublishedPages(institutionId: string) {
  const [pages, setPages] = useState([]);     // Armazena páginas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carrega quando componente monta
    pagesService.getPublishedPages(institutionId)
      .then(setPages)
      .finally(() => setLoading(false));
  }, [institutionId]);

  return { pages, loading, error };  // Retorna estado
}

// USO:
function HomePage() {
  const { pages, loading } = usePublishedPages('inst123');
  
  if (loading) return <div>Carregando...</div>;
  return pages.map(p => <h2>{p.title}</h2>);
}
```

**Quando mexer**: Adicionar novo hook para gerenciar estado

---

### 4. `frontend/src/components/` - UI Reutilizável

#### `PageRenderer.tsx` - Renderizar Página

```typescript
// Componente = função que retorna HTML

export function PageRenderer({ page }) {
  return (
    <div>
      <style>{page.layout.css}</style>
      <h1>{page.title}</h1>
      <div 
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}

// USO:
<PageRenderer page={myPage} />
```

**Quando mexer**: Adicionar novo componente visual

---

#### `InstitutionMenu.tsx` - Menu de Navegação

```typescript
// Menu dinâmico baseado em páginas publicadas

export function InstitutionMenu({ menu, currentSlug }) {
  return (
    <nav>
      {menu.map(item => (
        <Link key={item.id} href={`/paginas/${item.slug}`}>
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
```

---

## 🗄️ Estrutura de Pastas - Tudo Junto

```
MeuExame/
│
├── ⚙️ CONFIGURAÇÃO
│   ├── docker-compose.yml      Orquestra tudo
│   ├── .env                    Senhas + portas
│   └── .env.example            Template do .env
│
├── 📖 DOCUMENTAÇÃO
│   ├── QUICKSTART.md           👈 Comece aqui
│   ├── SETUP.md                Instalação completa
│   ├── ADMIN_GUIDE.md          Como usar como admin
│   ├── API.md                  Endpoints técnicos
│   ├── CODE_STANDARDS.md       👈 Padrões de código
│   └── IMPLEMENTATION.md       O que foi feito
│
├── backend/                    SERVIDOR (Node.js + NestJS)
│   ├── src/
│   │   ├── app.module.ts       Registra todos módulos
│   │   ├── admin/              Endpoints admin
│   │   │   ├── pages/
│   │   │   │   ├── controller  Recebe HTTP
│   │   │   │   ├── service     Processa
│   │   │   │   └── dto/        Valida
│   │   │   ├── layouts/
│   │   │   └── payments/
│   │   ├── public-pages/       Endpoints públicos
│   │   ├── auth/               Login
│   │   └── ...
│   │
│   ├── prisma/
│   │   └── schema.prisma       Estrutura BD
│   │
│   ├── Dockerfile              Container
│   └── package.json            Dependências
│
└── frontend/                   WEBSITE (Next.js + React)
    ├── src/
    │   ├── app/                Páginas (roteamento)
    │   ├── services/           Chama API
    │   ├── hooks/              Estado React
    │   ├── components/         UI
    │   └── lib/                Config
    │
    ├── Dockerfile              Container
    └── package.json            Dependências
```

---

## 🎯 Fluxo de Trabalho - Passo a Passo

### Criar Uma Página (Como Admin)

```
1. Admin abre /admin/pages
   ↓
2. Clica "Nova Página"
   ↓
3. Preenche formulário
   ↓
4. Frontend valida (DTO)
   ↓
5. Frontend envia: POST /admin/pages { ... }
   ↓
6. Backend Controller recebe
   ↓
7. Backend Service processa:
   - Valida instituição existe
   - Valida slug único
   - Cria no BD
   ↓
8. Backend retorna JSON
   ↓
9. Frontend mostra "Criado com sucesso"
```

### Publicar Uma Página

```
1. Admin clica "Publicar"
   ↓
2. Frontend envia: PUT /admin/pages/:id/publish { publish: true }
   ↓
3. Backend Service muda:
   - status = PUBLISHED
   - publishedAt = agora
   ↓
4. BD atualiza
   ↓
5. Frontend mostra confirmação
```

### Ver Página Publicada (Como Usuário)

```
1. Usuário acessa URL: /instituicoes/inst123/paginas/sobre
   ↓
2. Frontend carrega: GET /public/pages/institution/inst123/slug/sobre
   ↓
3. Backend retorna (SÓ se PUBLISHED)
   ↓
4. Frontend renderiza com PageRenderer
   ↓
5. Usuário vê página no navegador
```

---

## 📝 Campos em Cada Tabela

### Users (Usuários)

```
id              Identificador único
email           Email (único)
password        Senha (hash)
name            Nome completo
phone           Telefone
role            USER / ADMIN / TEACHER
subscription    Relação com assinatura
createdAt       Data criação
updatedAt       Data atualização
```

### Institutions (Instituições)

```
id              Identificador
name            Nome instituição
description     Descrição
logo            URL do logo
city            Cidade
country         País (padrão: Moçambique)
isPaid          true/false - pagou?
paidAt          Data que pagou
isActive        true/false - ativa?
createdAt       Data criação
updatedAt       Data atualização
```

### InstitutionPages (Páginas)

```
id              Identificador
institutionId   Qual instituição
title           Título
slug            URL (ex: sobre-nos)
description     Descrição
content         Conteúdo HTML
layoutId        Qual layout usa
status          DRAFT / PUBLISHED / ARCHIVED
publishedAt     Data publicação
showInMenu      Mostrar em menu?
menuOrder       Ordem no menu
seoTitle        Título para Google
seoKeywords     Palavras-chave
isActive        Ativa?
createdAt       Data criação
updatedAt       Data atualização
```

### Subscriptions (Assinaturas)

```
id              Identificador
userId          Qual usuário
plan            BASIC / PREMIUM / ENTERPRISE
status          INACTIVE / ACTIVE / SUSPENDED / CANCELLED
amount          Valor
currency        Moeda (MZN)
startDate       Começou em
endDate         Termina em
isActive        true/false
createdAt       Data criação
updatedAt       Data atualização
```

### PaymentTransactions (Pagamentos)

```
id              Identificador
userId          Qual usuário
subscriptionId  Qual assinatura
amount          Valor
currency        Moeda
status          PENDING / APPROVED / REJECTED / REFUNDED
method          MOBILE_MONEY / BANK_TRANSFER / CASH / CARD
reference       Referência (número celular, etc)
approvedBy      Quem aprovou
approvedAt      Quando aprovou
createdAt       Data criação
updatedAt       Data atualização
```

---

## 🚨 Erros Comuns e Soluções

### "Cannot find module..."
```
Causa: Arquivo não existe ou import errado

Solução:
1. Verifique caminho correto
2. Verifique se arquivo existe
3. Verifique export/import estão certos
```

### "Banco de dados não conecta"
```
Causa: PostgreSQL não iniciou ou porta ocupada

Solução:
docker-compose ps  # Ver status
docker-compose restart postgres
# Aguarde 10 segundos
```

### "Página não aparece para usuário"
```
Causa: Página não foi publicada (status = DRAFT)

Solução:
1. Vá para admin
2. Edite página
3. Clique "Publicar"
4. Usuário agora vê
```

---

## 🎓 Para Entender Cada Arquivo

1. **Leia este arquivo primeiro** ← Você está aqui
2. **Leia `CODE_STANDARDS.md`** para entender padrões
3. **Abra um arquivo real** e compare com exemplos aqui
4. **Faça pequenas mudanças** (ex: adicione console.log)
5. **Teste no navegador** para entender fluxo

---

Desenvolvido para facilitar compreensão rápida! 🚀
