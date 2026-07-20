# Casos de Uso - MeuExame

## Atores

| Ator | Descrição |
|------|----------|
| **Visitante** | Utilizador não autenticado que pode navegar pelo site |
| **Utilizador (Estudante)** | Utilizador autenticado com acesso a conteúdos e exames |
| **Professor (Teacher)** | Utilizador que pode criar conteúdos e exames |
| **Administrador** | Gestor total da plataforma |

---

## Casos de Uso do Visitante

### UC-V1: Visualizar Página Inicial
- **Descrição**: Visitante acessa a página inicial
- **Ator**: Visitante
- **Pré-condições**: Nenhuma
- **Fluxo Principal**:
  1. Visitante acessa URL
  2. Sistema exibe página inicial com instituições e cursos
  3. Visitante pode navegar pelos links disponíveis
- **Pós-condições**: Nenhuma
- **Resultado**: Página carregada com sucesso

### UC-V2: Visualizar Instituições
- **Descrição**: Visitante visualiza lista de instituições
- **Ator**: Visitante
- **Pré-condições**: Nenhuma
- **Fluxo Principal**:
  1. Visitante acessa página de instituições
  2. Sistema lista todas as instituições ativas
  3. Visitante pode filtrar por cidade/país
- **Pós-condições**: Lista exibida

### UC-V3: Visualizar Detalhes de Instituição
- **Descrição**: Visitante visualiza detalhes de uma instituição
- **Ator**: Visitante
- **Pré-condições**: Instituição existe
- **Fluxo Principal**:
  1. Visitante seleciona instituição
  2. Sistema exibe cursos e disciplinas disponíveis
- **Pós-condições**: Detalhes exibidos

### UC-V4: Visualizar Exames Públicos
- **Descrição**: Visitante visualiza exames publicados
- **Ator**: Visitante
- **Pré-condições**: Nenhuma
- **Fluxo Principal**:
  1. Visitante acessa página de exames
  2. Sistema lista exames públicos/publicados
  3. Visitante pode filtrar por instituição/disciplina
- **Pós-condições**: Lista exibida

### UC-V5: Visualizar Conteúdo Público
- **Descrição**: Visitante visualiza conteúdos marcados como públicos
- **Ator**: Visitante
- **Pré-condições**: Conteúdo existe e é público
- **Fluxo Principal**:
  1. Visitante acessa conteúdo
  2. Sistema incrementa contador de visualizações
  3. Sistema exibe conteúdo
- **Pós-condições**: Visualização incrementada

### UC-V6: Efetuar Registo
- **Descrição**: Visitante cria conta na plataforma
- **Ator**: Visitante
- **Pré-condições**: Email não cadastrado
- **Fluxo Principal**:
  1. Visitante acessa página de registo
  2. Sistema exibe formulário
  3. Visitante preenche dados (nome, email, senha)
  4. Sistema valida dados
  5. Sistema cria conta
  6. Sistema envia email de confirmação (opcional)
  7. Visitante é redirecionado para login
- **Pós-condições**: Conta criada, email único

### UC-V7: Efetuar Login
- **Descrição**: Utilizador acessa sua conta
- **Ator**: Utilizador
- **Pré-condições**: Conta existe
- **Fluxo Principal**:
  1. Utilizador acessa página de login
  2. Sistema exibe formulário
  3. Utilizador preenche email e senha
  4. Sistema valida credenciais
  5. Sistema cria sessão (JWT)
  6. Utilizador redirecionado para dashboard
- **Pós-condições**: Sessão criada com sucesso

---

## Casos de Uso do Utilizador (Estudante)

### UC-U1: Acessar Dashboard
- **Descrição**: Utilizador visualiza sua área pessoal
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador acessa /dashboard
  2. Sistema exibe perfil e estatísticas
  3. Sistema exibe últimos conteúdos/exames
- **Pós-condições**: Dashboard exibido

### UC-U2: Visualizar Perfil
- **Descrição**: Utilizador vê e edita seu perfil
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador acessa página de perfil
  2. Sistema exibe dados atuais
  3. Utilizador pode editar informações
  4. Sistema salva alterações
- **Pós-condições**: Perfil atualizado

### UC-U3: Listar Instituições
- **Descrição**: Utilizador visualiza instituições disponíveis
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador acessa página de instituições
  2. Sistema lista instituições com base na assinatura
