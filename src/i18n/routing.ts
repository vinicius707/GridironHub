import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // Lista de locales suportados
  locales: ['pt', 'en'],

  // Locale padrão
  defaultLocale: 'pt',

  // Locale prefix strategy
  localePrefix: 'as-needed', // Não mostra prefixo para o locale padrão na URL
})

// Helper para navegação tipada
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
