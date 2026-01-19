/**
 * Página Home - GridironHub
 */

'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Text } from '@/presentation/components/atoms'

export default function Home() {
  const t = useTranslations('nav')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 sm:py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <Text as="h1" size="3xl" weight="bold" className="mb-4 text-3xl sm:text-4xl">
            GridironHub <span aria-hidden="true">🏈</span>
          </Text>
          <Text as="p" size="xl" color="muted" className="max-w-2xl mx-auto text-lg sm:text-xl">
            Explore times, jogadores e partidas da NFL. Dados atualizados da temporada em tempo
            real.
          </Text>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {/* Cards de Navegação */}
        <section aria-labelledby="navigation-cards-title">
          <h2 id="navigation-cards-title" className="sr-only">
            Navegação Principal
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
            {/* Times */}
            <article>
              <Link
                href="/teams"
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl focus:shadow-xl transition-shadow p-6 sm:p-8 h-full border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Navegar para página de ${t('teams')}`}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">
                    🏟️
                  </div>
                  <Text as="h3" size="lg" weight="semibold" className="mb-2 text-xl">
                    Times
                  </Text>
                  <Text size="sm" color="muted" className="mb-6 text-sm sm:text-base">
                    Explore os 32 times da NFL. Informações sobre conferências, divisões e
                    localizações.
                  </Text>
                  <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Ver Times <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>

            {/* Jogadores */}
            <article>
              <Link
                href="/players"
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl focus:shadow-xl transition-shadow p-6 sm:p-8 h-full border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Navegar para página de ${t('players')}`}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">
                    👤
                  </div>
                  <Text as="h3" size="lg" weight="semibold" className="mb-2 text-xl">
                    Jogadores
                  </Text>
                  <Text size="sm" color="muted" className="mb-6 text-sm sm:text-base">
                    Busque e explore jogadores da NFL. Estatísticas, posições e times atuais.
                  </Text>
                  <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Ver Jogadores <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>

            {/* Partidas */}
            <article>
              <Link
                href="/games"
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl focus:shadow-xl transition-shadow p-6 sm:p-8 h-full border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Navegar para página de ${t('games')}`}
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">
                    ⚽
                  </div>
                  <Text as="h3" size="lg" weight="semibold" className="mb-2 text-xl">
                    Partidas
                  </Text>
                  <Text size="sm" color="muted" className="mb-6 text-sm sm:text-base">
                    Acompanhe partidas da temporada. Placares, resultados e calendário de jogos.
                  </Text>
                  <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Ver Partidas <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          </div>
        </section>

        {/* Seção de Informações */}
        <section
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 max-w-4xl mx-auto"
          aria-labelledby="about-title"
        >
          <Text
            as="h2"
            id="about-title"
            size="2xl"
            weight="semibold"
            className="mb-4 sm:mb-6 text-center text-2xl sm:text-3xl"
          >
            Sobre o GridironHub
          </Text>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Text size="base" color="muted" className="mb-4 text-sm sm:text-base">
                O GridironHub é uma plataforma dedicada a fornecer informações atualizadas sobre a
                NFL. Explore dados de times, jogadores e partidas de forma simples e intuitiva.
              </Text>
            </div>
            <div>
              <Text size="base" color="muted" className="mb-4 text-sm sm:text-base">
                Todos os dados são obtidos da{' '}
                <a
                  href="https://nfl.balldontlie.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Abrir balldontlie API em nova aba"
                >
                  balldontlie API
                </a>
                , garantindo informações confiáveis e atualizadas.
              </Text>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
