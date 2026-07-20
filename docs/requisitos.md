# Requisitos - MeuExame

## 1. Visão Geral do Projeto

### 1.1 Nome do Projeto
**MeuExame** - Plataforma de Gestão Educacional para Moçambique

### 1.2 Resumo do Projeto
Plataforma web para gestão de exames de admissão e conteúdos educacionais, permitindo que instituições de ensino em Moçambique possam publicar seus exames e candidatos possam praticar e se preparar para provas.

### 1.3 Objetivos
- Disponibilizar exames de admissão de instituições moçambicanas
- Permitir prática de exames com correção automática
- Gerenciar conteúdos educacionais (cursos, disciplinas, materiais)
- Oferecer sistema de assinaturas para acesso a conteúdos premium
- Processar pagamentos via M-Pesa e eMola

---

## 2. Requisitos Funcionais

### 2.1 Autenticação e Utilizadores

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-A01 | Registo de Utilizadores | Alta | Sistema deve permitir criação de conta com nome, email e senha |
| RF-A02 | Login | Alta | Sistema deve autenticar utilizadores com email e senha |
| RF-A03 | Recuperação de Senha | Média | Sistema deve permitir recuperação de senha via email |
| RF-A04 | Perfis de Utilizador | Alta | Sistema deve distinguir entre Visitante, Utilizador, Professor e Admin |
| RF-A05 | Gestão de Perfil | Média | Utilizador pode visualizar e editar seus dados pessoais |

### 2.2 Instituições

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-I01 | Listar Instituições | Alta | Listar todas as instituições cadastradas |
| RF-I02 | Detalhes da Instituição | Alta | Visualizar informações e cursos da instituição |
| RF-I03 | Criar Instituição | Alta | Admin pode criar novas instituições |
| RF-I04 | Editar Instituição | Alta | Admin pode editar dados da instituição |
| RF-I05 | Desativar Instituição | Média | Admin pode desativar uma instituição |

### 2.3 Cursos e Disciplinas

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-CD01 | Listar Cursos | Alta | Listar cursos de uma instituição |
| RF-CD02 | Listar Disciplinas | Alta | Listar disciplinas de um curso |
| RF-CD03 | Criar Curso | Alta | Admin/Professor pode criar curso |
| RF-CD04 | Criar Disciplina | Alta | Admin/Professor pode criar disciplina |
| RF-CD05 | Editar/Deletar | Alta | Admin pode editar ou remover cursos/disciplinas |

### 2.4 Conteúdos

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-C01 | Criar Conteúdo | Alta | Criar conteúdo de estudo (texto, vídeo, PDF) |
| RF-C02 | Listar Conteúdos | Alta | Listar conteúdos por disciplina |
| RF-C03 | Visualizar Conteúdo | Alta | Visualizar conteúdo com contagem de views |
| RF-C04 | Editar Conteúdo | Alta | Professor pode editar seus conteúdos |
| RF-C05 | Publicar/Despublicar | Alta | Controlar visibilidade do conteúdo |

### 2.5 Exames

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-E01 | Criar Exame | Alta | Criar exame com questões |
| RF-E02 | Tipos de Questões | Alta | Suportar múltipla escolha, verdadeiro/falso, dissertativa |
| RF-E03 | Realizar Exame | Alta | Utilizador pode responder exame com tempo limite |
| RF-E04 | Correção Automática | Alta | Sistema corrige e calcula pontuação |
| RF-E05 | Resultados | Alta | Exibir resultado detalhado após exame |
| RF-E06 | Histórico | Alta | Utilizador pode ver resultados anteriores |
| RF-E07 | Publicar/Arquivar | Alta | Admin pode publicar ou arquivar exames |

### 2.6 Assinaturas e Pagamentos

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-SP01 | Planos de Assinatura | Alta | Sistema deve oferecer planos (diário, semanal, mensal) |
| RF-SP02 | M-Pesa | Alta | Processar pagamentos via M-Pesa |
| RF-SP03 | eMola | Média | Processar pagamentos via eMola |
| RF-SP04 | Aprovar Pagamento | Alta | Admin pode aprovar/rejeitar pagamentos |
| RF-SP05 | Ativar Assinatura | Alta | Sistema ativa assinatura após pagamento confirmado |
| RF-SP06 | Verificar Acesso | Alta | Sistema verifica se utilizador tem assinatura ativa |

### 2.7 Páginas Dinâmicas

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-P01 | Criar Página | Alta | Admin pode criar páginas institucionais |
| RF-P02 | Editor WYSIWYG | Média | Admin pode editar conteúdo visualmente |
| RF-P03 | SEO | Média | Páginas devem ter meta tags configuráveis |
| RF-P04 | Menu | Média | Admin pode adicionar páginas ao menu |

### 2.8 Busca e Pesquisa

| ID | Requisito | Prioridade | Descrição |
|----|----------|------------|-----------|
| RF-B01 | Pesquisar Exames | Alta | Buscar exames por título, instituição |
| RF-B02 | Pesquisar Conteúdos | Alta | Buscar conteúdos por título |
| RF-B03 | Filtros | Média | Permitir filtrar resultados |

