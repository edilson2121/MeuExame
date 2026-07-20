# Guia do Sistema de Administração - MeuExame

Um guia completo para administradores usarem o sistema de gerenciamento sem necessidade de conhecimentos de programação.

## Índice

1. [Visão Geral](#visão-geral)
2. [Gerenciamento de Páginas](#gerenciamento-de-páginas)
3. [Gerenciamento de Layouts](#gerenciamento-de-layouts)
4. [Controle de Pagamentos](#controle-de-pagamentos)
5. [Fluxos Principais](#fluxos-principais)
6. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

## Visão Geral

O MeuExame permite que administradores gerenciem completamente o conteúdo e os pagamentos de suas instituições, tudo através de uma interface amigável, sem necessidade de codificação.

### O que você pode fazer:

- ✅ Criar e editar páginas da instituição
- ✅ Usar layouts predefinidos para manter consistência visual
- ✅ Controlar quem pagou e quem ainda deve
- ✅ Publicar/despublicar conteúdo para usuários
- ✅ Gerenciar estrutura do menu de navegação
- ✅ Otimizar páginas para buscadores (SEO)

## Gerenciamento de Páginas

### Criar uma Nova Página

1. **Acesse o painel administrativo**
   - Faça login como ADMIN
   - Navegue para "Gerenciamento de Páginas"

2. **Clique em "Nova Página"**
   - Preencha os dados básicos:
     - **Título**: Nome da página (visível para usuários)
     - **Slug**: Identificador único para a URL
       - Exemplo: `sobre-nos` → URL: `/instituicoes/seu-id/paginas/sobre-nos`
       - Use letras minúsculas e hífens
     - **Descrição**: Resumo da página (bom para SEO)

3. **Escolha um Layout**
   - Selecione um layout predefinido
   - Veja uma prévia do layout escolhido
   - Os layouts podem ser reutilizados em várias páginas

4. **Adicione Conteúdo**
   - Digite o conteúdo da página
   - Use editor WYSIWYG (O que vê é o que obtém)
   - Adicione imagens, vídeos e outros mídia

5. **Configure SEO (Opcional)**
   - **Título SEO**: Título para mecanismos de busca
   - **Palavras-chave**: Separadas por vírgula
   - Exemplo:
     ```
     Título SEO: "Instituição de Ensino em Maputo - Moçambique"
     Palavras-chave: "educação, escola, Maputo, Moçambique"
     ```

6. **Configurações de Menu**
   - **Mostrar no Menu**: Marque se deseja que aparena na navegação
   - **Ordem no Menu**: Número para ordenar (1, 2, 3...)
   - Exemplo:
     - 1 = Primeira posição
     - 2 = Segunda posição
     - 10 = Última posição

7. **Salve como Rascunho**
   - Clique "Salvar Rascunho"
   - Agora você pode editar antes de publicar

### Publicar uma Página

**Importante**: Publicar = Usuários podem ver

1. Abra a página em rascunho
2. Revise todo o conteúdo
3. Clique "Publicar"
4. Confirme a ação
5. A página está agora visível para todos os usuários

### Editar uma Página

1. Acesse "Gerenciamento de Páginas"
2. Encontre a página que deseja editar
3. Clique em "Editar"
4. Faça as alterações desejadas
5. Clique "Salvar"

**Nota**: Se a página está publicada, as alterações entram em efeito imediatamente

### Despublicar uma Página

1. Abra a página
2. Clique "Despublicar"
3. A página volta ao status RASCUNHO
4. Usuários não podem mais ver

### Deletar uma Página

1. Abra a página
2. Clique "Deletar"
3. Confirme a exclusão permanente
4. A página e todo seu conteúdo são deletados

## Gerenciamento de Layouts

### O que é um Layout?

Um layout é um template (modelo) HTML + CSS que define a aparência de uma página. Layouts ajudam a:

- Manter consistência visual
- Reutilizar designs
- Fazer mudanças globais rapidamente

### Layouts Disponíveis

O sistema vem com layouts predefinidos:

1. **Layout Padrão** - Simples e limpo
2. **Layout em Colunas** - 2 ou 3 colunas
3. **Layout com Destaque** - Capa chamativa
4. **Layout em Grade** - Para listar items

### Usar um Layout Existente

1. Ao criar uma página, selecione o layout desejado
2. Veja a prévia do layout
3. Confirme e selecione

### Visualizar Código do Layout (Avançado)

Se deseja personalizar um layout:

1. Acesse "Layouts"
2. Clique na lupa para ver detalhes
3. Clique "Ver Código"
4. O HTML e CSS aparecem
5. Você pode copiar e adaptar (se tem conhecimento técnico)

## Controle de Pagamentos

### Visão Geral de Pagamentos

O sistema permite rastrear quem pagou sua assinatura:

```
Usuário solicita assinatura → Admin registra pagamento → Admin aprova
                                                              ↓
                                                    Usuário tem acesso
```

### Criar Assinatura para Usuário

1. Vá para "Pagamentos" → "Assinaturas"
2. Clique "Nova Assinatura"
3. Selecione o usuário/instituição
4. Escolha o plano:
   - **BASIC**: Acesso básico
   - **PREMIUM**: Mais recursos
   - **ENTERPRISE**: Suporte total
5. Defina o valor em MZN (Metical)
6. Clique "Criar"

### Registrar um Pagamento

1. Vá para "Pagamentos" → "Registrar Pagamento"
2. Selecione o usuário
3. Selecione a assinatura
4. Escolha o método de pagamento:
   - **Mobile Money**: M-Pesa, Airtel Money, etc
   - **Transferência Bancária**
   - **Dinheiro**
   - **Cartão de Crédito**
5. Se for Mobile Money:
   - Digite o número de celular
   - Exemplo: `+258 82 123 4567`
6. Se for transferência bancária:
   - Digite referência ou número de comprovante
7. Clique "Registrar"
   - Pagamento fica em status **PENDENTE**

### Aprovar um Pagamento

**Importante**: Após aprovação, o usuário obtém acesso imediato

1. Vá para "Pagamentos" → "Pendentes"
2. Veja lista de pagamentos aguardando aprovação
3. Clique na linha do pagamento
4. Clique "Aprovar"
5. Confirme
6. **Pronto!** Usuário agora tem acesso

### Rejeitar um Pagamento

Se o pagamento é inválido ou fraudulento:

1. Abra o pagamento pendente
2. Clique "Rejeitar"
3. Digite motivo (opcional)
4. Confirme
5. Usuário é notificado da rejeição

### Ver Status de Pagamento da Instituição

1. Vá para "Pagamentos" → "Status Institucional"
2. Selecione a instituição
3. Veja:
   - Se está PAGA ou NÃO PAGA
   - Data da última confirmação
   - Lista de usuários
   - Histórico de transações

## Fluxos Principais

### Fluxo 1: Criar Instituição com Página

```
1. Admin cria instituição em "Instituições"
   ├─ Nome
   ├─ Descrição
   ├─ Email/Telefone
   └─ Local (Maputo, Gaza, etc)

2. Admin cria página para instituição
   ├─ Título: "Bem-vindo à Instituição X"
   ├─ Slug: "bem-vindo"
   ├─ Escolhe layout
   └─ Adiciona conteúdo

3. Admin publica página
   └─ Usuários podem agora acessar

4. Admin adiciona mais páginas
   ├─ "Sobre Nós"
   ├─ "Cursos"
   ├─ "Contato"
   └─ Todos publicados
```

### Fluxo 2: Gerenciar Pagamento de Usuário

```
1. Usuário/Instituição solicita acesso
   └─ Envia comprovante de pagamento

2. Admin registra o pagamento
   ├─ Seleciona usuário
   ├─ Seleciona método (Mobile Money/Bank/etc)
   └─ Marca como PENDENTE

3. Admin verifica o comprovante
   └─ Confirma se é válido

4. Admin aprova pagamento
   └─ Status muda para APPROVED

5. Sistema ativa acesso automaticamente
   └─ Usuário pode usar sistema

6. Admin vê no dashboard
   └─ Instituição aparece como PAGA
```

## Dicas e Boas Práticas

### Para Páginas

#### ✅ Faça Assim

```
Título: "Sobre a Instituição"
Slug: "sobre-institucao"
Descrição: "Conheça a história e missão da nossa instituição"
```

```
Título: "Admissão 2025"
Slug: "admissao-2025"
Descrição: "Critérios, datas e procedimentos de admissão"
```

#### ❌ Evite Assim

```
Título: "Página 1"
Slug: "pagina_1_editada_v2"  # Use hífens, não underscores
Descrição: ""  # Sempre preencha descrição
```

### Para Slugs (URLs)

- Use **letras minúsculas**
- Use **hífens** como separadores
- Não use espaços ou caracteres especiais
- Seja descritivo: `admissao-2025` é melhor que `p123`

### Para SEO

- Preencha sempre o título SEO
- Use 3-5 palavras-chave principais
- Inclua localização: "Maputo", "Moçambique"
- Exemplo:
  ```
  Título: "Instituição de Ensino | Maputo, Moçambique"
  Palavras-chave: "educação, escola, Maputo, ensino"
  ```

### Para Menu de Navegação

- Máximo 5-7 itens no menu principal
- Ordene logicamente:
  1. Início/Home
  2. Sobre
  3. Cursos
  4. Notícias
  5. Contato

### Para Pagamentos

- Sempre registre transações corretamente
- Guarde comprovantes
- Revise status regularmente
- Notifique usuários após aprovação (envie email/SMS)

### Backup e Segurança

- O sistema faz backup automático
- Nunca compartilhe sua senha de admin
- Use senhas fortes (maiúsculas, números, símbolos)
- Exemplo: `MeuExame@2025!Moz`

## Suporte e Ajuda

### Problemas Comuns

**P: Página não aparece para usuários**
- R: Verifique se está PUBLICADA
- R: Verifique se está marcada como ATIVA

**P: Quero mudar o layout de uma página**
- R: Edite a página → Escolha novo layout → Salve

**P: Esqueci a senha de admin**
- R: Contate o administrador do sistema
- R: Use "Esqueceu a Senha?" na tela de login

**P: Usuário diz que não consegue pagar**
- R: Verifique se tem uma ASSINATURA criada
- R: Verifique se o pagamento está APROVADO

---

## Glossário

| Termo | Significado |
|-------|------------|
| **Slug** | Identificador único da página na URL |
| **Layout** | Template/Modelo de aparência |
| **Publicar** | Tornar visível para usuários |
| **Rascunho** | Status de página não publicada |
| **SEO** | Otimização para motores de busca |
| **MZN** | Moeda de Moçambique (Metical) |
| **Mobile Money** | Pagamento por celular (M-Pesa, Airtel) |

---

**Versão 1.0** | Atualizado em 2025 | Para suporte: support@meuexame.mz
