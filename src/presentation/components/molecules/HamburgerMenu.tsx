'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { LanguageToggle } from './LanguageToggle'
import type { ComponentProps } from 'react'

export interface HamburgerMenuProps extends Omit<ComponentProps<'nav'>, 'children'> {
  links: Array<{ href: string; label: string }>
}

export function HamburgerMenu({ links, className = '', ...props }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const t = useTranslations('menu')
  const pathname = usePathname()

  // Remove props que não são válidos para button (ref e onClick vêm do nav, não do button)
  const { onClick: _, ref: __, ...buttonProps } = props as ComponentProps<'button'>

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Previne scroll do body quando o menu está aberto
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fecha o menu ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Fecha o menu ao navegar
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Botão Hamburger */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? t('close') : t('open')}
        className={`md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
        {...buttonProps}
      >
        <span className="sr-only">{isOpen ? t('close') : t('open')}</span>
        <span
          className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'
          }`}
          aria-hidden="true"
        />
        <span
          className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
          aria-hidden="true"
        />
        <span
          className={`block w-6 h-0.5 bg-gray-900 dark:bg-gray-100 transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'mt-1.5'
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Overlay e Menu */}
      {isOpen && (
        <>
          {/* Overlay escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu lateral */}
          <nav
            ref={menuRef}
            id="mobile-menu"
            role="navigation"
            aria-label={t('mobile')}
            className={`fixed top-0 left-0 h-full w-64 max-w-[80vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header do menu com botão fechar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('mobile')}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label={t('close')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="sr-only">{t('close')}</span>
                </button>
              </div>

              {/* Links de navegação */}
              <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-4">
                  {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Footer com LanguageToggle */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-end">
                  <LanguageToggle variant="button" />
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
