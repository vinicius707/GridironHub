# Arquitetura do GridironHub

Este documento descreve a arquitetura do projeto GridironHub, baseada em **Clean Architecture** e **Atomic Design**.

## Índice

- [Visão Geral](#visão-geral)
- [Clean Architecture](#clean-architecture)
- [Camadas](#camadas)
- [Fluxo de Dados](#fluxo-de-dados)
- [Atomic Design](#atomic-design)
- [Padrões e Convenções](#padrões-e-convenções)
- [Extensibilidade](#extensibilidade)

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation                          │
│  (Pages, Components - Atomic Design)                        │
├─────────────────────────────────────────────────────────────┤
│                        Application                           │
│  (Use Cases: getTeams, getPlayers, getGames)                │
├─────────────────────────────────────────────────────────────┤
│                          Domain                              │
│  (Entities: Team, Player, Game)                             │
├─────────────────────────────────────────────────────────────┤
│                      Infrastructure                          │
│  (HTTP Client, NFL API Client)                              │
└─────────────────────────────────────────────────────────────┘
```

## Clean Architecture

O projeto segue os princípios de Clean Architecture para garantir:

- **Independência de frameworks**: O domínio não depende de Next.js ou React
- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Independência de UI**: A lógica de negócio não conhece a interface
- **Independência de banco de dados**: Fácil trocar a fonte de dados
- **Independência de agentes externos**: Regras de negócio isoladas

### Regra de Dependência

As dependências sempre apontam para dentro:

```
Presentation → Application → Domain ← Infrastructure
```

## Camadas

### 1. Domain (Domínio)

Contém as entidades e regras de negócio puras.

```
src/domain/
└── entities/
    ├── team.ts      # Entidade Team
    ├── player.ts    # Entidade Player
    ├── game.ts      # Entidade Game
    └── index.ts     # Exportações
```

#### Entidades

```typescript
// Team
interface Team {
  id: number
  conference: 'AFC' | 'NFC'
  division: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'
  location: string
  name: string
  fullName: string
  abbreviation: string
}

// Player
interface Player {
  id: number
  firstName: string
  lastName: string
  position: string
  positionAbbreviation: string
  height: string
  weight: string
  jerseyNumber: string
  college: string
  experience: string
  age: number
  team: Team | null
}

// Game
interface Game {
  id: number
  visitorTeam: Team
  homeTeam: Team
  homeTeamScore: number
  visitorTeamScore: number
  season: number
  postseason: boolean
  status: string
  week: number
  time: string
  date: string
}
```

#### DTOs e Mappers

Cada entidade possui:

- **DTO**: Data Transfer Object para comunicação com API (snake_case)
- **Mapper**: Função para converter DTO → Entity (camelCase)

```typescript
// Exemplo de mapper
function mapTeamFromDTO(dto: TeamDTO): Team {
  return {
    id: dto.id,
    fullName: dto.full_name, // snake_case → camelCase
    // ...
  }
}
```

### 2. Application (Aplicação)

Contém os use cases que orquestram a lógica de negócio.

```
src/application/
└── use-cases/
    ├── get-teams.ts     # Use cases de times
    ├── get-players.ts   # Use cases de jogadores
    ├── get-games.ts     # Use cases de partidas
    └── index.ts         # Exportações
```

#### Use Cases Disponíveis

**Teams:**

- `getTeams()` - Lista todos os times
- `getTeamById(id)` - Busca time por ID
- `getTeamsByConference(conference)` - Filtra por conferência
- `getTeamsByDivision(conference, division)` - Filtra por divisão

**Players:**

- `getPlayers(params)` - Lista jogadores (paginado)
- `getPlayerById(id)` - Busca jogador por ID
- `getPlayersByTeam(teamId)` - Filtra por time
- `searchPlayers(search)` - Busca por nome

**Games:**

- `getGames(params)` - Lista partidas (paginado)
- `getGameById(id)` - Busca partida por ID
- `getGamesBySeason(season)` - Filtra por temporada
- `getGamesByWeek(season, week)` - Filtra por semana
- `getPlayoffGames(season)` - Apenas playoffs

### 3. Infrastructure (Infraestrutura)

Implementações de serviços externos.

```
src/infrastructure/
├── http/
│   ├── client.ts    # HTTP Client genérico
│   └── index.ts
└── api/
    └── nfl/
        ├── client.ts # Cliente da NFL API
        └── index.ts
```

#### HTTP Client

Cliente HTTP genérico com:

- Tratamento de erros padronizado
- Suporte a query params
- Headers de autenticação

```typescript
class HttpClient {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T>
}
```

#### NFL API Client

Cliente específico para a API balldontlie:

```typescript
class NflApiClient {
  // Teams
  async getTeams(): Promise<TeamsResponseDTO>
  async getTeamById(id: number): Promise<TeamResponseDTO>

  // Players
  async getPlayers(params?: GetPlayersParams): Promise<PlayersResponseDTO>
  async getPlayerById(id: number): Promise<PlayerResponseDTO>

  // Games
  async getGames(params?: GetGamesParams): Promise<GamesResponseDTO>
  async getGameById(id: number): Promise<GameResponseDTO>
}
```

### 4. Presentation (Apresentação)

Componentes UI seguindo Atomic Design.

```
src/presentation/
└── components/
    ├── atoms/       # Componentes básicos
    ├── molecules/   # Composição de átomos
    ├── organisms/   # Blocos funcionais
    └── templates/   # Estrutura de páginas
```

### 5. Shared (Compartilhado)

Tipos e utilitários usados em múltiplas camadas.

```
src/shared/
└── types/
    ├── api.ts       # Tipos de paginação, erros
    └── index.ts
```

## Fluxo de Dados

```
┌──────────────────────────────────────────────────────────────┐
│                         Página                                │
│                    (src/app/times/page.tsx)                   │
└────────────────────────────┬─────────────────────────────────┘
                             │ chama
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                        Use Case                               │
│                      (getTeams())                             │
└────────────────────────────┬─────────────────────────────────┘
                             │ chama
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                      NFL API Client                           │
│                   (nflApiClient.getTeams())                   │
└────────────────────────────┬─────────────────────────────────┘
                             │ chama
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                       HTTP Client                             │
│              (httpClient.get('/teams'))                       │
└────────────────────────────┬─────────────────────────────────┘
                             │ fetch
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    balldontlie API                            │
│          (https://api.balldontlie.io/nfl/v1/teams)           │
└────────────────────────────┬─────────────────────────────────┘
                             │ resposta (DTO)
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                         Mapper                                │
│                   (mapTeamFromDTO())                          │
└────────────────────────────┬─────────────────────────────────┘
                             │ entidade
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                       Componente                              │
│                     (TeamCard, TeamList)                      │
└──────────────────────────────────────────────────────────────┘
```

## Atomic Design

Os componentes seguem a metodologia Atomic Design:

| Nível         | Descrição                         | Exemplos                          |
| ------------- | --------------------------------- | --------------------------------- |
| **Atoms**     | Componentes básicos, indivisíveis | Button, Text, Badge, Icon         |
| **Molecules** | Composição de átomos              | TeamCard, PlayerRow, GameScore    |
| **Organisms** | Blocos funcionais maiores         | TeamGrid, PlayerTable, GamesTable |
| **Templates** | Estrutura de páginas              | PageLayout, ListLayout            |
| **Pages**     | Páginas completas                 | Home, Times, Jogadores            |

## Padrões e Convenções

### Nomenclatura

- **Arquivos**: kebab-case (`get-teams.ts`)
- **Componentes**: PascalCase (`TeamCard.tsx`)
- **Funções**: camelCase (`getTeamById`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Tipos/Interfaces**: PascalCase (`TeamDTO`)

### Commits

Seguimos Conventional Commits em português:

```
feat: adicionar nova funcionalidade
fix: corrigir bug
refactor: refatorar código
style: alterações de estilo
docs: documentação
chore: tarefas de manutenção
test: testes
```

### Branches

```
feature/nome-da-feature
fix/descricao-do-bug
docs/descricao
release/vX.X.X
```

## Extensibilidade

### Adicionando NCAAF

A arquitetura está preparada para adicionar NCAAF:

```
src/infrastructure/api/
├── nfl/
│   └── client.ts
└── ncaaf/          # Novo
    └── client.ts
```

```
src/app/
├── times/          # NFL (atual)
└── ncaaf/          # Novo
    └── times/
```

### Adicionando Novos Endpoints

1. Adicionar método no `NflApiClient`
2. Criar use case correspondente
3. Adicionar entidade se necessário
4. Criar testes

### Adicionando Novos Componentes

1. Identificar nível (atom, molecule, organism)
2. Criar componente na pasta correta
3. Exportar no `index.ts`
4. Adicionar testes

---

Para mais informações, consulte o [README.md](../README.md) principal.
