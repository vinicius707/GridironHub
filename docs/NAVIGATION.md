# Sistema de Navegação e Internacionalização (i18n)

Este documento descreve o sistema de navegação responsivo e internacionalização implementado no GridironHub.

## Visão Geral

O GridironHub utiliza `next-intl` para suportar múltiplos idiomas (Português e Inglês) e implementa uma navegação responsiva com navbar para desktop e menu hamburger para mobile.

## Internacionalização (i18n)

### Configuração

O sistema de i18n está configurado usando `next-intl` para Next.js 16 App Router.

**Arquivos principais:**

- `src/i18n/routing.ts` - Configuração de rotas e navegação tipada
- `src/i18n/request.ts` - Helper para obter locale no servidor
- `src/proxy.ts` - Proxy para detectar e redirecionar por idioma (Next.js 16+)
- `messages/pt.json` - Traduções em português
- `messages/en.json` - Traduções em inglês

### Idiomas Suportados

- **Português (pt-BR)** - Idioma padrão
- **Inglês (en-US)**

### Detecção de Idioma

O proxy detecta o idioma em ordem de prioridade:

1. Cookie `NEXT_LOCALE` (preferência salva do usuário)
2. Header `Accept-Language` do navegador
3. Locale padrão (`pt`)

### Estrutura de Rotas

As rotas seguem o padrão `/[locale]/*`:

- `/` ou `/pt` → Home (Português)
- `/en` → Home (English)
- `/teams` ou `/en/teams` → Times/Teams
- `/players` ou `/en/players` → Jogadores/Players

**Nota:** Com `localePrefix: 'as-needed'`, o locale padrão (`pt`) não aparece na URL.

### Adicionando Novos Idiomas

1. Adicione o locale em `src/i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['pt', 'en', 'es'], // Adicione 'es' para espanhol
  defaultLocale: 'pt',
  localePrefix: 'as-needed',
})
```

2. Crie o arquivo de traduções: `messages/es.json`

3. Adicione as chaves de tradução correspondentes

### Usando Traduções nos Componentes

```tsx
'use client'

import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('nav')

  return <h1>{t('home')}</h1> // "Início" ou "Home" dependendo do locale
}
```

### Usando Navegação com i18n

```tsx
'use client'

import { Link, usePathname } from '@/i18n/routing'

export function Navigation() {
  const pathname = usePathname()

  return <Link href="/teams">{pathname}</Link>
}
```

## Sistema de Navegação

### Estrutura de Componentes

O sistema de navegação segue Atomic Design:

```
presentation/components/
├── molecules/
│   ├── LanguageToggle.tsx   # Botão/select de troca de idioma
│   └── HamburgerMenu.tsx    # Menu mobile hamburger
├── organisms/
│   └── Navbar.tsx           # Navbar principal (desktop + mobile)
└── templates/
    └── PageLayout.tsx       # Layout que inclui Navbar
```

### Navbar (Organism)

Componente principal de navegação com renderização condicional:

- **Desktop (≥ 768px):** Navbar horizontal com links e LanguageToggle
- **Mobile (< 768px):** Botão hamburger + LanguageToggle compacto

**Uso:**

```tsx
import { Navbar } from '@/presentation/components/organisms'

export function MyPage() {
  return (
    <>
      <Navbar />
      {/* Conteúdo da página */}
    </>
  )
}
```

### HamburgerMenu (Molecule)

Menu mobile que desliza da esquerda com:

- Botão hamburger animado (3 linhas → X)
- Overlay escuro ao fundo
- Links de navegação
- LanguageToggle no footer
- Fecha ao clicar fora, pressionar ESC ou navegar

**Props:**

```typescript
interface HamburgerMenuProps {
  links: Array<{ href: string; label: string }>
}
```

**Uso:**

```tsx
import { HamburgerMenu } from '@/presentation/components/molecules'

const links = [
  { href: '/', label: 'Início' },
  { href: '/teams', label: 'Times' },
]

<HamburgerMenu links={links} />
```

### LanguageToggle (Molecule)

Componente para trocar de idioma:

- **Variante `button`:** Botão compacto com ícone de globo
- **Variante `select`:** Dropdown select

**Uso:**

```tsx
import { LanguageToggle } from '@/presentation/components/molecules'

// Botão (padrão)
<LanguageToggle />

// Select dropdown
<LanguageToggle variant="select" />
```

**Funcionalidades:**

- Alterna entre `pt` ↔ `en`
- Preserva a página atual ao trocar idioma
- Atualiza URL automaticamente
- Salva preferência em cookie

### PageLayout (Template)

Template que inclui a Navbar em todas as páginas:

**Uso:**

```tsx
import { PageLayout } from '@/presentation/components/templates'

export default function MyPage() {
  return (
    <PageLayout>
      <div>Conteúdo da página</div>
    </PageLayout>
  )
}
```

**Inclui:**

- Skip link para acessibilidade
- Navbar fixa no topo
- Main content com `id="main-content"`

## Acessibilidade

