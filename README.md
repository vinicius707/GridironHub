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

- 📊 Listagem de todos os 32 times da NFL
- 👤 Busca e visualização de jogadores
- 🏟️ Acompanhamento de partidas por temporada
- 🔍 Filtros por conferência, divisão e semana

## 🛠️ Tecnologias

| Categoria   | Tecnologia                        |
| ----------- | --------------------------------- |
| Frontend    | React 18, Next.js 16 (App Router) |
| Linguagem   | TypeScript                        |
| Estilização | Tailwind CSS                      |
| Testes      | Jest, React Testing Library       |
| Deploy      | Vercel                            |
| API         | balldontlie NFL API               |

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

Para mais detalhes, consulte [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chave da API balldontlie (gratuita)

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

4. Adicione sua chave da API no arquivo `.env.local`:

```env
BALLDONTLIE_API_KEY=sua_chave_aqui
```

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

O projeto utiliza Jest e React Testing Library.

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch
```

### Cobertura Atual

| Camada                  | Cobertura |
| ----------------------- | --------- |
| Domain (Entidades)      | 100%      |
| Application (Use Cases) | 100%      |
| Infrastructure (HTTP)   | 100%      |

## 🚀 Deploy

O projeto está configurado para deploy na Vercel.

### Deploy Manual

```bash
npm run build
```

### Deploy Automático

Push para a branch `main` aciona deploy automático na Vercel.

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
