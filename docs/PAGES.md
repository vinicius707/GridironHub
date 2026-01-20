# Documentação das Páginas e Fluxos

Este documento descreve as páginas implementadas no GridironHub, seus fluxos principais e funcionalidades.

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Rotas](#estrutura-de-rotas)
- [Páginas Implementadas](#páginas-implementadas)
  - [Home](#home)
  - [Times](#times)
  - [Jogadores](#jogadores)
  - [Partidas](#partidas)
- [Fluxos Principais](#fluxos-principais)
- [Navegação e Links](#navegação-e-links)

## Visão Geral

O GridironHub é uma aplicação Next.js 16 com App Router que exibe informações sobre a NFL (National Football League). Todas as páginas são renderizadas no servidor usando SSG (Static Site Generation) quando possível.

### Características

- **SSG/SSR**: Páginas são pré-renderizadas ou renderizadas no servidor
- **i18n**: Suporte completo a Português e Inglês
- **Responsivo**: Design mobile-first com suporte a todos os dispositivos
- **Acessibilidade**: WCAG 2.1 AA compliant
- **SEO**: Metadata otimizada para cada página

## Estrutura de Rotas

```
/[locale]/
├── / (Home)
├── /teams (Lista de Times)
│   └── /[id] (Detalhes do Time)
├── /players (Lista de Jogadores)
│   └── /[id] (Detalhes do Jogador)
└── /games (Lista de Partidas)
    └── /[id] (Detalhes da Partida)
```

### Parâmetros de URL

- `[locale]`: Idioma da aplicação (`pt` ou `en`)
- `[id]`: ID numérico do recurso (time, jogador ou partida)

### Query Parameters

#### Página de Jogadores (`/players`)

- `page`: Número da página (padrão: 1)
- `search`: Busca por nome do jogador
- `teamId`: Filtrar por ID do time
- `position`: Filtrar por posição (ex: "QB", "WR")

#### Página de Partidas (`/games`)

- `page`: Número da página (padrão: 1)
- `season`: Filtrar por temporada (ano)
- `week`: Filtrar por semana (1-18)
- `teamId`: Filtrar por ID do time
- `postseason`: Filtrar por tipo (`true` para playoffs, `false` para temporada regular)

## Páginas Implementadas

### Home

**Rota:** `/` ou `/[locale]`

**Arquivo:** `src/app/[locale]/page.tsx`

**Descrição:** Página inicial da aplicação com visão geral e links para as seções principais.

**Funcionalidades:**

- Apresentação da aplicação
- Links rápidos para Times, Jogadores e Partidas
- Informações sobre a NFL e a API utilizada

### Times

#### Lista de Times

**Rota:** `/teams` ou `/[locale]/teams`

**Arquivo:** `src/app/[locale]/teams/page.tsx`

**Descrição:** Exibe todos os 32 times da NFL organizados por conferência (AFC/NFC) e divisão (EAST/WEST/NORTH/SOUTH).

**Funcionalidades:**

- Listagem completa de todos os times
- Organização hierárquica por conferência e divisão
- Cards clicáveis que redirecionam para detalhes do time
- Responsivo: grid adaptável para diferentes tamanhos de tela

**Componentes Utilizados:**

- `TeamCard` - Card de exibição do time
- `Text` - Componente de texto tipado

**Use Cases:**

- `getTeams()` - Busca todos os times

#### Detalhes do Time

**Rota:** `/teams/[id]` ou `/[locale]/teams/[id]`

**Arquivo:** `src/app/[locale]/teams/[id]/page.tsx`

**Descrição:** Exibe informações detalhadas de um time específico.

**Funcionalidades:**

- Informações completas do time (nome, conferência, divisão, localização)
- Badge com abreviação do time
- Botão "Voltar" para retornar à lista
- Layout responsivo

**Componentes Utilizados:**

- `TeamCard` - Card de exibição do time
- `Button` - Botão de navegação
- `Badge` - Badge com abreviação
- `Text` - Componente de texto tipado

**Use Cases:**

- `getTeamById(id)` - Busca time por ID

**Tratamento de Erros:**

- Redireciona para 404 se o ID for inválido
- Redireciona para 404 se o time não for encontrado

### Jogadores

#### Lista de Jogadores

**Rota:** `/players` ou `/[locale]/players`

**Arquivo:** `src/app/[locale]/players/page.tsx`

**Descrição:** Lista de jogadores da NFL com filtros e paginação.

**Funcionalidades:**

- **Busca por nome**: Campo de texto para buscar jogadores
- **Filtro por time**: Select com todos os times disponíveis
- **Filtro por posição**: Select com posições disponíveis nos resultados
- **Paginação**: Navegação entre páginas (25 jogadores por página)
- **Resultados**: Lista de jogadores com informações resumidas
- **Mensagem vazia**: Exibe mensagem quando não há resultados

**Parâmetros de Busca:**

- `page`: Número da página
- `search`: Busca por nome (primeiro ou último)
- `teamId`: ID do time para filtrar
- `position`: Posição para filtrar (ex: "QB", "WR", "RB")

**Componentes Utilizados:**

- `PlayerRow` - Linha de exibição do jogador
- `Button` - Botões de paginação e busca
- `Text` - Componentes de texto
- `Skeleton` - Placeholder de carregamento (se implementado)

**Use Cases:**

- `getPlayers(params)` - Busca jogadores com filtros e paginação
- `getTeams()` - Busca times para o filtro

#### Detalhes do Jogador

**Rota:** `/players/[id]` ou `/[locale]/players/[id]`

**Arquivo:** `src/app/[locale]/players/[id]/page.tsx`

**Descrição:** Exibe informações detalhadas de um jogador específico.

**Funcionalidades:**

- Nome completo do jogador
- Posição e abreviação
- Número da camisa (se disponível)
- Time atual (com link para página do time)
- Informações físicas (altura, peso, idade)
- Experiência (anos na NFL)
- Universidade
- Botão "Voltar" para retornar à lista

**Componentes Utilizados:**

- `PlayerRow` - Visualização resumida do jogador
- `Button` - Botão de navegação
- `Badge` - Badges de posição e número
- `Text` - Componente de texto tipado
- `Link` - Link para página do time

**Use Cases:**

- `getPlayerById(id)` - Busca jogador por ID

**Tratamento de Erros:**

- Redireciona para 404 se o ID for inválido
- Redireciona para 404 se o jogador não for encontrado

### Partidas

#### Lista de Partidas

**Rota:** `/games` ou `/[locale]/games`

**Arquivo:** `src/app/[locale]/games/page.tsx`

**Descrição:** Lista de partidas da NFL com filtros avançados e paginação.

**Funcionalidades:**

- **Filtro por temporada**: Select com últimas 5 temporadas
- **Filtro por semana**: Select com semanas 1-18
- **Filtro por time**: Select com todos os times
- **Filtro por tipo**: Regular Season ou Postseason (Playoffs)
- **Paginação**: Navegação entre páginas (25 partidas por página)
- **Exibição de placares**: Cards com informações da partida
- **Status**: Badge indicando status (Final, In Progress, Scheduled)

**Parâmetros de Busca:**

- `page`: Número da página
- `season`: Temporada (ano, ex: 2024)
- `week`: Semana (1-18)
- `teamId`: ID do time (visitante ou casa)
- `postseason`: Tipo de jogo (`true` para playoffs, `false` para regular)

**Componentes Utilizados:**

- `GameScore` - Card de exibição da partida
- `Button` - Botões de paginação e busca
- `Text` - Componentes de texto
- `Link` - Links para detalhes da partida

**Use Cases:**

- `getGames(params)` - Busca partidas com filtros e paginação
- `getTeams()` - Busca times para o filtro

#### Detalhes da Partida

**Rota:** `/games/[id]` ou `/[locale]/games/[id]`

**Arquivo:** `src/app/[locale]/games/[id]/page.tsx`

**Descrição:** Exibe informações detalhadas de uma partida específica.

**Funcionalidades:**

- Times participantes (visitante e casa)
- Placar final (se o jogo terminou)
- Status do jogo (Final, Em Andamento, Agendado)
- Informações da temporada (ano e semana)
- Data e horário (se agendado)
- Tipo de jogo (Regular Season ou Postseason)
- Time vencedor (se finalizado)
- Links para páginas dos times
- Botão "Voltar" para retornar à lista

**Componentes Utilizados:**

- `GameScore` - Card visual da partida
- `Button` - Botão de navegação
- `Badge` - Badges de status e tipo
- `Text` - Componente de texto tipado
- `Link` - Links para páginas dos times

**Use Cases:**

- `getGameById(id)` - Busca partida por ID

**Tratamento de Erros:**

- Redireciona para 404 se o ID for inválido
- Redireciona para 404 se a partida não for encontrada

**Helpers Utilizados:**

- `isGameFinished()` - Verifica se o jogo terminou
- `isGameInProgress()` - Verifica se está em andamento
- `isGameScheduled()` - Verifica se está agendado
- `getGameWinner()` - Retorna o time vencedor
- `getGameDateDisplay()` - Formata a data do jogo

## Fluxos Principais

### Fluxo 1: Explorar Times

```
Home → /teams → Selecionar Time → /teams/[id] → Ver Detalhes
                                        ↓
                                   Link para Time
```

1. Usuário acessa a lista de times
2. Visualiza times organizados por conferência e divisão
3. Clica em um time para ver detalhes
4. Visualiza informações completas do time
5. Pode navegar de volta para a lista

### Fluxo 2: Buscar Jogador

```
Home → /players → Aplicar Filtros → Ver Resultados → Selecionar Jogador → /players/[id]
                                                                              ↓
                                                                         Link para Time
```

1. Usuário acessa a lista de jogadores
2. Aplica filtros (busca, time, posição)
3. Navega entre páginas de resultados
4. Clica em um jogador para ver detalhes
5. Visualiza informações completas do jogador
6. Pode seguir link para ver detalhes do time do jogador

### Fluxo 3: Explorar Partidas

```
Home → /games → Aplicar Filtros → Ver Resultados → Selecionar Partida → /games/[id]
                                                                           ↓
                                                                      Links para Times
```

1. Usuário acessa a lista de partidas
2. Aplica filtros (temporada, semana, time, tipo)
3. Navega entre páginas de resultados
4. Clica em uma partida para ver detalhes
5. Visualiza informações completas da partida
6. Pode seguir links para ver detalhes dos times participantes

### Fluxo 4: Navegação Cruzada

```
Qualquer Página → Link para Time → /teams/[id] → Ver Jogadores do Time → /players?teamId=X
                                        ↓
                              Ver Partidas do Time → /games?teamId=X
```

1. Usuário encontra referência a um time em qualquer página
2. Clica no link do time
3. Visualiza detalhes do time
4. Pode explorar jogadores do time filtrando por `teamId`
5. Pode explorar partidas do time filtrando por `teamId`

## Navegação e Links

### Links Internos

Todas as páginas utilizam o componente `Link` do `next-intl` para navegação tipada e localizada:

```typescript
import { Link } from '@/i18n/routing'

<Link href="/teams">Times</Link>
<Link href={`/players/${playerId}`}>Jogador</Link>
```

### Botões de Voltar

Todas as páginas de detalhes incluem um botão "Voltar" que retorna à lista correspondente:

- `/teams/[id]` → Botão "Voltar para Times" → `/teams`
- `/players/[id]` → Botão "Voltar para Jogadores" → `/players`
- `/games/[id]` → Botão "Voltar para Partidas" → `/games`

### Preservação de Estado

Os filtros aplicados nas páginas de lista são preservados através de query parameters na URL, permitindo:

- Compartilhamento de links com filtros aplicados
- Navegação do navegador (voltar/avançar) mantém os filtros
- Refresh da página mantém os filtros

### Breadcrumbs

Embora não implementado visualmente, a estrutura de navegação segue um padrão hierárquico:

```
Home → Lista → Detalhes
```

## Tratamento de Erros

### Páginas de Lista

- Se não houver dados: Exibe mensagem "Nenhum [recurso] encontrado"
- Se houver erro na API: Redireciona para 404

### Páginas de Detalhes

- ID inválido: Redireciona para 404
- Recurso não encontrado: Redireciona para 404
- Erro na API: Redireciona para 404

### Mensagens de Erro

Todas as mensagens de erro são localizadas usando `next-intl`:

```typescript
const t = await getTranslations('teams')
t('notFound') // "Time não encontrado" ou "Team not found"
```

## Metadata e SEO

Cada página implementa `generateMetadata()` para fornecer metadados otimizados:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('teams')
  return {
    title: `GridironHub - ${t('title')}`,
    description: t('description'),
  }
}
```

### Páginas de Detalhes

Incluem informações específicas do recurso:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const team = await getTeamById(id)
  return {
    title: `GridironHub - ${team.fullName}`,
    description: `${team.fullName} - ${team.conference} ${team.division}`,
  }
}
```

## Performance

### SSG (Static Site Generation)

- **Página de Times**: Pré-renderizada estaticamente no build time
  - `generateStaticParams()` gera todas as 32 páginas de times durante o build
  - Revalidação via ISR a cada 1 hora (`revalidate: 3600`)
  
- **Páginas de Lista**: Usam ISR para atualização periódica
  - Times: `revalidate: 3600` (1 hora)
  - Jogadores: `revalidate: 1800` (30 minutos)
  - Partidas: `revalidate: 900` (15 minutos)

### ISR (Incremental Static Regeneration)

- **Páginas de Detalhes de Jogadores**: ISR on-demand
  - `revalidate: 1800` (30 minutos)
  - Páginas são geradas sob demanda conforme necessário
  
- **Páginas de Detalhes de Partidas**: ISR on-demand
  - `revalidate: 900` (15 minutos)
  - Revalidação mais frequente para dados que mudam rapidamente

### Estratégias de Cache

1. **Times (32 páginas)**: Pré-renderizadas no build - SSG completo
2. **Jogadores e Partidas**: ISR on-demand para evitar sobrecarga no build
3. **Revalidação baseada em frequência de mudança**:
   - Times: 1 hora (mudam raramente)
   - Jogadores: 30 minutos (trades, lesões)
   - Partidas: 15 minutos (placares, status)

### Paginação

- Limite de 25 itens por página para otimizar performance
- Uso de cursor-based pagination via API

### Benefícios

- **Performance**: Páginas estáticas são servidas instantaneamente
- **SEO**: Melhor indexação com conteúdo pré-renderizado
- **Redução de carga**: Menos requisições à API durante execução
- **Atualização automática**: ISR mantém dados atualizados sem rebuild completo

## Internacionalização

Todas as páginas suportam Português (pt) e Inglês (en):

- Textos de interface traduzidos via `next-intl`
- URLs incluem locale quando necessário
- Metadata traduzida para SEO em ambos os idiomas

Para mais detalhes, consulte [NAVIGATION.md](./NAVIGATION.md).