### Padrões WCAG 2.1 AA Implementados

- **Role navigation:** `role="navigation"` na navbar
- **ARIA labels:** `aria-label` descritivo em todos os elementos
- **ARIA expanded:** `aria-expanded` no menu hamburger
- **ARIA controls:** `aria-controls` vinculando botão ao menu
- **ARIA current:** `aria-current="page"` para link ativo
- **Skip links:** Link para pular para conteúdo principal
- **Navegação por teclado:** Tab, Enter, ESC funcionam corretamente
- **Foco visível:** Todos os elementos interativos têm foco visível

### Navegação por Teclado

- **Tab:** Move entre elementos interativos
- **Enter/Space:** Ativa botões e links
- **ESC:** Fecha menu hamburger
- **Skip Link:** Permite pular para conteúdo principal

## Responsividade

### Breakpoints

- **Mobile:** < 768px - Menu hamburger
- **Desktop:** ≥ 768px - Navbar horizontal

### Comportamento

**Desktop:**

- Navbar fixa no topo (`sticky top-0`)
- Links horizontais com espaçamento adequado
- LanguageToggle visível no canto direito

**Mobile:**

- Botão hamburger no canto superior direito
- Menu desliza da esquerda ao abrir
- Overlay escuro bloqueia interação com conteúdo
- Scroll do body bloqueado quando menu aberto
- LanguageToggle integrado no footer do menu

## Adicionando Novos Links na Navbar

1. Edite `src/presentation/components/organisms/Navbar.tsx`:

```tsx
const navLinks = [
  { href: '/', label: t('home') },
  { href: '/teams', label: t('teams') },
  { href: '/players', label: t('players') },
  { href: '/stats', label: t('stats') }, // Novo link
]
```

2. Adicione traduções em `messages/pt.json` e `messages/en.json`:

```json
{
  "nav": {
    "stats": "Estatísticas"
  }
}
```

```json
{
  "nav": {
    "stats": "Statistics"
  }
}
```

## Testes

Os componentes de navegação têm testes unitários em:

- `__tests__/unit/presentation/molecules/LanguageToggle.test.tsx`
- `__tests__/unit/presentation/molecules/HamburgerMenu.test.tsx`
- `__tests__/unit/presentation/organisms/Navbar.test.tsx`
- `__tests__/unit/presentation/templates/PageLayout.test.tsx`

### Executando Testes

```bash
npm test __tests__/unit/presentation/molecules/LanguageToggle.test.tsx
npm test __tests__/unit/presentation/molecules/HamburgerMenu.test.tsx
npm test __tests__/unit/presentation/organisms/Navbar.test.tsx
npm test __tests__/unit/presentation/templates/PageLayout.test.tsx
```

## Estrutura de Arquivos de Tradução

```json
{
  "nav": {
    "home": "Início",
    "teams": "Times",
    "players": "Jogadores",
    "navigation": "Navegação principal"
  },
  "language": {
    "pt": "Português",
    "en": "English",
    "change": "Trocar idioma",
    "current": "Idioma atual",
    "select": "Selecione um idioma"
  },
  "menu": {
    "open": "Abrir menu",
    "close": "Fechar menu",
    "mobile": "Menu mobile"
  },
  "common": {
    "loading": "Carregando...",
    "error": "Erro",
    "notFound": "Não encontrado"
  }
}
```

## Proxy

O proxy (`src/proxy.ts`) é responsável por:

- Detectar o idioma preferido do usuário
- Redirecionar para a rota correta com locale
- Persistir preferência em cookie

**Configuração:**

```typescript
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

## Integração com Layout

O layout principal (`src/app/[locale]/layout.tsx`) integra:

- `NextIntlClientProvider` - Fornece traduções aos componentes
- `PageLayout` - Inclui Navbar e estrutura básica
- `setRequestLocale` - Habilita renderização estática (SSG)
- `getMessages()` - Carrega traduções do servidor

## Exemplos de Uso

### Criando uma Nova Página com i18n

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { PageLayout } from '@/presentation/components/templates'

export default function MyPage() {
  const t = useTranslations('nav')

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1>{t('home')}</h1>
        <Link href="/teams">{t('teams')}</Link>
      </div>
    </PageLayout>
  )
}
```

### Usando LanguageToggle Customizado

```tsx
import { LanguageToggle } from '@/presentation/components/molecules'

export function CustomHeader() {
  return (
    <header>
      <LanguageToggle variant="select" />
    </header>
  )
}
```

## Troubleshooting

### Idioma não está sendo detectado

Verifique se o proxy está configurado corretamente e se as traduções estão nos arquivos JSON corretos.

### Links não funcionam

Certifique-se de usar `Link` de `@/i18n/routing` em vez de `next/link`.

### Traduções não aparecem

Verifique se o componente está marcado com `'use client'` e se está usando `useTranslations` corretamente.

## Recursos

- [Documentação next-intl](https://next-intl-docs.vercel.app/)
- [Next.js Internacionalização](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
