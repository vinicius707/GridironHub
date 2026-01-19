import type { ReactNode } from 'react'
import { Navbar } from '@/presentation/components/organisms'

export interface PageLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * Template PageLayout
 * Wrapper principal que inclui a Navbar e estrutura básica da página
 */
export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Skip Link para acessibilidade */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white dark:focus:bg-gray-800 focus:text-blue-600 dark:focus:text-blue-400 focus:p-3 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Pular para o conteúdo principal
      </a>

      {/* Navbar */}
      <Navbar />

      {/* Conteúdo principal */}
      <main id="main-content" className={`flex-1 ${className}`}>
        {children}
      </main>
    </div>
  )
}