- **Pós-condições**: Lista exibida

### UC-U4: Visualizar Cursos
- **Descrição**: Utilizador visualiza cursos de uma instituição
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa, instituição selecionada
- **Fluxo Principal**:
  1. Utilizador seleciona instituição
  2. Sistema exibe cursos disponíveis
- **Pós-condições**: Cursos exibidos

### UC-U5: Visualizar Disciplinas
- **Descrição**: Utilizador visualiza disciplinas de um curso
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa, curso selecionado
- **Fluxo Principal**:
  1. Utilizador seleciona curso
  2. Sistema exibe disciplinas
- **Pós-condições**: Disciplinas exibidas

### UC-U6: Visualizar Conteúdo
- **Descrição**: Utilizador visualiza conteúdo de uma disciplina
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa, assinatura ativa
- **Fluxo Principal**:
  1. Utilizador seleciona disciplina
  2. Sistema exibe conteúdos disponíveis
  3. Utilizador seleciona conteúdo
  4. Sistema incrementa visualização
  5. Sistema exibe conteúdo
- **Pós-condições**: Visualização incrementada

### UC-U7: Realizar Exame
- **Descrição**: Utilizador responde um exame
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa, assinatura ativa, exame publicado
- **Fluxo Principal**:
  1. Utilizador inicia exame
  2. Sistema registra início (simulation)
  3. Para cada questão:
     - Sistema exibe questão
     - Utilizador responde
     - Sistema salva resposta
  4. Utilizador termina exame
  5. Sistema calcula pontuação
  6. Sistema salva resultado
  7. Sistema exibe resultado
- **Pós-condições**: Resultado salvo

### UC-U8: Visualizar Histórico de Exames
- **Descrição**: Utilizador vê seus resultados anteriores
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador acessa histórico
  2. Sistema lista resultados
- **Pós-condições**: Histórico exibido

### UC-U9: Comprar Assinatura
- **Descrição**: Utilizador adquire plano de assinatura
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador acessa planos
  2. Sistema exibe planos disponíveis
  3. Utilizador seleciona plano
  4. Sistema redireciona para pagamento
  5. Utilizador efetua pagamento (M-Pesa/eMola)
  6. Sistema confirma pagamento
  7. Sistema ativa assinatura
- **Pós-condições**: Assinatura ativa

### UC-U10: Pesquisar Conteúdos
- **Descrição**: Utilizador pesquisa por conteúdos
- **Ator**: Utilizador autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Utilizador digita termo de pesquisa
  2. Sistema busca em títulos e descrições
  3. Sistema exibe resultados
- **Pós-condições**: Resultados exibidos

---

## Casos de Uso do Professor (Teacher)

### UC-T1: Criar Conteúdo
- **Descrição**: Professor cria novo conteúdo
- **Ator**: Professor autenticado
- **Pré-condições**: Sessão ativa, perfil de professor
- **Fluxo Principal**:
  1. Professor acessa painel admin
  2. Navega para "Criar Conteúdo"
  3. Preenche formulário (título, descrição, corpo)
  4. Seleciona disciplina
  5. Define tipo (texto, vídeo, PDF)
  6. Salva conteúdo
- **Pós-condições**: Conteúdo criado

### UC-T2: Criar Exame
- **Descrição**: Professor cria novo exame
- **Ator**: Professor autenticado
- **Pré-condições**: Sessão ativa, perfil de professor
- **Fluxo Principal**:
  1. Professor acessa painel admin
  2. Navega para "Criar Exame"
  3. Preenche dados básicos
  4. Adiciona questões
  5. Define pontuação
  6. Salva como rascunho ou publica
- **Pós-condições**: Exame criado

### UC-T3: Criar Questão
- **Descrição**: Professor cria questão para exercício/exame
- **Ator**: Professor autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Professor acessa "Questões"
  2. Clica em "Nova Questão"
  3. Preenche texto e opções
  4. Define resposta correta
  5. Adiciona explicação
  6. Salva questão
- **Pós-condições**: Questão criada

### UC-T4: Editar Conteúdo
- **Descrição**: Professor edita conteúdo existente
- **Ator**: Professor autenticado
- **Pré-condições**: Sessão ativa, professor é autor
- **Fluxo Principal**:
  1. Professor acessa lista de seus conteúdos
  2. Seleciona conteúdo
  3. Edita informações
  4. Salva alterações
