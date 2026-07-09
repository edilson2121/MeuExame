# 📖 Padrões de Código - MeuExame

Guia prático e profissional para entender e trabalhar com o código do MeuExame.

## 📋 Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Backend - Estrutura](#backend---estrutura)
3. [Frontend - Estrutura](#frontend---estrutura)
4. [Banco de Dados](#banco-de-dados)
5. [Padrões de Código](#padrões-de-código)
6. [Como Adicionar Novas Funcionalidades](#como-adicionar-novas-funcionalidades)
7. [Glossário Técnico](#glossário-técnico)

---

## 🏗️ Visão Geral da Arquitetura

O MeuExame segue a arquitetura **Service-Controller-Repository**:

```
Usuário HTTP Request
    ↓
[Controller] - Recebe requisição HTTP, valida DTOs
    ↓
[Service] - Lógica de negócio, regras de negócio
    ↓
[Repository/ORM] - Acessa banco de dados (Prisma)
    ↓
[Database] - PostgreSQL
```

### Exemplo Real: Criar uma Página

```
POST /admin/pages
    ↓
AdminPagesController.create()
    ↓
AdminPagesService.createPage()
    ↓
prisma.institutionPage.create()
    ↓
PostgreSQL insere registro
```

---

## 🔧 Backend - Estrutura

### Localização
```
backend/
├── src/
│   ├── main.ts              # Ponto de entrada
│   ├── app.module.ts        # Módulo raiz (importa todos os módulos)
│   │
│   ├── admin/               # 👈 Funcionalidades de administração
│   │   ├── admin.module.ts
│   │   ├── pages/
│   │   │   ├── admin-pages.controller.ts    # Endpoints HTTP
│   │   │   ├── admin-pages.service.ts       # Lógica
│   │   │   └── dto/
│   │   │       └── institution-page.dto.ts  # Validação
│   │   ├── layouts/
│   │   └── payments/
│   │
│   ├── public-pages/        # 👈 Endpoints públicos (sem autenticação)
│   │   ├── public-pages.controller.ts
│   │   ├── public-pages.service.ts
│   │   └── public-pages.module.ts
│   │
│   ├── auth/                # Autenticação (JWT)
│   ├── institutions/        # Gerenciamento de instituições
│   ├── users/              # Gerenciamento de usuários
│   ├── database/           # Conexão com DB
│   └── ...
│
├── prisma/
│   ├── schema.prisma       # 👈 Definição de modelos de dados
│   ├── seed.ts            # Script para popular dados iniciais
│   └── migrations/        # Histórico de mudanças no BD
│
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Dependências
└── Dockerfile            # Container Docker
```

### Estrutura de um Módulo

Exemplo: `admin/pages/`

```
admin/pages/
├── admin-pages.module.ts        # Define o módulo
│   └── imports PrismaService
│   └── exports AdminPagesService
│   └── controllers: [AdminPagesController]
│   └── providers: [AdminPagesService]
│
├── admin-pages.controller.ts    # Endpoints HTTP
│   ├── create(dto)      → POST /admin/pages
│   ├── update(id, dto)  → PUT /admin/pages/:id
│   ├── publish(id)      → PUT /admin/pages/:id/publish
│   └── getByInstitution → GET /admin/pages/institution/:id
│
├── admin-pages.service.ts       # Lógica de negócio
│   ├── createPage()     → Valida, cria página
│   ├── updatePage()     → Valida slug único, atualiza
│   ├── publishPage()    → Muda status para PUBLISHED
│   └── getPagesByInstitution()
│
└── dto/
    └── institution-page.dto.ts  # Validação de entrada
        ├── CreateInstitutionPageDto
        ├── UpdateInstitutionPageDto
        └── PublishInstitutionPageDto
```

### Padrão de um Service

```typescript
// admin-pages.service.ts

@Injectable()
export class AdminPagesService {
  constructor(private prisma: PrismaService) {}

  // 1. Método recebe DTO (dados validados)
  async createPage(dto: CreateInstitutionPageDto) {
    // 2. Validações de negócio
    const institution = await this.prisma.institution.findUnique({...});
    if (!institution) {
      throw new NotFoundException('Instituição não encontrada');
    }

    // 3. Executa a ação
    return this.prisma.institutionPage.create({
      data: {
        ...dto,
        status: PublishStatus.DRAFT,  // Padrão: começa como rascunho
      },
    });
  }
}
```

### Padrão de um Controller

```typescript
// admin-pages.controller.ts

@Controller('admin/pages')
export class AdminPagesController {
  constructor(private pagesService: AdminPagesService) {}

  // 1. Decorador define rota HTTP
  @Post()
  @HttpCode(201)  // Retorna status 201 (Created)
  async create(@Body() dto: CreateInstitutionPageDto) {
    // 2. Valida DTO automaticamente (via class-validator)
    // 3. Chama service
    return this.pagesService.createPage(dto);
  }

  // PUT para atualizar
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInstitutionPageDto
  ) {
    return this.pagesService.updatePage(id, dto);
  }
}
```

### Padrão de um DTO

```typescript
// institution-page.dto.ts

export class CreateInstitutionPageDto {
  @IsString()
  institutionId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

---

## 💻 Frontend - Estrutura

### Localização
```
frontend/
├── src/
│   ├── app/                 # Páginas Next.js (roteamento automático)
│   │   ├── layout.tsx       # Layout global
│   │   ├── page.tsx         # Página inicial (/)
│   │   ├── admin/           # Rotas /admin/*
│   │   └── ...
│   │
│   ├── services/            # 👈 Integração com API
│   │   ├── pages.service.ts           # Buscar páginas públicas
│   │   ├── admin-pages.service.ts     # CRUD de páginas (admin)
│   │   ├── admin-payments.service.ts  # Gerenciar pagamentos
│   │   └── index.ts                  # Exports
│   │
│   ├── hooks/               # 👈 React Hooks reutilizáveis
│   │   ├── usePages.ts              # Carrega páginas
│   │   ├── useAdminPages.ts         # Admin páginas
│   │   ├── useAdminPayments.ts      # Admin pagamentos
│   │   └── ...
│   │
│   ├── components/          # 👈 Componentes React
│   │   ├── PageRenderer.tsx         # Renderiza página com layout
│   │   ├── InstitutionMenu.tsx      # Menu de navegação
│   │   ├── SimplePage.tsx           # Página com estados (loading, error)
│   │   └── ...
│   │
│   ├── lib/                # Utilitários
│   │   ├── config.ts       # Configurações centralizadas
│   │   └── utils.ts        # Funções utilitárias
│   │
│   └── types/              # TypeScript types
│       └── ...
│
├── public/                 # Arquivos estáticos (imagens, etc)
├── package.json           # Dependências
├── next.config.js         # Configuração Next.js
├── tsconfig.json          # Configuração TypeScript
└── Dockerfile            # Container Docker
```

### Padrão de um Service

```typescript
// pages.service.ts

// Define tipos de dados
export interface PublishedPage {
  id: string;
  title: string;
  status: 'PUBLISHED';
  // ...
}

// Service com métodos para chamar API
export const pagesService = {
  async getPublishedPages(institutionId: string): Promise<PublishedPage[]> {
    try {
      const response = await fetch(
        `${API_URL}/public/pages/institution/${institutionId}`
      );
      if (!response.ok) throw new Error('Erro ao buscar');
      return response.json();
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }
}
```

### Padrão de um Hook

```typescript
// usePages.ts

// Hook = função React que gerencia estado
export function usePublishedPages(institutionId: string) {
  const [pages, setPages] = useState<PublishedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!institutionId) return;

    const fetchPages = async () => {
      try {
        setLoading(true);
        const data = await pagesService.getPublishedPages(institutionId);
        setPages(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro'));
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [institutionId]);

  // Retorna estado + dados
  return { pages, loading, error };
}

// Uso em componente
function MeuComponente() {
  const { pages, loading, error } = usePublishedPages('inst123');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return pages.map(page => <div key={page.id}>{page.title}</div>);
}
```

### Padrão de um Componente

```typescript
// PageRenderer.tsx

interface PageRendererProps {
  page: PublishedPage;
  className?: string;
}

export function PageRenderer({ page, className = '' }: PageRendererProps) {
  // Renderiza página com seu layout
  return (
    <div className={className}>
      <style>{page.layout.css}</style>
      <div
        dangerouslySetInnerHTML={{ __html: page.layout.html }}
        suppressHydrationWarning
      />
    </div>
  );
}

// Uso
<PageRenderer page={myPage} className="container" />
```

---

## 🗄️ Banco de Dados

### Localização
```
backend/prisma/
├── schema.prisma       # 👈 Definição de modelos
├── seed.ts            # Script de inicialização
└── migrations/        # Histórico de mudanças
    ├── migration_lock.toml
    └── 20250101000000_init/
        ├── migration.sql
        └── ...
```

### Padrão do Schema

```prisma
// schema.prisma

model InstitutionPage {
  id          String   @id @default(cuid())        // ID único
  
  // Relações
  institutionId String
  institution   Institution @relation(fields: [institutionId], references: [id])
  
  // Dados
  title         String
  slug          String
  content       String?  @db.Text              // Text longo
  
  // Status
  status        PublishStatus @default(DRAFT)  // Enum
  publishedAt   DateTime?                      // Null = não publicado
  
  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt           // Auto-atualiza

  // Índices
  @@unique([institutionId, slug])             // Slug único por instituição
  @@map("institution_pages")                  // Nome da tabela no BD
}

enum PublishStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### Ciclo de Vida: Criar Nova Página

```
1. Admin clica "Nova Página"
   ↓
2. Frontend: POST /admin/pages { title, slug, ... }
   ↓
3. Backend Controller recebe CreateInstitutionPageDto
   ↓
4. Backend Service:
   a. Valida instituição existe
   b. Valida slug é único para instituição
   c. Chama: prisma.institutionPage.create({ data, ... })
   ↓
5. Prisma gera SQL:
   INSERT INTO institution_pages (id, title, slug, status, ...) 
   VALUES ('cuid123', 'Sobre', 'sobre', 'DRAFT', ...)
   ↓
6. PostgreSQL insere o registro
   ↓
7. Prisma retorna objeto criado
   ↓
8. Backend retorna JSON para frontend
   ↓
9. Frontend exibe "Página criada com sucesso"
```

### Ciclo de Vida: Publicar Página

```
1. Admin clica "Publicar"
   ↓
2. Frontend: PUT /admin/pages/page123/publish { publish: true }
   ↓
3. Backend Service:
   a. Encontra página
   b. Se publish=true:
      - Muda status para PUBLISHED
      - Define publishedAt = agora
   ↓
4. prisma.institutionPage.update({
     where: { id: 'page123' },
     data: { status: 'PUBLISHED', publishedAt: now }
   })
   ↓
5. PostgreSQL atualiza registro
   ↓
6. Frontend: "Página publicada"
```

### Ciclo de Vida: Ver Página Publicada (Usuário)

```
1. Usuário acessa http://localhost:3000/instituicoes/inst123/paginas/sobre
   ↓
2. Frontend chama: GET /public/pages/institution/inst123/slug/sobre
   ↓
3. Backend PublicPagesController chama PublicPagesService
   ↓
4. Service executa:
   prisma.institutionPage.findUnique({
     where: { institutionId_slug: { institutionId: 'inst123', slug: 'sobre' } },
     include: { layout: true }
   })
   ↓
5. Prisma valida:
   - status === PUBLISHED
   - isActive === true
   ↓
6. PostgreSQL retorna página com layout
   ↓
7. Frontend renderiza com PageRenderer component
   ↓
8. Usuário vê página formatada no navegador
```

---

## 📝 Padrões de Código

### 1. Nomenclatura

#### Services
```
✅ Correto:   AdminPagesService
❌ Errado:    AdminPageService (sem 's')
❌ Errado:    PageAdminService (ordem errada)

Padrão: [Domínio][Funcionalidade]Service
Exemplos:
- AdminPagesService     (admin → páginas)
- AdminPaymentsService  (admin → pagamentos)
- PublicPagesService    (público → páginas)
```

#### Controllers
```
✅ Correto:   AdminPagesController
Padrão: [Domínio][Funcionalidade]Controller

Rotas:
@Controller('admin/pages')     ✅
@Controller('AdminPages')       ❌ Não use CamelCase em rotas
```

#### DTOs
```
✅ Correto:   CreateInstitutionPageDto
Padrão: [Verbo][Modelo][Ação]Dto

Exemplos:
- CreateInstitutionPageDto      (criar página)
- UpdateInstitutionPageDto      (atualizar página)
- PublishInstitutionPageDto     (publicar página)
- CreateSubscriptionDto         (criar assinatura)
```

#### Hooks (Frontend)
```
✅ Correto:   usePublishedPages
Padrão: use[Funcionalidade]

Exemplos:
- usePublishedPages      (páginas publicadas)
- useAdminPages          (admin de páginas)
- useAdminPayments       (admin de pagamentos)
```

#### Componentes (Frontend)
```
✅ Correto:   PageRenderer
Padrão: [Substantivo][Ação]

Exemplos:
- PageRenderer      (renderiza página)
- InstitutionMenu   (menu da instituição)
- SimplePage        (página simples)
```

### 2. Estrutura de Arquivos

```
✅ Correto:
admin/
├── pages/
│   ├── admin-pages.controller.ts
│   ├── admin-pages.service.ts
│   └── dto/
│       └── institution-page.dto.ts
├── layouts/
└── admin.module.ts

❌ Errado:
admin/
├── controllers/
│   └── pages-controller.ts
├── services/
│   └── pages-service.ts
└── dto/pages.dto.ts
```

### 3. Imports/Exports

```typescript
// ✅ Correto: Index file centraliza exports
// services/index.ts
export * from './pages.service';
export * from './admin-pages.service';
export * from './admin-payments.service';

// ✅ Uso
import { pagesService, adminPagesService } from '@/services';

// ❌ Evite: Imports diretos
import pagesService from '@/services/pages.service';
```

### 4. Tratamento de Erros

```typescript
// ✅ Correto
async createPage(dto: CreateInstitutionPageDto) {
  const institution = await this.prisma.institution.findUnique({...});
  
  // Erro específico com mensagem clara
  if (!institution) {
    throw new NotFoundException('Instituição não encontrada');
  }

  return this.prisma.institutionPage.create({...});
}

// ❌ Evite
async createPage(dto) {
  // Sem validação
  return this.prisma.institutionPage.create({...});
}
```

### 5. Type Safety (TypeScript)

```typescript
// ✅ Correto: Types explícitos
async getPublishedPages(
  institutionId: string
): Promise<PublishedPage[]> {
  return fetch(...).then(r => r.json());
}

// ❌ Evite: Any
async getPublishedPages(institutionId: any): any {
  return fetch(...).then(r => r.json());
}
```

### 6. Comments (Comentários)

```typescript
// ✅ Bom: Explica o POR QUÊ
// Verifica se slug é único por instituição para evitar conflitos
const existing = await this.prisma.institutionPage.findUnique({
  where: { institutionId_slug: { ... } }
});

// ❌ Evite: Comenta código óbvio
// Busca página no banco
const page = await this.prisma.institutionPage.findUnique({...});
```

---

## 🆕 Como Adicionar Novas Funcionalidades

### Exemplo: Adicionar "Comentários em Páginas"

#### Passo 1: Criar Model no Banco

```prisma
// backend/prisma/schema.prisma

model PageComment {
  id        String   @id @default(cuid())
  content   String
  author    String
  pageId    String
  page      InstitutionPage @relation(fields: [pageId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("page_comments")
}

// Atualizar InstitutionPage
model InstitutionPage {
  // ... campos existentes ...
  comments  PageComment[]
}
```

#### Passo 2: Executar Migration

```bash
docker-compose exec backend npm run prisma:migrate
```

#### Passo 3: Criar DTO (Validação)

```typescript
// backend/src/admin/pages/dto/page-comment.dto.ts

export class CreatePageCommentDto {
  @IsString()
  content: string;

  @IsString()
  author: string;

  @IsString()
  pageId: string;
}
```

#### Passo 4: Criar Service

```typescript
// backend/src/admin/pages/page-comments.service.ts

@Injectable()
export class PageCommentsService {
  constructor(private prisma: PrismaService) {}

  async addComment(dto: CreatePageCommentDto) {
    // Valida página existe
    const page = await this.prisma.institutionPage.findUnique({
      where: { id: dto.pageId }
    });

    if (!page) {
      throw new NotFoundException('Página não encontrada');
    }

    // Cria comentário
    return this.prisma.pageComment.create({
      data: dto
    });
  }

  async getComments(pageId: string) {
    return this.prisma.pageComment.findMany({
      where: { pageId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
```

#### Passo 5: Adicionar Endpoints

```typescript
// backend/src/admin/pages/page-comments.controller.ts

@Controller('admin/pages/:pageId/comments')
export class PageCommentsController {
  constructor(private commentsService: PageCommentsService) {}

  @Post()
  async add(
    @Param('pageId') pageId: string,
    @Body() dto: CreatePageCommentDto
  ) {
    return this.commentsService.addComment({ ...dto, pageId });
  }

  @Get()
  async getComments(@Param('pageId') pageId: string) {
    return this.commentsService.getComments(pageId);
  }
}
```

#### Passo 6: Registrar no Módulo

```typescript
// backend/src/admin/pages/pages.module.ts

@Module({
  providers: [AdminPagesService, PageCommentsService], // ← Adicione
  controllers: [AdminPagesController, PageCommentsController], // ← Adicione
})
export class PagesModule {}
```

#### Passo 7: Frontend - Criar Hook

```typescript
// frontend/src/hooks/usePageComments.ts

export function usePageComments(pageId: string) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/admin/pages/${pageId}/comments`)
      .then(r => r.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }, [pageId]);

  return { comments, loading };
}
```

#### Passo 8: Frontend - Criar Componente

```typescript
// frontend/src/components/PageComments.tsx

export function PageComments({ pageId }: { pageId: string }) {
  const { comments, loading } = usePageComments(pageId);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <strong>{comment.author}</strong>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Glossário Técnico

| Termo | Significado |
|-------|------------|
| **DTO** | Data Transfer Object - Objeto para validar dados de entrada |
| **Service** | Classe que contém lógica de negócio |
| **Controller** | Classe que recebe requisições HTTP e chama services |
| **Module** | Agrupa controllers, services e providers |
| **Prisma** | ORM - faz ponte entre código e banco de dados |
| **Migration** | Histórico de mudanças no banco de dados |
| **Hook** | Função React que gerencia estado |
| **Component** | Componente React reutilizável |
| **Enum** | Tipo com valores pré-definidos (ex: DRAFT, PUBLISHED) |
| **Repository** | Camada que acessa dados (Prisma neste projeto) |
| **Middleware** | Função que processa requisição antes do controller |
| **Guard** | Protetor de rotas (ex: verifica autenticação) |
| **Interceptor** | Modifica requisição/resposta |
| **Decorator** | Annotation que adiciona funcionalidade (@Post, @Get, etc) |

---

## 🎓 Para Trainers - Como Explicar

### Explicação Nivel 1 (Iniciantes)

```
"O sistema funciona assim:

1. Usuário clica algo (click do mouse)
2. Frontend envia requisição HTTP para backend
3. Backend processa e responde
4. Frontend mostra resultado

Tudo! Simples assim. 👍"
```

### Explicação Nível 2 (Intermediário)

```
"Na verdade tem mais detalhes:

1. Frontend (Next.js) = Interface do usuário
2. Backend (NestJS) = Lógica do negócio
3. Banco de Dados = Armazena informações

Frontend conversa com Backend via API (HTTP)
Backend conversa com Banco via Prisma
"
```

### Explicação Nível 3 (Avançado)

```
"Seguimos padrão MVC:

- Model (Prisma): Define dados no banco
- View (Next.js): Mostra dados para usuário
- Controller (NestJS): Recebe dados do usuário
- Service (NestJS): Processa dados
- DTO: Valida dados antes de processar

Tudo segue padrão bem definido."
```

---

## ✅ Checklist para Adicionar Feature

- [ ] Entender o padrão atual
- [ ] Criar Model no Prisma
- [ ] Executar migration
- [ ] Criar DTO com validações
- [ ] Criar Service com lógica
- [ ] Criar Controller com endpoints
- [ ] Registrar no Module
- [ ] Frontend: Criar Service/Hook
- [ ] Frontend: Criar Componente
- [ ] Testar API com cURL/Postman
- [ ] Testar Frontend

---

Desenvolvido com ❤️ para facilitar compreensão do código.
