/**
 * Testes E2E - Fluxo de Explorar Partidas
 * 
 * Testa o fluxo completo:
 * 1. Acessar lista de partidas
 * 2. Aplicar filtros
 * 3. Ver detalhes da partida
 * 4. Navegar para times participantes
 */

import { render, screen, waitFor } from '@testing-library/react'
import { getGames, getGameById, getTeams } from '@/application/use-cases'
import GamesPage from '@/app/[locale]/games/page'
import GameDetailPage from '@/app/[locale]/games/[id]/page'
import type { Game, Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getGames: jest.fn(),
  getGameById: jest.fn(),
  getTeams: jest.fn(),
}))

// Mock do next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => Promise.resolve((key: string) => key)),
  getMessages: jest.fn(() => Promise.resolve({})),
  setRequestLocale: jest.fn(),
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

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

describe('E2E - Fluxo de Explorar Partidas', () => {
  const mockTeam1: Team = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    fullName: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockTeam2: Team = {
    id: 1,
    conference: 'AFC',
    division: 'EAST',
    location: 'Buffalo',
    name: 'Bills',
    fullName: 'Buffalo Bills',
    abbreviation: 'BUF',
  }

  const mockGame: Game = {
    id: 1,
    visitorTeam: mockTeam2,
    homeTeam: mockTeam1,
    homeTeamScore: 31,
    visitorTeamScore: 21,
    season: 2024,
    postseason: false,
    status: 'Final',
    week: 1,
    time: '8:20 PM ET',
    date: '2024-09-05',
  }

  const mockGamesResponse = {
    data: [mockGame],
    meta: {
      totalCount: 1,
      perPage: 25,
      currentPage: 1,
      totalPages: 1,
      nextCursor: null,
      previousCursor: null,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getGames as jest.Mock).mockResolvedValue(mockGamesResponse)
    ;(getGameById as jest.Mock).mockResolvedValue(mockGame)
    ;(getTeams as jest.Mock).mockResolvedValue([mockTeam1, mockTeam2])
  })

  it('deve completar o fluxo de explorar partidas', async () => {
    // 1. Acessar lista de partidas
    const searchParams = Promise.resolve({})
    const gamesPage = await GamesPage({ searchParams })
    render(gamesPage)

    await waitFor(() => {
      expect(screen.getByTestId('game-score-1')).toBeInTheDocument()
    })

    // 2. Verificar filtros disponíveis
    await waitFor(() => {
      expect(screen.getByText('filterBySeason')).toBeInTheDocument()
      expect(screen.getByText('filterByWeek')).toBeInTheDocument()
      expect(screen.getByText('filterByTeam')).toBeInTheDocument()
    })

    // 3. Acessar detalhes da partida
    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const detailPage = await GameDetailPage({ params })
    render(detailPage)

    await waitFor(() => {
      expect(screen.getByText('Buffalo Bills vs Philadelphia Eagles')).toBeInTheDocument()
      expect(screen.getByText('Final')).toBeInTheDocument()
    })

    // 4. Verificar informações da partida
    expect(getGameById).toHaveBeenCalledWith(1)
    expect(screen.getByText('visitorTeam')).toBeInTheDocument()
    expect(screen.getByText('homeTeam')).toBeInTheDocument()
  })

  it('deve aplicar filtros na busca de partidas', async () => {
    // Buscar com filtro de temporada e semana
    const searchParams = Promise.resolve({ season: '2024', week: '1' })
    const gamesPage = await GamesPage({ searchParams })
    render(gamesPage)

    await waitFor(() => {
      expect(getGames).toHaveBeenCalledWith(
        expect.objectContaining({
          seasons: [2024],
          weeks: [1],
        })
      )
    })
  })
})
