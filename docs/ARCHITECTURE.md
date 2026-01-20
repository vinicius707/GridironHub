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
- [Documentação Relacionada](#documentação-relacionada)

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

Contém as entidades, regras de negócio puras e interfaces de repositórios.

```
src/domain/
├── entities/
│   ├── team.ts      # Entidade Team
│   ├── player.ts    # Entidade Player
│   ├── game.ts      # Entidade Game
│   └── index.ts     # Exportações
├── repositories/
│   ├── team-repository.ts      # ITeamRepository
│   ├── player-repository.ts    # IPlayerRepository
│   ├── game-repository.ts      # IGameRepository
│   └── index.ts                # Exportações
├── errors/
│   ├── domain-error.ts         # Hierarquia de erros
│   └── index.ts
└── ...
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

Contém os use cases, helpers, serviços e container de DI.

```
src/application/
├── use-cases/
│   ├── get-teams.ts     # Use cases de times
│   ├── get-players.ts   # Use cases de jogadores
│   ├── get-games.ts     # Use cases de partidas
│   └── index.ts         # Exportações
├── dependencies/
│   ├── container.ts    # Dependency Injection Container
│   └── index.ts
├── helpers/
│   ├── mapper-helper.ts # Helpers de mapeamento (DRY)
│   └── index.ts
├── services/
│   ├── error-service.ts # Serviço de tratamento de erros
│   └── index.ts
└── stores/              # Zustand stores
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

Implementações de serviços externos e repositórios concretos.

```
src/infrastructure/
├── http/
│   ├── client.ts    # HTTP Client genérico
│   └── index.ts
├── api/
│   └── nfl/
│       ├── client.ts # Cliente da NFL API
│       └── index.ts
└── repositories/
    ├── nfl-team-repository.ts    # Implementação ITeamRepository
    ├── nfl-player-repository.ts  # Implementação IPlayerRepository
    ├── nfl-game-repository.ts    # Implementação IGameRepository
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
├── types/
│   ├── api.ts       # Tipos de paginação, erros
│   └── index.ts
└── utils/
    ├── result.ts         # Tipo Result<T, E> para tratamento funcional
    ├── error-mapper.ts   # Mapeador de erros HTTP -> Domain
    └── index.ts
```

## Fluxo de Dados

### Fluxo Atual (com Repositórios e DI)

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
│              getContainer().getTeamRepository()              │
└────────────────────────────┬─────────────────────────────────┘
                             │ usa interface
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    Repositório (Interface)                    │
│                    (ITeamRepository)                          │
│                      repository.findAll()                     │
└────────────────────────────┬─────────────────────────────────┘
                             │ implementa
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              Repositório Concreto (Infrastructure)            │
│                  (NflTeamRepository)                          │
│              apiClient.getTeams() + mapList()                 │
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
│                    Helper de Mapeamento                        │
│              (mapList() ou mapPaginatedResponse())             │
└────────────────────────────┬─────────────────────────────────┘
                             │ entidade
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                       Componente                              │
│                     (TeamCard, TeamList)                      │
└──────────────────────────────────────────────────────────────┘
```

**Principais diferenças:**

1. **Use Case** obtém repositório via DI (`getContainer().getTeamRepository()`)
2. **Interface do Repositório** (domain) define o contrato
3. **Repositório Concreto** (infrastructure) implementa usando API client
4. **Helpers** centralizam lógica de mapeamento (DRY)

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

## Repositórios e Dependency Injection

### Interfaces de Repositórios (Domain)

As interfaces de repositórios são definidas no domain, garantindo que a camada de aplicação não dependa de implementações específicas:

```
src/domain/repositories/
├── team-repository.ts      # ITeamRepository
├── player-repository.ts     # IPlayerRepository
├── game-repository.ts       # IGameRepository
└── index.ts
```

**Exemplo de Interface:**

```typescript
export interface ITeamRepository {
  findAll(): Promise<Team[]>
  findById(id: number): Promise<Team | null>
  findByConference(conference: Conference): Promise<Team[]>
  findByDivision(conference: Conference, division: Division): Promise<Team[]>
}
```

### Implementações Concretas (Infrastructure)

As implementações concretas ficam na infrastructure e dependem do `NflApiClient`:

```
src/infrastructure/repositories/
├── nfl-team-repository.ts
├── nfl-player-repository.ts
├── nfl-game-repository.ts
└── index.ts
```

**Exemplo de Implementação:**

```typescript
export class NflTeamRepository implements ITeamRepository {
  constructor(private readonly apiClient: NflApiClient) {}

  async findAll(): Promise<Team[]> {
    const response = await this.apiClient.getTeams()
    return mapList(response.data, mapTeamFromDTO)
  }
}
```

### Dependency Injection Container

O container centraliza a criação de dependências e mantém instâncias singleton:

```typescript
// src/application/dependencies/container.ts
export class DependencyContainer {
  getTeamRepository(): ITeamRepository
  getPlayerRepository(): IPlayerRepository
  getGameRepository(): IGameRepository
}

export function getContainer(): DependencyContainer
```

**Uso nos Use Cases:**

```typescript
export async function getTeams(): Promise<Team[]> {
  const repository = getContainer().getTeamRepository()
  return repository.findAll()
}
```

**Benefícios:**

- **Testabilidade**: Fácil mockar repositórios nos testes
- **Flexibilidade**: Pode trocar implementação sem mudar use cases
- **Isolamento**: Domain não conhece infrastructure

## Helpers e Utilitários (DRY)

### Mapper Helpers

Helpers para evitar duplicação de lógica de mapeamento:

```typescript
// src/application/helpers/mapper-helper.ts
export function mapPaginatedResponse<TDto, TEntity>(
  response: PaginatedResponseDTO<TDto>,
  mapper: (dto: TDto) => TEntity
): PaginatedResponse<TEntity>

export function mapList<TDto, TEntity>(dtos: TDto[], mapper: (dto: TDto) => TEntity): TEntity[]
```

**Uso:**

```typescript
// Antes (❌ Duplicado)
return {
  data: response.data.map((dto) => mapPlayerFromDTO(dto, mapTeamFromDTO)),
  meta: mapPaginationMeta(response.meta),
}

// Depois (✅ Reutilizável)
return mapPaginatedResponse(response, (dto) => mapPlayerFromDTO(dto, mapTeamFromDTO))
```

### Tipo Result (Tratamento Funcional de Erros)

Tipo `Result<T, E>` para representar sucesso ou falha de forma explícita:

```typescript
// src/shared/utils/result.ts
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

export function ok<T>(data: T): Result<T, never>
export function err<E>(error: E): Result<never, E>
export function isOk<T, E>(result: Result<T, E>): boolean
export function isErr<T, E>(result: Result<T, E>): boolean
```

**Uso:**

```typescript
function fetchData(): Promise<Result<Team[], DomainError>> {
  try {
    const teams = await repository.findAll()
    return ok(teams)
  } catch (error) {
    return err(handleError(error))
  }
}
```

## Sistema de Erros (DRY e KISS)

### Hierarquia de Erros de Domínio

Erros específicos do domínio, separados de erros HTTP:

```
src/domain/errors/
├── domain-error.ts
└── index.ts
```

**Hierarquia:**

```typescript
DomainError (base)
├── TeamNotFoundError
├── PlayerNotFoundError
├── GameNotFoundError
├── NotFoundError (genérico)
├── UnauthorizedError
├── ValidationError
├── RateLimitError
├── ServerError
└── UnknownError (fallback)
```

### Mapeador de Erros

Converte erros HTTP para erros de domínio:

```typescript
// src/shared/utils/error-mapper.ts
export function mapHttpErrorToDomain(error: unknown): DomainError
export function mapNotFoundError(resource: 'team' | 'player' | 'game', id: number): DomainError
```

### Serviço de Erros

Centraliza tratamento de erros:

```typescript
// src/application/services/error-service.ts
export function handleError(error: unknown): DomainError
export function isDomainError(error: unknown): error is DomainError
export function getErrorMessage(error: unknown): string
export function getErrorCode(error: unknown): string
```

## Princípios Aplicados

### Clean Architecture

**Dependency Rule:**

- Domain não depende de nada (apenas TypeScript)
- Application depende apenas de Domain
- Infrastructure depende de Domain e Application
- Presentation depende de Application

**Camadas:**

```
Presentation → Application → Domain ← Infrastructure
```

### DRY (Don't Repeat Yourself)

**Antes:**

- Lógica de mapeamento repetida em cada repositório
- Tratamento de erros duplicado
- Código similar em múltiplos use cases

**Depois:**

- Helpers reutilizáveis (`mapPaginatedResponse`, `mapList`)
- Sistema centralizado de erros
- Use cases simples que delegam para repositórios

### KISS (Keep It Simple, Stupid)

**Antes:**

- Use cases com lógica complexa de mapeamento
- Dependências diretas de infrastructure
- Código difícil de testar

**Depois:**

- Use cases simples (3-5 linhas)
- Dependências injetadas via DI
- Fácil de testar e manter

## Extensibilidade

### Adicionando NCAAF

A arquitetura está preparada para adicionar NCAAF:

```
src/domain/repositories/
├── team-repository.ts      # Interface genérica
└── ...

src/infrastructure/repositories/
├── nfl/
│   ├── nfl-team-repository.ts
│   └── ...
└── ncaaf/                  # Novo
    ├── ncaaf-team-repository.ts
    └── ...
```

**Container atualizado:**

```typescript
getTeamRepository(league: 'nfl' | 'ncaaf'): ITeamRepository {
  if (league === 'ncaaf') {
    return new NcaafTeamRepository(this.getNcaafApiClient())
  }
  return this.getNflTeamRepository()
}
```

### Adicionando Novos Endpoints

1. Adicionar método na interface do repositório (domain)
2. Implementar no repositório concreto (infrastructure)
3. Criar use case que usa o repositório
4. Adicionar testes

### Adicionando Novos Componentes

1. Identificar nível (atom, molecule, organism)
2. Criar componente na pasta correta
3. Exportar no `index.ts`
4. Adicionar testes

## Guia de Uso

### Criando um Novo Use Case

1. **Definir interface no repositório (se necessário):**

```typescript
// src/domain/repositories/team-repository.ts
export interface ITeamRepository {
  findByLocation(location: string): Promise<Team[]>
}
```

2. **Implementar no repositório concreto:**

```typescript
// src/infrastructure/repositories/nfl-team-repository.ts
async findByLocation(location: string): Promise<Team[]> {
  const teams = await this.findAll()
  return teams.filter(team => team.location === location)
}
```

3. **Criar use case:**

```typescript
// src/application/use-cases/get-teams.ts
export async function getTeamsByLocation(location: string): Promise<Team[]> {
  const repository = getContainer().getTeamRepository()
  return repository.findByLocation(location)
}
```

4. **Criar testes:**

```typescript
// __tests__/unit/application/get-teams.test.ts
it('deve retornar times por localização', async () => {
  mockRepository.findByLocation.mockResolvedValue([mockTeam])
  const result = await getTeamsByLocation('Philadelphia')
  expect(result).toEqual([mockTeam])
})
```

### Tratando Erros

```typescript
import { handleError } from '@/application/services'
import { TeamNotFoundError } from '@/domain/errors'

try {
  const team = await getTeamById(id)
  if (!team) {
    throw new TeamNotFoundError(id)
  }
  return team
} catch (error) {
  const domainError = handleError(error)
  // Log, notificar usuário, etc.
  throw domainError
}
```

---

Para mais informações, consulte o [README.md](../README.md) principal.
