/**
 * Página Home - GridironHub
 */

import Link from 'next/link'
import { Button } from '@/presentation/components/atoms'
import { Text } from '@/presentation/components/atoms'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Text as="h1" size="3xl" weight="bold" className="mb-4 text-4xl">
            GridironHub 🏈
          </Text>
          <Text as="p" size="xl" color="muted" className="max-w-2xl mx-auto">
            Explore times, jogadores e partidas da NFL. Dados atualizados da temporada em tempo
            real.
          </Text>
        </div>

        {/* Cards de Navegação */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {/* Times */}
          <Link href="/times" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 h-full border-2 border-transparent hover:border-blue-500">
              <div className="text-center">
                <div className="text-5xl mb-4">🏟️</div>
                <Text as="h2" size="lg" weight="semibold" className="mb-2 text-xl">
                  Times
                </Text>
                <Text size="sm" color="muted" className="mb-6">
                  Explore os 32 times da NFL. Informações sobre conferências, divisões e
                  localizações.
                </Text>
                <Button variant="outline" size="sm">
                  Ver Times →
                </Button>
              </div>
            </div>
          </Link>

          {/* Jogadores */}
          <Link href="/jogadores" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 h-full border-2 border-transparent hover:border-blue-500">
              <div className="text-center">
                <div className="text-5xl mb-4">👤</div>
                <Text as="h2" size="lg" weight="semibold" className="mb-2 text-xl">
                  Jogadores
                </Text>
                <Text size="sm" color="muted" className="mb-6">
                  Busque e explore jogadores da NFL. Estatísticas, posições e times atuais.
                </Text>
                <Button variant="outline" size="sm">
                  Ver Jogadores →
                </Button>
              </div>
            </div>
          </Link>

          {/* Partidas */}
          <Link href="/partidas" className="group">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 h-full border-2 border-transparent hover:border-blue-500">
              <div className="text-center">
                <div className="text-5xl mb-4">⚽</div>
                <Text as="h2" size="lg" weight="semibold" className="mb-2 text-xl">
                  Partidas
                </Text>
                <Text size="sm" color="muted" className="mb-6">
                  Acompanhe partidas da temporada. Placares, resultados e calendário de jogos.
                </Text>
                <Button variant="outline" size="sm">
                  Ver Partidas →
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* Seção de Informações */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <Text as="h2" size="2xl" weight="semibold" className="mb-4 text-center">
            Sobre o GridironHub
          </Text>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Text size="base" color="muted" className="mb-4">
                O GridironHub é uma plataforma dedicada a fornecer informações atualizadas sobre a
                NFL. Explore dados de times, jogadores e partidas de forma simples e intuitiva.
              </Text>
            </div>
            <div>
              <Text size="base" color="muted" className="mb-4">
                Todos os dados são obtidos da{' '}
                <a
                  href="https://nfl.balldontlie.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  balldontlie API
                </a>
                , garantindo informações confiáveis e atualizadas.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
