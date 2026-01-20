/**
 * Testes de integração para a página de detalhes da partida
 */

import { render, screen, waitFor } from '@testing-library/react'
import GameDetailPage from '@/app/[locale]/games/[id]/page'
import { getGameById } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Game } from '@/domain/entities'

// Mock do next/navigation antes de qualquer importação que o use
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getGameById: jest.fn(),
}))

// Mock do next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

// Mock do next-intl routing
jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock dos componentes
jest.mock('@/presentation/components/molecules', () => ({
  GameScore: ({ game }: { game: Game }) => (
    <div data-testid={`game-score-${game.id}`}>
      {game.visitorTeam.fullName} vs {game.homeTeam.fullName}
    </div>
  ),
}))

jest.mock('@/presentation/components/atoms', () => ({
  Text: ({
    as,
    children,
    ...props
  }: {
    as?: keyof JSX.IntrinsicElements
    children: React.ReactNode
  }) => {
    const Component = as || 'span'
    return <Component {...props}>{children}</Component>
  },
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
  Badge: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
}))

describe('GameDetailPage - Integração', () => {
  const mockGame: Game = {
    id: 1,
    visitorTeam: {
      id: 1,
      conference: 'AFC',
      division: 'EAST',
      location: 'Buffalo',
      name: 'Bills',
      fullName: 'Buffalo Bills',
      abbreviation: 'BUF',
    },
    homeTeam: {
      id: 18,
      conference: 'NFC',
      division: 'EAST',
      location: 'Philadelphia',
      name: 'Eagles',
      fullName: 'Philadelphia Eagles',
      abbreviation: 'PHI',
    },
    homeTeamScore: 31,
    visitorTeamScore: 21,
    season: 2024,
    postseason: false,
    status: 'Final',
    week: 1,
    time: '8:20 PM ET',
    date: '2024-09-05',
  }

  const mockTranslations = {
    backToGames: 'Voltar para Partidas',
    visitorTeam: 'Time Visitante',
    homeTeam: 'Time da Casa',
    visitorScore: 'Placar Visitante',
    homeScore: 'Placar da Casa',
    winner: 'Vencedor',
    status: 'Status',
    season: 'Temporada',
    week: 'Semana',
    date: 'Data',
    type: 'Tipo',
    regularSeason: 'Temporada Regular',
    postseason: 'Pós-Temporada',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
  })

  it('deve renderizar os detalhes da partida', async () => {
    ;(getGameById as jest.Mock).mockResolvedValue(mockGame)

    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const page = await GameDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Buffalo Bills vs Philadelphia Eagles')).toBeInTheDocument()
      expect(screen.getByText('Final')).toBeInTheDocument()
    })

    expect(screen.getByText('Time Visitante')).toBeInTheDocument()
    expect(screen.getByText('Time da Casa')).toBeInTheDocument()
    expect(screen.getByText('Temporada')).toBeInTheDocument()
    expect(screen.getByText('Semana')).toBeInTheDocument()
  })

  it('deve exibir botão voltar', async () => {
    ;(getGameById as jest.Mock).mockResolvedValue(mockGame)

    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const page = await GameDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Voltar para Partidas')).toBeInTheDocument()
    })
  })

  it('deve exibir placar quando o jogo está finalizado', async () => {
    ;(getGameById as jest.Mock).mockResolvedValue(mockGame)

    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const page = await GameDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Placar Visitante')).toBeInTheDocument()
      expect(screen.getByText('Placar da Casa')).toBeInTheDocument()
      expect(screen.getByText('21')).toBeInTheDocument()
      expect(screen.getByText('31')).toBeInTheDocument()
    })
  })
})
