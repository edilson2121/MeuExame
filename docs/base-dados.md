# Base de Dados - MeuExame

## Visão Geral

O MeuExame utiliza **PostgreSQL 15** como sistema de gerenciamento de banco de dados relacional, com **Prisma ORM** para abstração e interação com os dados.

## Diagrama de Entidades

```
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   User      │       │  Institution     │       │   Course     │
├─────────────┤       ├─────────────────┤       ├──────────────┤
│ id          │──┐    │ id              │    ┌──│ id           │
│ email       │  │    │ name            │    │  │ name         │
│ password    │  │    │ city            │    │  └──────────────┘
│ name        │  │    │ country         │    │
│ role        │  └───►│ institutionId   │◄───┘
│ avatar      │       └─────────────────┘
└─────────────┘              │
      │                      │
      │              ┌───────┴───────┐
      │              │   Subject      │
      │              ├───────────────┤
      │              │ id             │
      │              │ name           │◄──────────┐
      │              │ courseId       │           │
      │              │ institutionId  │           │
      │              └───────────────┘           │
      │                      │                   │
      │        ┌─────────────┼─────────────┐     │
      │        │             │             │     │
      │   ┌────▼────┐  ┌─────▼────┐  ┌────▼─────┐ │
      │   │ Content │  │ Exercise │  │   Exam   │ │
      │   ├─────────┤  ├──────────┤  ├──────────┤ │
      │   │ id      │  │ id       │  │ id       │ │
      │   │ title   │  │ title    │  │ title    │ │
      │   │ content │  │ subjectId│  │ subjectId│ │
      │   │ subject │  │ difficulty│ │ duration │ │
      │   └─────────┘  └──────────┘  └────┬─────┘ │
      │                                    │       │
      │                              ┌─────▼─────┐ │
      │                              │ Question  │─┘
      │                              ├───────────┤
      │                              │ id        │
      │                              │ text      │
      │                              │ type      │
      │                              │ options   │
      │                              │ correctAns│
      │                              └───────────┘
      │
      │    ┌─────────────┐      ┌──────────────┐
      └───►│ Subscription│◄─────│    Plan      │
           ├─────────────┤      ├──────────────┤
           │ id          │      │ id           │
           │ userId      │      │ name         │
           │ planId      │─────►│ price        │
           │ status      │      │ duration     │
           └──────┬──────┘      └──────────────┘
                  │
           ┌──────▼──────┐
           │   Payment   │
           ├─────────────┤
           │ id          │
           │ userId      │
           │ amount      │
           │ status      │
           │ method      │
           └─────────────┘
```

## Tabelas Principais

### Users (Utilizadores)

| Campo         | Tipo         | Descrição                          |
|---------------|--------------|-------------------------------------|
| id            | String (UID) | Identificador único                 |
| email         | String       | Email único do utilizador           |
| password      | String       | Hash da palavra-passe               |
| name          | String       | Nome completo                       |
| avatar        | String?      | URL da foto de perfil               |
| phone         | String?      | Número de telefone                  |
| bio           | String?      | Biografia                           |
| role          | Enum         | USER, ADMIN, TEACHER                |
| institutionId | String?      | FK para instituição (opcional)       |
| createdAt     | DateTime     | Data de criação                     |
| updatedAt     | DateTime     | Data de atualização                 |

### Institutions (Instituições)

| Campo        | Tipo         | Descrição                          |
|--------------|--------------|-------------------------------------|
| id           | String (UID) | Identificador único                 |
| name         | String       | Nome da instituição (único)         |
| city         | String?      | Cidade                              |
| country      | String       | País (default: Moçambique)           |
| isActive     | Boolean      | Se está ativa                       |
| isPaid       | Boolean      | Se tem assinatura paga              |
| paidAt       | DateTime?    | Data do último pagamento            |
| createdAt    | DateTime     | Data de criação                     |
| updatedAt    | DateTime     | Data de atualização                 |

### Courses (Cursos)

| Campo     | Tipo         | Descrição                          |
|-----------|--------------|-------------------------------------|
| id        | String (UID) | Identificador único                 |
| name      | String       | Nome do curso                       |
| createdAt | DateTime     | Data de criação                     |
| updatedAt | DateTime     | Data de atualização                 |

### Subjects (Disciplinas)

