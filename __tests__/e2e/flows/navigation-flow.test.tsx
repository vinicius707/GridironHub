/**
 * Testes E2E - Fluxo de Navegação Cruzada
 * 
 * Testa o fluxo completo:
 * 1. Acessar página de jogador
 * 2. Navegar para time do jogador
 * 3. Voltar para jogadores
 * 4. Verificar navegação entre páginas relacionadas
 */

import { render, screen, waitFor } from '@testing-library/react'
import { getPlayerById, getTeamById } from '@/application/use-cases'
import PlayerDetailPage from '@/app/[locale]/players/[id]/page'
import TeamDetailPage from '@/app/[locale]/teams/[id]/page'
import type { Player, Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getPlayerById: jest.fn(),
  getTeamById: jest.fn(),
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
  PlayerRow: ({ player }: { player: Player }) => (
    <div data-testid={`player-row-${player.id}`}>
      {player.firstName} {player.lastName}
    </div>
  ),
  TeamCard: ({ team }: { team: Team }) => (
    <div data-testid={`team-card-${team.id}`}>{team.fullName}</div>
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

describe('E2E - Fluxo de Navegação Cruzada', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPlayerById as jest.Mock).mockResolvedValue(mockPlayer)
    ;(getTeamById as jest.Mock).mockResolvedValue(mockTeam)
  })

  it('deve navegar de jogador para time e voltar', async () => {
    // 1. Acessar página de detalhes do jogador
    const playerParams = Promise.resolve({ locale: 'pt', id: '1' })
    const playerPage = await PlayerDetailPage({ params: playerParams })
    render(playerPage)

    await waitFor(() => {
      expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
    })

    // 2. Verificar link para o time
    const teamLink = screen.getByText('Philadelphia Eagles').closest('a')
    expect(teamLink).toHaveAttribute('href', '/teams/18')

    // 3. Renderizar página do time
    const teamParams = Promise.resolve({ locale: 'pt', id: '18' })
    const teamPage = await TeamDetailPage({ params: teamParams })
    render(teamPage)

    await waitFor(() => {
      expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
    })

    // 4. Verificar que o time foi carregado
    expect(getTeamById).toHaveBeenCalledWith(18)
  })

  it('deve manter contexto de navegação ao alternar entre páginas', async () => {
    // Renderizar página de jogador
    const playerParams = Promise.resolve({ locale: 'pt', id: '1' })
    const playerPage = await PlayerDetailPage({ params: playerParams })
    render(playerPage)

    await waitFor(() => {
      expect(screen.getByText('backToPlayers')).toBeInTheDocument()
    })

    // Verificar botão de voltar
    const backButton = screen.getByText('backToPlayers')
    expect(backButton).toBeInTheDocument()
  })
})
