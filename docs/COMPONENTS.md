# Sistema de Design - Atomic Design

Este documento descreve o sistema de design baseado em **Atomic Design** utilizado no GridironHub.

## Índice

- [Visão Geral](#visão-geral)
- [Hierarquia de Componentes](#hierarquia-de-componentes)
- [Átomos](#átomos)
- [Moléculas](#moléculas)
- [Organismos](#organismos)
- [Templates](#templates)
- [Guia de Uso](#guia-de-uso)
- [Convenções](#convenções)

## Visão Geral

O projeto utiliza a metodologia **Atomic Design** proposta por Brad Frost, que organiza os componentes em uma hierarquia baseada na complexidade:

```
Átomos → Moléculas → Organismos → Templates → Páginas
```

### Benefícios

- **Reutilização**: Componentes atômicos são reutilizáveis em diferentes contextos
- **Consistência**: Garante padrão visual e comportamental
- **Manutenibilidade**: Facilita atualizações e manutenção
- **Testabilidade**: Cada nível pode ser testado isoladamente
- **Escalabilidade**: Fácil adicionar novos componentes seguindo o padrão

## Hierarquia de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                     PÁGINAS                              │
│  (Home, Times, Jogadores)                               │
└────────────────────┬────────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────────┐
│                   TEMPLATES                             │
│  (PageLayout, ListLayout)                               │
└────────────────────┬────────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────────┐
│                  ORGANISMOS                             │
│  (TeamGrid, PlayerTable)                                │
└────────────────────┬────────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────────┐
│                   MOLÉCULAS                             │
│  (TeamCard, PlayerRow)                                  │
└────────────────────┬────────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────────┐
│                     ÁTOMOS                              │
│  (Button, Text, Badge, Icon, Skeleton)                  │
└─────────────────────────────────────────────────────────┘
```

## Átomos

Componentes básicos, indivisíveis e reutilizáveis. Não devem conter lógica de negócio complexa.

### Localização

```
src/presentation/components/atoms/
```

### Componentes Disponíveis

#### Button

Botão reutilizável com múltiplas variantes e estados.

**Props:**

```typescript
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
}
```

**Exemplo:**

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Clique aqui
</Button>

<Button variant="outline" isLoading>
  Carregando...
</Button>
```

**Variantes:**

- `primary`: Botão principal (azul)
- `secondary`: Botão secundário (cinza)
- `outline`: Botão com borda
- `ghost`: Botão transparente

**Tamanhos:**

- `sm`: Pequeno (padding reduzido)
- `md`: Médio (padrão)
- `lg`: Grande (padding aumentado)

---

#### Text

Componente de texto com tipografia configurável.

**Props:**

```typescript
interface TextProps {
  children: ReactNode
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'secondary'
}
```

**Exemplo:**

```tsx
<Text as="h1" size="2xl" weight="bold">
  Título Principal
</Text>

<Text size="sm" color="muted">
  Texto secundário
</Text>
```

---

#### Badge

Badge para exibir informações categorizadas.

**Props:**

```typescript
interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}
```

**Exemplo:**

```tsx
<Badge variant="info">NFC</Badge>
<Badge variant="success">Ativo</Badge>
<Badge variant="error">Lesionado</Badge>
```

**Variantes:**

- `default`: Cinza (padrão)
- `success`: Verde
- `warning`: Amarelo
- `error`: Vermelho
- `info`: Azul

---

#### Skeleton

Placeholder de loading para melhorar a experiência do usuário.

**Props:**

```typescript
interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}
```

**Exemplo:**

```tsx
<Skeleton width="200px" height="20px" />
<Skeleton width="100%" height="100px" rounded="lg" />
```

---

## Moléculas

Composição de átomos formando componentes com responsabilidade limitada.

### Localização

```
src/presentation/components/molecules/
```

### Componentes Disponíveis

#### TeamCard

Card de exibição de um time da NFL.

**Props:**

```typescript
interface TeamCardProps {
  team: Team
  href?: string
}
```

**Exemplo:**

```tsx
<TeamCard team={team} href={`/times/${team.id}`} />
```

**Estrutura:**

- Nome completo do time
- Badge com abreviação
- Conferência e divisão
- Localização

---

#### PlayerRow

Linha de exibição de um jogador.

**Props:**

```typescript
interface PlayerRowProps {
  player: Player
  href?: string
}
```

**Exemplo:**

```tsx
<PlayerRow player={player} href={`/jogadores/${player.id}`} />
```

**Estrutura:**

- Nome completo
- Badge de posição
- Time atual
- Número da camisa, altura e peso

---

## Organismos

Blocos funcionais maiores, combinando moléculas e átomos.

### Localização

```
src/presentation/components/organisms/
```

### Componentes Planejados

#### TeamGrid

Grade de cards de times.

**Planejado para:**

- Exibir lista de times em grid responsivo
- Filtros por conferência/divisão
- Paginação

---

#### PlayerTable

Tabela de jogadores.

**Planejado para:**

- Listagem paginada de jogadores
- Ordenação por colunas
- Filtros por posição/time

---

## Templates

Estrutura das páginas sem dados específicos.

### Localização

```
src/presentation/components/templates/
```

### Componentes Planejados

#### PageLayout

Layout padrão das páginas.

**Planejado para:**

- Header com navegação
- Container principal
- Footer
- Metadados SEO

---

#### ListLayout

Layout para páginas de listagem.

**Planejado para:**

- Container de listagem
- Filtros laterais
- Paginação
- Breadcrumbs

---

## Guia de Uso

### Criando um Novo Átomo

1. Crie o arquivo em `src/presentation/components/atoms/`
2. Defina as props TypeScript
3. Implemente o componente com Tailwind CSS
4. Exporte no `index.ts`
5. Crie testes em `__tests__/unit/presentation/atoms/`

**Exemplo:**

```tsx
// src/presentation/components/atoms/CustomAtom.tsx
export interface CustomAtomProps {
  // props aqui
}

export function CustomAtom({ ... }: CustomAtomProps) {
  return (
    <div className="...">
      {/* conteúdo */}
    </div>
  )
}
```

### Criando uma Nova Molécula

1. Crie o arquivo em `src/presentation/components/molecules/`
2. Use átomos existentes
3. Defina props com entidades do domínio
4. Exporte no `index.ts`
5. Crie testes em `__tests__/unit/presentation/molecules/`

**Exemplo:**

```tsx
// src/presentation/components/molecules/CustomMolecule.tsx
import { Button, Text } from '@/presentation/components/atoms'
import type { Team } from '@/domain/entities'

export interface CustomMoleculeProps {
  team: Team
}

export function CustomMolecule({ team }: CustomMoleculeProps) {
  return (
    <div>
      <Text>{team.fullName}</Text>
      <Button>Clique</Button>
    </div>
  )
}
```

### Regras de Ouro

1. **Átomos não conhecem moléculas**: Átomos são independentes
2. **Moléculas não conhecem organismos**: Moléculas apenas usam átomos
3. **Reutilização**: Sempre prefira reutilizar antes de criar novo
4. **Composição**: Combine componentes simples em complexos
5. **Prop drilling**: Evite passar muitas props, use Context se necessário

---

## Convenções

### Nomenclatura

- **Componentes**: PascalCase (`Button.tsx`, `TeamCard.tsx`)
- **Props**: camelCase (`fullName`, `isLoading`)
- **Variantes**: lowercase (`'primary'`, `'secondary'`)

### Estrutura de Arquivo

```tsx
/**
 * Descrição do componente
 */

import ... from '@/...'

export interface ComponentProps {
  // props aqui
}

export function Component({ ... }: ComponentProps) {
  return (
    // JSX aqui
  )
}
```

### Estilização

- Use **Tailwind CSS** para estilos
- Evite estilos inline complexos
- Mantenha classes organizadas
- Use variantes para diferentes estados

### Testes

- Um arquivo de teste para cada componente
- Teste props, variantes e comportamentos
- Use `@testing-library/react`
- Cobertura mínima: 80%

---

## Roadmap

### Fase 1 (Atual)

- ✅ Átomos básicos (Button, Text, Badge, Skeleton)
- ✅ Moléculas básicas (TeamCard, PlayerRow)

### Fase 2 (Próxima)

- ⏳ Organismos (TeamGrid, PlayerTable)
- ⏳ Templates (PageLayout, ListLayout)

### Fase 3 (Futuro)

- ⏳ Ícones customizados
- ⏳ Modal/Dialog
- ⏳ Formulários
- ⏳ Dropdown/Select

---

Para mais informações sobre a arquitetura, consulte [ARCHITECTURE.md](./ARCHITECTURE.md).