---

## 3. Requisitos Não-Funcionais

### 3.1 Performance

| ID | Requisito | Meta |
|----|----------|------|
| RNF-P01 | Tempo de Resposta | Página deve carregar em < 2 segundos |
| RNF-P02 | Concurrent Users | Suportar 100+ utilizadores simultâneos |
| RNF-P03 | API Latency | Respostas da API em < 500ms |

### 3.2 Segurança

| ID | Requisito | Descrição |
|----|----------|-----------|
| RNF-S01 | Autenticação JWT | Tokens com expiração de 24h |
| RNF-S02 | Hash de Senhas | Usar bcrypt com salt |
| RNF-S03 | HTTPS | Todas as comunicações criptografadas |
| RNF-S04 | Validação de Input | Todos os inputs validados no servidor |
| RNF-S05 | Rate Limiting | Limitar requisições por IP |
| RNF-S06 | CORS | Configurar origens permitidas |

### 3.3 Disponibilidade

| ID | Requisito | Meta |
|----|----------|------|
| RNF-D01 | Uptime | 99.5% de disponibilidade |
| RNF-D02 | Backup | Backup diário automático |
| RNF-D03 | Recovery | Capacidade de recover em < 4 horas |

### 3.4 Usabilidade

| ID | Requisito | Descrição |
|----|----------|-----------|
| RNF-U01 | Responsivo | Interface funcional em desktop, tablet e mobile |
| RNF-U02 | Acessibilidade | Seguir diretrizes WCAG 2.1 |
| RNF-U03 | Intuitivo | Navegação clara e objetivos claros |
| RNF-U04 | Feedback | Sistema deve informar estado das ações |

### 3.5 Compatibilidade

| ID | Requisito | Descrição |
|----|----------|-----------|
| RNF-C01 | Browsers | Chrome, Firefox, Safari, Edge (versões atuais) |
| RNF-C02 | Mobile | iOS Safari, Chrome Mobile |

---

## 4. Requisitos Técnicos

### 4.1 Frontend

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Framework | Next.js | 14+ |
| Linguagem | TypeScript | 5.x |
| UI Library | Tailwind CSS | 3.x |
| Ícones | Lucide React | Latest |
| HTTP Client | fetch API | - |
| State | React Context/Hooks | - |

### 4.2 Backend

| Componente | Tecnologia | Versão |
|------------|------------|--------|
| Framework | NestJS | 10+ |
| Linguagem | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| Auth | JWT | - |

### 4.3 Infraestrutura

| Componente | Tecnologia |
|------------|------------|
| Container | Docker |
| Orchestration | Docker Compose |
| Web Server | Nginx |
| Cloud | VPS/Dedicado |

---

## 5. Regras de Negócio

### 5.1 Assinaturas

| Regra | Descrição |
|-------|-----------|
| RN-A01 | Utilizador sem assinatura só vê conteúdos públicos |
| RN-A02 | Assinatura é ativada após confirmação de pagamento |
| RN-A03 | Assinatura expira automaticamente após período |
| RN-A04 | Apenas uma assinatura ativa por utilizador |

### 5.2 Exames

| Regra | Descrição |
|-------|-----------|
| RN-E01 | Exame só pode ser realizado se assinatura ativa |
| RN-E02 | Tempo de exame é contado a partir do início |
| RN-E03 | Exame pode ser feito apenas uma vez |
| RN-E04 | Questões são embaralhadas para cada tentativa |

### 5.3 Pagamentos

| Regra | Descrição |
|-------|-----------|
| RN-P01 | Pagamento M-Pesa requer número válido moçambicano |
| RN-P02 | Admin deve aprovar pagamento manual se não automático |
| RN-P03 | Reembolso só em casos excepcionais (a critério admin) |

### 5.4 Conteúdos

| Regra | Descrição |
|-------|-----------|
| RN-C01 | Professor só edita seus próprios conteúdos |
| RN-C02 | Admin edita qualquer conteúdo |
| RN-C03 | Conteúdo pode ter vários autores |

---

## 6. Restrições

| ID | Restrição | Descrição |
|----|-----------|-----------|
| RES-01 | Orçamento | Desenvolvimento com recursos próprios |
| RES-02 | Prazo | MVP em 1 mês e meio |
| RES-03 | M-Pesa | Integração via API limitada a Moçambique |
| RES-04 | Mozamibque | Foco inicial no mercado moçambicano |

---

## 7. Glossário

| Termo | Definição |
|-------|----------|
| MVP | Minimum Viable Product - Versão mínima do produto |
| Assinatura | Acesso pago a conteúdos premium |
| M-Pesa | Serviço de pagamentos móveis da Vodacom |
| eMola | Serviço de pagamentos móveis da Movitel |
| Exame | Avaliação com questões de múltipla escolha |
| Disciplina | Matéria/área de estudo |
| Instituição | Universidade, escola ou liceu |
