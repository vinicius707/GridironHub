/**
 * Testes de integração para a página de lista de partidas
 */

import { render, screen, waitFor } from '@testing-library/react'
import GamesPage from '@/app/[locale]/games/page'
import { getGames, getTeams } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Game, Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getGames: jest.fn(),
  getTeams: jest.fn(),
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
}))

describe('GamesPage - Integração', () => {
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

  const mockGames: Game[] = [
    {
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
    },
  ]

  const mockGamesResponse = {
    data: mockGames,
    meta: {
      totalCount: 1,
      perPage: 25,
      currentPage: 1,
      totalPages: 1,
      nextCursor: null,
      previousCursor: null,
    },
  }

  const mockTeams: Team[] = [mockTeam1, mockTeam2]

  const mockTranslations = {
    title: 'Partidas da NFL',
    description: 'Explore partidas da NFL com filtros por temporada, semana e time',
    filterBySeason: 'Filtrar por temporada',
    filterByWeek: 'Filtrar por semana',
    filterByTeam: 'Filtrar por time',
    filterByType: 'Filtrar por tipo',
    allSeasons: 'Todas as temporadas',
    allWeeks: 'Todas as semanas',
    allTeams: 'Todos os times',
    allTypes: 'Todos os tipos',
    noGamesFound: 'Nenhuma partida encontrada',
    search: 'Buscar',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)
  })

  it('deve renderizar a página com lista de partidas', async () => {
    ;(getGames as jest.Mock).mockResolvedValue(mockGamesResponse)

    const searchParams = Promise.resolve({})
    const page = await GamesPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Partidas da NFL')).toBeInTheDocument()
      expect(screen.getByTestId('game-score-1')).toBeInTheDocument()
    })
  })

  it('deve renderizar filtros de busca', async () => {
    ;(getGames as jest.Mock).mockResolvedValue(mockGamesResponse)

    const searchParams = Promise.resolve({})
    const page = await GamesPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Filtrar por temporada')).toBeInTheDocument()
      expect(screen.getByText('Filtrar por semana')).toBeInTheDocument()
      expect(screen.getByText('Filtrar por time')).toBeInTheDocument()
      expect(screen.getByText('Filtrar por tipo')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando não houver partidas', async () => {
    ;(getGames as jest.Mock).mockResolvedValue({
      data: [],
      meta: {
        totalCount: 0,
        perPage: 25,
        currentPage: 1,
        totalPages: 1,
        nextCursor: null,
        previousCursor: null,
      },
    })

    const searchParams = Promise.resolve({})
    const page = await GamesPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Nenhuma partida encontrada')).toBeInTheDocument()
    })
  })
})