| Campo          | Tipo         | Descrição                          |
|----------------|--------------|-------------------------------------|
| id             | String (UID) | Identificador único                 |
| name           | String       | Nome da disciplina                  |
| courseId       | String?      | FK para curso                       |
| institutionId  | String?      | FK para instituição                 |
| createdAt      | DateTime     | Data de criação                     |
| updatedAt      | DateTime     | Data de atualização                 |

### Content (Conteúdos)

| Campo       | Tipo          | Descrição                          |
|-------------|---------------|-------------------------------------|
| id          | String (UID)  | Identificador único                 |
| title       | String        | Título do conteúdo                  |
| description | String?       | Descrição                          |
| content     | String        | Corpo do conteúdo (Markdown/HTML)   |
| type        | Enum          | TEXT, VIDEO, PDF, QUIZ             |
| subjectId   | String        | FK para disciplina                  |
| authorId    | String        | FK para autor                       |
| views       | Int           | Contador de visualizações           |
| likes       | Int           | Contador de likes                   |
| createdAt   | DateTime      | Data de criação                     |
| updatedAt   | DateTime      | Data de atualização                 |

### Exam (Exames)

| Campo        | Tipo          | Descrição                          |
|--------------|---------------|-------------------------------------|
| id           | String (UID)  | Identificador único                 |
| title        | String        | Título do exame                     |
| description  | String?       | Descrição                          |
| subjectId    | String?       | FK para disciplina                  |
| authorId     | String        | FK para autor                       |
| duration     | Int?          | Duração em minutos                  |
| totalPoints  | Float         | Pontuação total                    |
| examDate     | DateTime?     | Data do exame                       |
| status       | Enum          | DRAFT, PUBLISHED, SCHEDULED         |
| imageUrl     | String?       | URL da imagem                       |
| year         | Int?          | Ano do exame                        |
| createdAt    | DateTime      | Data de criação                     |
| updatedAt    | DateTime      | Data de atualização                 |

### Question (Questões)

| Campo         | Tipo          | Descrição                          |
|---------------|---------------|-------------------------------------|
| id            | String (UID)  | Identificador único                 |
| text          | String        | Texto da questão                    |
| type          | Enum          | MULTIPLE_CHOICE, TRUE_FALSE, etc.  |
| options       | Json?         | Opções (para múltipla escolha)     |
| correctAnswer | String?       | Resposta correta                    |
| explanation   | String?       | Explicação da resposta              |
| imageUrl      | String?       | URL de imagem                       |
| points        | Float         | Pontos da questão                  |
| exerciseId    | String?       | FK para exercício                   |
| createdAt     | DateTime      | Data de criação                     |
| updatedAt     | DateTime      | Data de atualização                 |

### ExamQuestion (Relação Exame-Questão)

| Campo        | Tipo     | Descrição                          |
|--------------|----------|-------------------------------------|
| id           | String   | Identificador único                 |
| examId       | String   | FK para exame                       |
| questionId    | String   | FK para questão                     |
| order        | Int      | Ordem da questão no exame           |
| points       | Float    | Pontos individuais                  |
| createdAt     | DateTime | Data de criação                     |
| updatedAt     | DateTime | Data de atualização                 |

### Result (Resultados)

| Campo     | Tipo       | Descrição                          |
|-----------|------------|-------------------------------------|
| id        | String     | Identificador único                 |
| score     | Float      | Pontuação obtida                    |
| userId    | String     | FK para utilizador                  |
| examId    | String     | FK para exame                       |
| answers   | Json?      | Respostas do utilizador             |
| createdAt | DateTime   | Data de criação                     |
| updatedAt | DateTime   | Data de atualização                 |

### Subscription (Assinaturas)

| Campo       | Tipo            | Descrição                          |
|-------------|-----------------|-------------------------------------|
| id          | String          | Identificador único                 |
| userId      | String          | FK para utilizador (único)         |
| planId      | String          | FK para plano                      |
| status      | Enum            | INACTIVE, ACTIVE, SUSPENDED        |
| startDate   | DateTime?       | Data de início                     |
| endDate     | DateTime?       | Data de fim                        |
| amount      | Float           | Valor pago                         |
| currency    | String          | Moeda (MZN)                        |
| isActive    | Boolean         | Se está ativa                       |
| createdAt   | DateTime        | Data de criação                     |
| updatedAt   | DateTime        | Data de atualização                 |

### Plan (Planos)

