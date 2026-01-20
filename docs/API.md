# Documentação da API

Este documento descreve a integração com a API balldontlie NFL.

## Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Use Cases](#use-cases)
- [Tratamento de Erros](#tratamento-de-erros)
- [Rate Limiting](#rate-limiting)
- [Cache](#cache)

## Visão Geral

O GridironHub utiliza a [balldontlie NFL API](https://nfl.balldontlie.io/) para obter dados sobre times e jogadores da NFL.

**Base URL:** `https://api.balldontlie.io/nfl/v1`

**Documentação Oficial:** [https://nfl.balldontlie.io/#nfl-api](https://nfl.balldontlie.io/#nfl-api)

## Autenticação

A API requer uma chave de autenticação enviada no header:

```http
Authorization: YOUR_API_KEY
```

### Obtendo uma API Key

A API balldontlie oferece um **plano gratuito** que permite:

- **5 requisições por minuto**
- Acesso aos endpoints: Teams, Players
- Sem custo

**Passos para obter sua API key:**

1. Acesse [balldontlie.io](https://www.balldontlie.io/)
2. Clique em "Sign Up" ou "Get Started" para criar uma conta gratuita
3. Após criar sua conta, acesse seu dashboard
4. Copie sua API key

### Configuração

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

2. Edite o arquivo `.env.local` e adicione sua API key:

```env
# .env.local
BALLDONTLIE_API_KEY=sua_chave_aqui
```

> **Importante:** Nunca commite o arquivo `.env.local` no repositório. Ele está configurado no `.gitignore` para segurança.

### Limites do Plano Gratuito

- **Rate Limit:** 5 requisições por minuto
- **Endpoints disponíveis:** Teams, Players
- **Upgrade disponível:** Para mais requisições, consulte [balldontlie.io/pricing](https://www.balldontlie.io/pricing)

> **Nota:** O GridironHub implementa cache agressivo para otimizar o uso da API e respeitar os limites do plano gratuito.

## Endpoints

### Teams (Times)

#### Listar Todos os Times

```http
GET /nfl/v1/teams
```

**Resposta:**

```json
{
  "data": [
    {
      "id": 18,
      "conference": "NFC",
      "division": "EAST",
      "location": "Philadelphia",
      "name": "Eagles",
      "full_name": "Philadelphia Eagles",
      "abbreviation": "PHI"
    }
  ]
}
```

#### Buscar Time por ID

```http
GET /nfl/v1/teams/:id
```

**Resposta:**

```json
{
  "data": {
    "id": 18,
    "conference": "NFC",
    "division": "EAST",
    "location": "Philadelphia",
    "name": "Eagles",
    "full_name": "Philadelphia Eagles",
    "abbreviation": "PHI"
  }
}
```

### Players (Jogadores)

#### Listar Jogadores

```http
GET /nfl/v1/players
```

**Parâmetros:**

| Parâmetro    | Tipo     | Descrição                        |
| ------------ | -------- | -------------------------------- |
| `cursor`     | number   | Cursor para paginação            |
| `per_page`   | number   | Resultados por página (max: 100) |
| `team_ids[]` | number[] | Filtrar por times                |
| `search`     | string   | Buscar por nome                  |
| `first_name` | string   | Filtrar por primeiro nome        |
| `last_name`  | string   | Filtrar por sobrenome            |

**Resposta:**

```json
{
  "data": [
    {
      "id": 490,
      "first_name": "Jalen",
      "last_name": "Hurts",
      "position": "Quarterback",
      "position_abbreviation": "QB",
      "height": "6'1\"",
      "weight": "223 lbs",
      "jersey_number": "1",
      "college": "Oklahoma",
      "experience": "5",
      "age": 26,
      "team": {
        "id": 18,
        "full_name": "Philadelphia Eagles"
      }
    }
  ],
  "meta": {
    "next_cursor": 100,
    "per_page": 25
  }
}
```

#### Buscar Jogador por ID

```http
GET /nfl/v1/players/:id
```

## Use Cases

### Usando os Use Cases

```typescript
import { getTeams, getTeamById } from '@/application/use-cases'

// Listar todos os times
const teams = await getTeams()

// Buscar time por ID
const team = await getTeamById(18)

// Filtrar por conferência
const nfcTeams = await getTeamsByConference('NFC')

// Filtrar por divisão
const nfcEastTeams = await getTeamsByDivision('NFC', 'EAST')
```

### Players

```typescript
import { getPlayers, getPlayerById, searchPlayers } from '@/application/use-cases'

// Listar jogadores (paginado)
const { data: players, meta } = await getPlayers({ perPage: 50 })

// Buscar jogador por ID
const player = await getPlayerById(490)

// Buscar por nome
const { data: results } = await searchPlayers('Hurts')

// Jogadores de um time
const { data: teamPlayers } = await getPlayersByTeam(18)
```

## Tratamento de Erros

### Códigos de Erro

| Código | Significado         | Ação Recomendada            |
| ------ | ------------------- | --------------------------- |
| 400    | Requisição inválida | Verificar parâmetros        |
| 401    | Não autorizado      | Verificar API key           |
| 404    | Não encontrado      | Verificar ID/endpoint       |
| 429    | Rate limit          | Aguardar e tentar novamente |
| 500    | Erro do servidor    | Tentar novamente mais tarde |

### Usando HttpClientError

```typescript
import { HttpClientError } from '@/infrastructure/http'
import { ApiErrorCode } from '@/shared/types'

try {
  const teams = await getTeams()
} catch (error) {
  if (error instanceof HttpClientError) {
    switch (error.code) {
      case ApiErrorCode.RATE_LIMITED:
        // Aguardar e tentar novamente
        break
      case ApiErrorCode.UNAUTHORIZED:
        // Verificar API key
        break
      default:
      // Erro genérico
    }
  }
}
```

## Rate Limiting

### Limites por Plano

| Plano    | Requisições/minuto | Custo      |
| -------- | ------------------ | ---------- |
| Free     | 5                  | $0         |
| ALL-STAR | 60                 | $9.99/mês  |
| GOAT     | 600                | $39.99/mês |

### Estratégias de Otimização

1. **Cache agressivo**: Usar SSG/ISR do Next.js
2. **Paginação eficiente**: Limitar `per_page` ao necessário
3. **Batching**: Agrupar requisições quando possível

## Cache

### SSG (Static Site Generation)

```typescript
// src/app/times/page.tsx
export const revalidate = 3600 // Revalidar a cada 1 hora

export default async function TimesPage() {
  const teams = await getTeams() // Cached
  return <TeamList teams={teams} />
}
```

### ISR (Incremental Static Regeneration)

```typescript
// src/app/jogadores/page.tsx
export const revalidate = 300 // Revalidar a cada 5 minutos

export default async function JogadoresPage() {
  const { data: players } = await getPlayers()
  return <PlayerList players={players} />
}
```

---

Para mais informações, consulte a [documentação oficial da API](https://nfl.balldontlie.io/).