- **Pós-condições**: Conteúdo atualizado

### UC-T5: Visualizar Estatísticas
- **Descrição**: Professor visualiza estatísticas dos seus conteúdos
- **Ator**: Professor autenticado
- **Pré-condições**: Sessão ativa
- **Fluxo Principal**:
  1. Professor acessa painel
  2. Navega para "Estatísticas"
  3. Sistema exibe visualizações, likes, resultados
- **Pós-condições**: Estatísticas exibidas

---

## Casos de Uso do Administrador

### UC-A1: Gerir Utilizadores
- **Descrição**: Admin gerencia todos os utilizadores
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Utilizadores"
  3. Lista, busca, filtra utilizadores
  4. Pode editar, bloquear ou excluir
- **Pós-condições**: Utilizadores geridos

### UC-A2: Gerir Instituições
- **Descrição**: Admin cria/edita instituições
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Instituições"
  3. Lista instituições
  4. Cria nova ou edita existente
- **Pós-condições**: Instituição criada/atualizada

### UC-A3: Gerir Cursos
- **Descrição**: Admin cria/edita cursos
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Cursos"
  3. Cria/edita curso
  4. Associa a instituição
- **Pós-condições**: Curso criado/atualizado

### UC-A4: Gerir Disciplinas
- **Descrição**: Admin cria/edita disciplinas
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Disciplinas"
  3. Cria/edita disciplina
  4. Associa a curso
- **Pós-condições**: Disciplina criada/atualizada

### UC-A5: Gerir Páginas
- **Descrição**: Admin gerencia páginas dinâmicas
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Páginas"
  3. Cria/edita página
  4. Define se aparece no menu
  5. Publica página
- **Pós-condições**: Página criada/publicada

### UC-A6: Gerir Planos
- **Descrição**: Admin configura planos de assinatura
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Planos"
  3. Cria/edita plano
  4. Define preço e duração
- **Pós-condições**: Plano criado/atualizado

### UC-A7: Gerir Pagamentos
- **Descrição**: Admin aprova/rejeita pagamentos
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa painel admin
  2. Navega para "Pagamentos"
  3. Lista transações pendentes
  4. Aprova ou rejeita
  5. Sistema atualiza assinatura
- **Pós-condições**: Pagamento processado

### UC-A8: Visualizar Dashboard
- **Descrição**: Admin vê estatísticas gerais
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa dashboard
  2. Sistema exibe:
     - Total de utilizadores
     - Total de instituições
     - Assinaturas ativas
     - Receita do mês
     - Gráficos de uso
- **Pós-condições**: Dashboard exibido

### UC-A9: Configurar Sistema
- **Descrição**: Admin configura parâmetros do sistema
- **Ator**: Administrador
- **Pré-condições**: Sessão ativa, role=ADMIN
- **Fluxo Principal**:
  1. Admin acessa "Configurações"
  2. Altera parâmetros
  3. Salva configuração
- **Pós-condições**: Configuração atualizada

---

## Casos de Uso de Sistema

### UC-S1: Processar Pagamento M-Pesa
- **Descrição**: Sistema processa pagamento via M-Pesa
- **Ator**: Sistema (automático)
- **Pré-condições**: Transação M-Pesa recebida
- **Fluxo Principal**:
  1. Sistema recebe notificação de pagamento
  2. Valida dados da transação
  3. Atualiza status do pagamento
  4. Se aprovado, ativa assinatura
  5. Envia confirmação ao utilizador
- **Pós-condições**: Assinatura ativada ou pagamento rejeitado

### UC-S2: Enviar Email
- **Descrição**: Sistema envia email ao utilizador
- **Ator**: Sistema (automático)
- **Pré-condições**: Evento que requer email
- **Fluxo Principal**:
  1. Sistema detecta necessidade de email
  2. Prepara template
  3. Envia via SMTP/Serviço
  4. Registra envio
- **Pós-condições**: Email enviado

### UC-S3: Gerar Relatório
- **Descrição**: Sistema gera relatório de uso
- **Ator**: Sistema (agendado)
- **Pré-condições**: Horário agendado
- **Fluxo Principal**:
  1. Sistema executa job agendado
  2. Agrega dados do período
  3. Gera PDF/CSV
  4. Envia para admin
- **Pós-condições**: Relatório gerado e enviado
