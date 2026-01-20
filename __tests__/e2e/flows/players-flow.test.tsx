/**
 * Testes E2E - Fluxo de Buscar Jogador
 * 
 * Testa o fluxo completo:
 * 1. Acessar lista de jogadores
 * 2. Aplicar filtros
 * 3. Buscar jogador
 * 4. Ver detalhes do jogador
 * 5. Navegar para time do jogador
 */

import { render, screen, waitFor } from '@testing-library/react'
import { getPlayers, getPlayerById, getTeams } from '@/application/use-cases'
import PlayersPage from '@/app/[locale]/players/page'
import PlayerDetailPage from '@/app/[locale]/players/[id]/page'
import type { Player, Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getPlayers: jest.fn(),
  getPlayerById: jest.fn(),
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
  PlayerRow: ({ player, href }: { player: Player; href?: string }) => (
    <div data-testid={`player-row-${player.id}`}>
      <a href={href || `#player-${player.id}`}>
        {player.firstName} {player.lastName}
      </a>
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
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

describe('E2E - Fluxo de Buscar Jogador', () => {
  const mockTeam: Team = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    fullName: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockPlayer: Player = {
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
    team: mockTeam,
  }

  const mockPlayersResponse = {
    data: [mockPlayer],
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
    ;(getPlayers as jest.Mock).mockResolvedValue(mockPlayersResponse)
    ;(getPlayerById as jest.Mock).mockResolvedValue(mockPlayer)
    ;(getTeams as jest.Mock).mockResolvedValue([mockTeam])
  })

  it('deve completar o fluxo de buscar e visualizar jogador', async () => {
    // 1. Acessar lista de jogadores
    const searchParams = Promise.resolve({})
    const playersPage = await PlayersPage({ searchParams })
    render(playersPage)

    await waitFor(() => {
      expect(screen.getByTestId('player-row-1')).toBeInTheDocument()
      expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
    })

    // 2. Verificar que há filtros disponíveis
    await waitFor(() => {
      expect(screen.getByText('filterByTeam')).toBeInTheDocument()
      expect(screen.getByText('filterByPosition')).toBeInTheDocument()
    })

    // 3. Acessar detalhes do jogador
    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const detailPage = await PlayerDetailPage({ params })
    render(detailPage)

    await waitFor(() => {
      expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
      expect(screen.getByText('QB')).toBeInTheDocument()
    })

    // 4. Verificar informações do jogador
    expect(getPlayerById).toHaveBeenCalledWith(1)
    expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
  })

  it('deve aplicar filtros na busca de jogadores', async () => {
    // Buscar com filtro de time
    const searchParams = Promise.resolve({ teamId: '18' })
    const playersPage = await PlayersPage({ searchParams })
    render(playersPage)

    await waitFor(() => {
      expect(getPlayers).toHaveBeenCalledWith(
        expect.objectContaining({
          teamIds: [18],
        })
      )
    })
  })
})
