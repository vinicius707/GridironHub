'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { HamburgerMenu } from '@/presentation/components/molecules'
import { LanguageToggle } from '@/presentation/components/molecules'
import type { ComponentProps } from 'react'

export interface NavbarProps extends Omit<ComponentProps<'nav'>, 'children'> {
  className?: string
}

export function Navbar({ className = '', ...props }: NavbarProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  // Links de navegação com tradução baseada no locale
  const navLinks = [
    { href: '/', label: t('home') },
    { href: locale === 'pt' ? '/times' : '/teams', label: t('teams') },
    { href: locale === 'pt' ? '/jogadores' : '/players', label: t('players') },
    { href: locale === 'pt' ? '/partidas' : '/games', label: t('games') },
  ]

  const isActive = (href: string) => {
    // Verifica se a rota atual corresponde ao href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      role="navigation"
      aria-label={t('navigation')}
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 ${className}`}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label={t('home')}
            >
              <span aria-hidden="true">🏈</span>
              <span>GridironHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Language Toggle */}
          <div className="hidden md:flex md:items-center md:ml-4">
            <LanguageToggle variant="button" />
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle variant="button" />
            <HamburgerMenu links={navLinks} />
          </div>
        </div>
      </div>
    </nav>
  )
}
