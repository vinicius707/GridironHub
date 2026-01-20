/**
 * Testes de integração para a página de lista de jogadores
 */

import { render, screen, waitFor } from '@testing-library/react'
import PlayersPage from '@/app/[locale]/players/page'
import { getPlayers, getTeams } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Player, Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getPlayers: jest.fn(),
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
  PlayerRow: ({ player }: { player: Player }) => (
    <div data-testid={`player-row-${player.id}`}>
      {player.firstName} {player.lastName}
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
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}))

describe('PlayersPage - Integração', () => {
  const mockPlayers: Player[] = [
    {
      id: 1,
      firstName: 'Jalen',
      lastName: 'Hurts',
      position: 'Quarterback',
      positionAbbreviation: 'QB',
      height: "6'1\"",
      weight: '223 lbs',
      jerseyNumber: '1',
      college: 'Oklahoma',
      experience: '5',
      age: 26,
      team: {
        id: 18,
        conference: 'NFC',
        division: 'EAST',
        location: 'Philadelphia',
        name: 'Eagles',
        fullName: 'Philadelphia Eagles',
        abbreviation: 'PHI',
      },
    },
  ]

  const mockTeams: Team[] = [
    {
      id: 18,
      conference: 'NFC',
      division: 'EAST',
      location: 'Philadelphia',
      name: 'Eagles',
      fullName: 'Philadelphia Eagles',
      abbreviation: 'PHI',
    },
  ]

  const mockPlayersResponse = {
    data: mockPlayers,
    meta: {
      totalCount: 1,
      perPage: 25,
      currentPage: 1,
      totalPages: 1,
      nextCursor: null,
      previousCursor: null,
    },
  }

  const mockTranslations = {
    title: 'Jogadores da NFL',
    description: 'Explore jogadores da NFL com filtros e busca',
    search: 'Buscar jogador',
    searchPlaceholder: 'Digite o nome do jogador...',
    filterByTeam: 'Filtrar por time',
    filterByPosition: 'Filtrar por posição',
    allTeams: 'Todos os times',
    allPositions: 'Todas as posições',
    noPlayersFound: 'Nenhum jogador encontrado',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)
  })

  it('deve renderizar a página com lista de jogadores', async () => {
    ;(getPlayers as jest.Mock).mockResolvedValue(mockPlayersResponse)

    const searchParams = Promise.resolve({})
    const page = await PlayersPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Jogadores da NFL')).toBeInTheDocument()
      expect(screen.getByTestId('player-row-1')).toBeInTheDocument()
      expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
    })
  })

  it('deve renderizar filtros de busca', async () => {
    ;(getPlayers as jest.Mock).mockResolvedValue(mockPlayersResponse)

    const searchParams = Promise.resolve({})
    const page = await PlayersPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByLabelText('Digite o nome do jogador...')).toBeInTheDocument()
      expect(screen.getByText('Filtrar por time')).toBeInTheDocument()
      expect(screen.getByText('Filtrar por posição')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem quando não houver jogadores', async () => {
    ;(getPlayers as jest.Mock).mockResolvedValue({
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
    const page = await PlayersPage({ searchParams })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Nenhum jogador encontrado')).toBeInTheDocument()
    })
  })
})