| Campo      | Tipo            | Descrição                          |
|------------|-----------------|-------------------------------------|
| id         | String          | Identificador único                 |
| name       | String          | Nome do plano                      |
| description| String?         | Descrição                          |
| price      | Float           | Preço em MZN                       |
| duration   | Int             | Duração em dias                    |
| type       | Enum            | DAILY, WEEKLY, MONTHLY             |
| isActive   | Boolean         | Se está ativo                      |
| createdAt   | DateTime        | Data de criação                     |
| updatedAt   | DateTime        | Data de atualização                 |

### Payment (Pagamentos)

| Campo          | Tipo            | Descrição                          |
|----------------|-----------------|-------------------------------------|
| id             | String          | Identificador único                 |
| userId         | String          | FK para utilizador                  |
| planId         | String          | FK para plano                      |
| subscriptionId | String?         | FK para assinatura                 |
| amount         | Float           | Valor                               |
| status         | Enum            | PENDING, APPROVED, REJECTED        |
| paymentMethod  | String?         | M_PESA, EMOLA, CASH, BANK_TRANSFER |
| transactionId  | String?         | ID da transação (único)             |
| paidAt         | DateTime?       | Data do pagamento                  |
| createdAt      | DateTime        | Data de criação                     |
| updatedAt      | DateTime        | Data de atualização                 |

### Page (Páginas Dinâmicas)

| Campo       | Tipo            | Descrição                          |
|-------------|-----------------|-------------------------------------|
| id          | String          | Identificador único                 |
| title       | String          | Título da página                    |
| slug        | String          | Slug único                          |
| content     | String          | Conteúdo (HTML/Markdown)           |
| description | String?         | Meta descrição                      |
| keywords    | String?         | Meta keywords                       |
| template    | String          | Template (default)                  |
| showInMenu  | Boolean         | Mostrar no menu                     |
| menuOrder   | Int             | Ordem no menu                       |
| status      | Enum            | DRAFT, PUBLISHED, ARCHIVED         |
| publishedAt | DateTime?       | Data de publicação                  |
| authorId    | String          | FK para autor                       |
| createdAt   | DateTime        | Data de criação                     |
| updatedAt   | DateTime        | Data de atualização                 |

## Enumerações

### Role
- `USER` - Utilizador normal
- `ADMIN` - Administrador
- `TEACHER` - Professor/Autor

### ContentType
- `TEXT` - Texto simples
- `VIDEO` - Vídeo
- `PDF` - Documento PDF
- `QUIZ` - Questionário

### Difficulty
- `EASY` - Fácil
- `MEDIUM` - Médio
- `HARD` - Difícil

### ExamStatus
- `DRAFT` - Rascunho
- `PUBLISHED` - Publicado
- `SCHEDULED` - Agendado
- `ARCHIVED` - Arquivado

### QuestionType
- `MULTIPLE_CHOICE` - Escolha múltipla
- `TRUE_FALSE` - Verdadeiro ou Falso
- `ESSAY` - Dissertativa
- `SHORT_ANSWER` - Resposta curta

### PaymentStatus
- `PENDING` - Pendente
- `APPROVED` - Aprovado
- `REJECTED` - Rejeitado
- `REFUNDED` - Reembolsado

### PaymentMethod
- `M_PESA` - M-Pesa
- `EMOLA` - eMola
- `CASH` - Dinheiro
- `BANK_TRANSFER` - Transferência bancária

## Índices

```sql
-- Performance queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_institutions_name ON institutions(name);
CREATE INDEX idx_subjects_course ON subjects(course_id);
CREATE INDEX idx_subjects_institution ON subjects(institution_id);
CREATE INDEX idx_contents_subject ON contents(subject_id);
CREATE INDEX idx_exams_subject ON exams(subject_id);
CREATE INDEX idx_results_user ON results(user_id);
CREATE INDEX idx_results_exam ON results(exam_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

## Relacionamentos

1. **User → Institution**: N:1 (opcional)
2. **User → Content**: 1:N (autor de conteúdos)
3. **User → Exam**: 1:N (autor de exames)
4. **User → Subscription**: 1:1 (um utilizador tem uma assinatura ativa)
5. **Institution → Subject**: 1:N
6. **Course → Subject**: 1:N
7. **Subject → Content**: 1:N
8. **Subject → Exercise**: 1:N
9. **Subject → Exam**: 1:N
10. **Exercise → Question**: 1:N
11. **Exam → Question**: N:N (via ExamQuestion)
12. **Exam → Result**: 1:N
13. **User → Result**: 1:N
14. **Plan → Subscription**: 1:N
15. **Subscription → Payment**: 1:N
