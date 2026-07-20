# CRONOGRAMA DE DESENVOLVIMENTO – MEUEXAME (MVP + MELHORIAS)

**Período:** 29 de Junho a 08 de Agosto (1 mês e meio)

## Introdução

O presente cronograma descreve todas as atividades previstas para o desenvolvimento da plataforma MeuExame. O objetivo é construir uma primeira versão funcional (MVP – Minimum Viable Product), permitindo que administradores possam gerir todo o conteúdo através do painel de administração e que os utilizadores tenham acesso aos materiais de estudo e exames de forma simples, organizada e intuitiva.

O desenvolvimento será dividido em seis semanas, onde cada etapa possui objetivos específicos que servirão de base para a fase seguinte, garantindo uma evolução organizada do projeto.

---

## SEMANA 1 (29/06 – 04/07)
### Planeamento e organização do projeto

A primeira semana será dedicada ao planeamento e à preparação de toda a estrutura do sistema. Antes de iniciar a programação, será necessário compreender todas as funcionalidades que a plataforma deverá possuir, definir a arquitetura do projeto e organizar o ambiente de desenvolvimento.

#### Atividades

**1. Levantamento dos requisitos**
Nesta fase serão identificadas todas as funcionalidades essenciais da plataforma.
- Objetivos do MVP
- Funcionalidades para utilizadores
- Funcionalidades para administradores
- Restrições do sistema
- Regras de funcionamento

**2. Definição da arquitetura**
- Estrutura do Front-end
- Estrutura do Back-end
- Organização da Base de Dados
- Comunicação entre Front-end e API
- Organização das pastas do projeto

**3. Escolha das tecnologias**
- Front-end: Next.js 16.2.9
- Back-end: NestJS
- Base de Dados: PostgreSQL
- ORM: Prisma
- Sistema de autenticação: JWT
- Hospedagem: Docker

**4. Configuração do ambiente**
- Configuração dos repositórios Git
- Organização do projeto
- Configuração do ambiente local
- Instalação das dependências

**5. Wireframes**
- Página inicial
- Login
- Registo
- Dashboard
- Página de conteúdos
- Painel de Administração

#### Resultado esperado
Ao final desta semana, o projeto estará totalmente organizado, com a arquitetura definida e preparado para iniciar o desenvolvimento.

---

## SEMANA 2 (06/07 – 11/07)
### Desenvolvimento da estrutura principal

Nesta etapa será construída toda a base da aplicação, permitindo que os utilizadores possam criar conta e aceder ao sistema.

#### Front-end
**Desenvolvimento da interface principal**
- Cabeçalho
- Menu de navegação
- Rodapé
- Estrutura das páginas

**Sistema de autenticação**
- Login
- Registo
- Recuperação de palavra-passe (estrutura)

**Dashboard**
- Área principal do utilizador
- Perfil
- Conteúdos disponíveis
- Informações da conta

#### Back-end
**Sistema de autenticação**
- Registo de utilizadores
- Login
- Encriptação das palavras-passe
- Validação dos acessos

**Base de Dados**
- Tabelas principais: Utilizadores, Perfis, Sessões

**API**
- Primeira versão da API responsável por comunicar com o Front-end

#### Resultado esperado
Ao terminar esta semana, o utilizador já poderá criar uma conta, iniciar sessão e navegar na plataforma.

---

## SEMANA 3 (13/07 – 18/07)
### Desenvolvimento do sistema de conteúdos

Depois da autenticação concluída, será implementada a funcionalidade principal da plataforma: a gestão dos conteúdos.

#### Front-end
- Página dos conteúdos
- Página de exames
- Página de visualização dos conteúdos
- Sistema de pesquisa
- Melhorias na interface para facilitar a utilização

#### Back-end
**Sistema CRUD**
- Criar conteúdos
- Editar conteúdos
- Eliminar conteúdos
- Consultar conteúdos

**API**
- API responsável por fornecer todos os conteúdos ao Front-end

**Integração**
- Integração completa entre Front-end e Back-end

#### Resultado esperado
Nesta fase os conteúdos poderão ser criados e visualizados corretamente pelos utilizadores.

---

## SEMANA 4 (20/07 – 25/07)
### Desenvolvimento do Painel de Administração

Esta será uma das fases mais importantes do projeto. Será desenvolvido um painel administrativo que permitirá controlar toda a plataforma sem necessidade de alterar o código.

#### Funcionalidades
O administrador poderá:
- Gerir utilizadores
- Gerir conteúdos
- Gerir categorias
- Criar novas instituições
- Criar cursos
- Criar disciplinas
- Publicar exames
- Editar qualquer informação da plataforma

**Sistema de permissões**
- Administrador
- Utilizador

Cada perfil terá acesso apenas às funcionalidades permitidas.

#### Testes
- Testes para verificar se todas as funcionalidades desenvolvidas funcionam corretamente

#### Resultado esperado
O administrador conseguirá gerir toda a plataforma através do painel administrativo.

---

## SEMANA 5 (27/07 – 01/08)
### Melhorias e otimização

Depois da plataforma estar funcional, será iniciada uma fase de melhorias. O objetivo será tornar a plataforma mais rápida, organizada e agradável de utilizar.

#### Atividades
- Melhorar a interface gráfica
- Melhorar a experiência do utilizador
- Organizar melhor os conteúdos
- Melhorar a navegação
- Otimizar consultas à Base de Dados
- Melhorar a velocidade da API
- Reforçar a segurança
- Corrigir erros encontrados durante os testes

#### Resultado esperado
A plataforma ficará mais eficiente, mais segura e com uma melhor experiência para o utilizador.

---

## SEMANA 6 (03/08 – 08/08)
### Testes finais e lançamento

A última semana será dedicada à preparação da versão final do sistema.

#### Testes
- Login
- Registo
- Painel Administrativo
- Gestão de conteúdos
- Permissões
- Navegação
- API
- Base de Dados

#### Correções
- Corrigir todos os erros identificados
- Otimizações finais para melhorar o desempenho

#### Deploy
- Deploy do Front-end
- Deploy do Back-end
- Configuração da Base de Dados em produção
- Configuração do domínio
- Configuração do alojamento

#### Validação final
- Validação geral para garantir que todas as funcionalidades estão a funcionar corretamente

#### Resultado esperado
No final desta semana, o MeuExame estará disponível online, pronto para ser utilizado por estudantes, candidatos e administradores.

---

## Resultado Final Esperado

Ao concluir este cronograma, o MeuExame deverá disponibilizar uma plataforma moderna, organizada e totalmente funcional, permitindo:

- Registo e autenticação de utilizadores
- Painel de Administração completo
- Gestão de instituições de ensino
- Gestão de cursos e disciplinas
- Gestão de conteúdos educativos
- Gestão de exames de admissão
- Pesquisa de conteúdos
- Interface moderna e responsiva
- Sistema de permissões para Administrador e Utilizador
- Base de dados estruturada e segura
- API integrada entre o Front-end e o Back-end
- Plataforma otimizada para desempenho e segurança
- Sistema publicado em ambiente de produção e preparado para receber os primeiros utilizadores

Este cronograma garante uma evolução organizada do projeto, permitindo que cada fase seja concluída antes da seguinte, reduzindo riscos durante o desenvolvimento e assegurando a entrega de um MVP sólido, preparado para futuras funcionalidades e melhorias.
