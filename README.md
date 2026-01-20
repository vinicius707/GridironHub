# GridironHub 🏈

Aplicação web para visualização de dados da NFL (National Football League), construída com Next.js e SSG (Static Site Generation).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Começando](#começando)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Testes](#testes)
- [Deploy](#deploy)

## 📖 Sobre o Projeto

GridironHub é uma aplicação web performática que exibe informações sobre times, jogadores e partidas da NFL, consumindo a API [balldontlie](https://nfl.balldontlie.io/).

### Funcionalidades

- 📊 Listagem de todos os 32 times da NFL organizados por conferência e divisão
- 👤 Busca e visualização de jogadores com filtros por time e posição
- 🏟️ Acompanhamento de partidas por temporada e semana
- 🔍 Filtros avançados por conferência, divisão, temporada e tipo de jogo
- 🌐 Suporte a múltiplos idiomas (Português e Inglês)
- 📱 Design responsivo e acessível (WCAG 2.1 AA)
- ⚡ Performance otimizada com SSG/ISR
- 🎨 Interface moderna com modo escuro

## 🛠️ Tecnologias

| Categoria   | Tecnologia                        |
| ----------- | --------------------------------- |
| Categoria     | Tecnologia                                  |
| ------------- | ------------------------------------------- |
| Frontend      | React 18, Next.js 16 (App Router)          |
| Linguagem     | TypeScript                                  |
| Estilização   | Tailwind CSS                                |
| Internacionalização | next-intl                               |
| Testes        | Jest, React Testing Library                 |
| Deploy        | Vercel                                      |
| API           | balldontlie NFL API                         |
| Geração Estática | SSG/ISR (Next.js)                       |
| Arquitetura   | Clean Architecture + Atomic Design          |

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Atomic Design**.

```
src/
├── app/                    # Next.js App Router (páginas)
├── domain/                 # Entidades e regras de negócio
├── application/            # Use cases
├── infrastructure/         # Implementações externas (API, HTTP)
├── presentation/           # Componentes UI (Atomic Design)
└── shared/                 # Tipos e utilitários compartilhados
```

Para mais detalhes:

- [Arquitetura](./docs/ARCHITECTURE.md) - Clean Architecture e camadas
- [Sistema de Design](./docs/COMPONENTS.md) - Atomic Design e componentes
- [Navegação e i18n](./docs/NAVIGATION.md) - Sistema de navegação e internacionalização
- [Páginas e Fluxos](./docs/PAGES.md) - Documentação das páginas e fluxos da aplicação
- [API](./docs/API.md) - Integração com balldontlie API
- [Deploy](./docs/DEPLOY.md) - Guia completo de deploy na Vercel

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chave da API balldontlie (gratuita)

### Como Obter a API Key da balldontlie

A API balldontlie oferece um plano gratuito que permite:

- **5 requisições por minuto**
- Acesso aos endpoints: Teams, Players, Games
- Sem custo

**Passos para obter sua API key:**

1. Acesse [https://www.balldontlie.io/](https://www.balldontlie.io/)
2. Clique em "Sign Up" ou "Get Started" para criar uma conta gratuita
3. Após criar sua conta, acesse seu dashboard
4. Copie sua API key
5. Cole a API key no arquivo `.env.local` (veja instruções abaixo)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/gridironhub.git
cd gridironhub
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Edite o arquivo `.env.local` e adicione sua chave da API:

```env
BALLDONTLIE_API_KEY=sua_chave_aqui
```

> **Importante:** Nunca commite o arquivo `.env.local` no repositório. Ele está configurado no `.gitignore` para segurança.

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 📜 Scripts Disponíveis

| Comando                 | Descrição                          |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Inicia servidor de desenvolvimento |
| `npm run build`         | Gera build de produção             |
| `npm run start`         | Inicia servidor de produção        |
| `npm run lint`          | Executa linter (ESLint)            |
| `npm run format`        | Formata código (Prettier)          |
| `npm test`              | Executa testes                     |
| `npm run test:watch`    | Executa testes em modo watch       |
| `npm run test:coverage` | Executa testes com cobertura       |

## 📁 Estrutura do Projeto

```
gridironhub/
├── __tests__/              # Testes
│   ├── unit/               # Testes unitários
│   ├── integration/        # Testes de integração
│   └── e2e/                # Testes end-to-end
├── docs/                   # Documentação
├── public/                 # Assets estáticos
├── src/
│   ├── app/                # Páginas (Next.js App Router)
│   ├── application/        # Use cases
│   ├── domain/             # Entidades
│   ├── infrastructure/     # API clients
│   ├── presentation/       # Componentes
│   └── shared/             # Tipos compartilhados
├── .env.example            # Exemplo de variáveis de ambiente
├── jest.config.ts          # Configuração do Jest
├── next.config.ts          # Configuração do Next.js
├── tailwind.config.ts      # Configuração do Tailwind
└── tsconfig.json           # Configuração do TypeScript
```

## 🔌 API

O projeto utiliza a [balldontlie NFL API](https://nfl.balldontlie.io/).

### Endpoints Utilizados (Plano Gratuito)

| Endpoint                  | Descrição                  |
| ------------------------- | -------------------------- |
| `GET /nfl/v1/teams`       | Lista todos os times       |
| `GET /nfl/v1/teams/:id`   | Detalhes de um time        |
| `GET /nfl/v1/players`     | Lista jogadores (paginado) |
| `GET /nfl/v1/players/:id` | Detalhes de um jogador     |
| `GET /nfl/v1/games`       | Lista partidas             |
| `GET /nfl/v1/games/:id`   | Detalhes de uma partida    |

### Limites

- 5 requisições por minuto (plano gratuito)
- Cache agressivo implementado para otimizar

## 🧪 Testes

O projeto utiliza Jest e React Testing Library para garantir qualidade e confiabilidade.

### Tipos de Testes

| Tipo            | Localização                  | Cobertura                            |
| --------------- | ---------------------------- | ------------------------------------ |
| Unitários       | `__tests__/unit/`            | Entidades, Mappers, Use Cases        |
| Integração      | `__tests__/integration/`     | Páginas e componentes completos      |
| End-to-End (E2E)| `__tests__/e2e/flows/`       | Fluxos principais da aplicação       |

### Scripts de Teste

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch

# Executar testes para CI
npm run test:ci
```

### Cobertura Atual

| Camada                  | Cobertura |
| ----------------------- | --------- |
| Domain (Entidades)      | 100%      |
| Application (Use Cases) | 100%      |
| Infrastructure (HTTP)   | 100%      |
| Presentation (Componentes) | 100%   |
| Integration (Páginas)   | 100%      |
| E2E (Fluxos)            | Implementado |

## 🚀 Deploy

O projeto está configurado para deploy na Vercel com suporte a SSG (Static Site Generation) e ISR (Incremental Static Regeneration).

### Pré-requisitos para Deploy

1. Conta na [Vercel](https://vercel.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. API key da balldontlie configurada como variável de ambiente

### Configuração na Vercel

1. **Conecte seu repositório:**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe o repositório GridironHub
   - Configure o framework preset como **Next.js**

2. **Configure variáveis de ambiente:**
   - Adicione a variável `BALLDONTLIE_API_KEY` no painel da Vercel
   - Vá em Settings → Environment Variables
   - Adicione: `BALLDONTLIE_API_KEY` = `sua_chave_aqui`

3. **Configurações de Build:**
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `.next` (automático)
   - **Install Command:** `npm install` (automático)

### Estratégia de Deploy

O projeto utiliza **SSG/ISR** para otimização:

- **Páginas Estáticas:** Home, páginas de lista (com revalidação)
- **ISR On-Demand:** Páginas de detalhes geradas sob demanda
- **Revalidação:**
  - Times: 1 hora
  - Jogadores: 30 minutos
  - Partidas: 15 minutos

### Deploy Manual

```bash
# Build local para testar
npm run build

# Testar produção localmente
npm run start
```

### Deploy Automático

O deploy automático acontece quando:

- **Push para `main`:** Deploy de produção
- **Push para `develop`:** Preview deployment (opcional)
- **Pull Requests:** Preview deployments automáticos

### Monitoramento

Após o deploy, monitore:

- Build logs na Vercel
- Rate limit da API (5 req/min no plano gratuito)
- Performance através do dashboard da Vercel

### Troubleshooting

**Erro de build:**
- Verifique se `BALLDONTLIE_API_KEY` está configurada
- Confirme que não há erros de TypeScript (`npm run lint`)
- Verifique os logs de build na Vercel

**Erro de rate limit:**
- A API tem limite de 5 requisições/minuto
- ISR ajuda a reduzir requisições
- Considere upgrade do plano da API se necessário

Para mais informações sobre deploy, consulte a [documentação da Vercel](https://vercel.com/docs).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ para fãs de NFL
