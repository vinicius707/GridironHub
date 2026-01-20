/**
 * Testes E2E - Fluxo de Explorar Times
 * 
 * Testa o fluxo completo:
 * 1. Acessar lista de times
 * 2. Visualizar times organizados
 * 3. Clicar em um time
 * 4. Ver detalhes do time
 * 5. Voltar para lista
 */

import { render, screen, waitFor } from '@testing-library/react'
import { getTeams, getTeamById } from '@/application/use-cases'
import TeamsPage from '@/app/[locale]/teams/page'
import TeamDetailPage from '@/app/[locale]/teams/[id]/page'
import type { Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getTeams: jest.fn(),
  getTeamById: jest.fn(),
}))

// Mock do next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
  setRequestLocale: jest.fn(),
}))

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
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/teams',
}))

// Mock dos componentes
jest.mock('@/presentation/components/molecules', () => ({
  TeamCard: ({ team, href }: { team: Team; href?: string }) => (
    <div data-testid={`team-card-${team.id}`}>
      <a href={href || `#team-${team.id}`}>{team.fullName}</a>
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

jest.mock('@/presentation/components/templates', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

describe('E2E - Fluxo de Explorar Times', () => {
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
    {
      id: 1,
      conference: 'AFC',
      division: 'EAST',
      location: 'Buffalo',
      name: 'Bills',
      fullName: 'Buffalo Bills',
      abbreviation: 'BUF',
    },
  ]

  const mockTeam: Team = mockTeams[0]!

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)
    ;(getTeamById as jest.Mock).mockResolvedValue(mockTeam)
  })

  it('deve completar o fluxo completo de explorar times', async () => {
    // 1. Acessar lista de times
    const teamsPage = await TeamsPage()
    const { rerender } = render(teamsPage)

    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument()
    })

    // 2. Verificar que os times são exibidos
    await waitFor(() => {
      expect(screen.getByTestId('team-card-18')).toBeInTheDocument()
      expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
    })

    // 3. Verificar organização por conferência
    await waitFor(() => {
      expect(screen.getByText('NFC')).toBeInTheDocument()
      expect(screen.getByText('AFC')).toBeInTheDocument()
    })

    // 4. Acessar detalhes do time (simulando clique no link)
    const params = Promise.resolve({ locale: 'pt', id: '18' })
    const detailPage = await TeamDetailPage({ params })
    rerender(detailPage)

    await waitFor(() => {
      expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
      expect(screen.getByText('PHI')).toBeInTheDocument()
    })

    // 5. Verificar informações detalhadas
    expect(getTeamById).toHaveBeenCalledWith(18)
  })

  it('deve navegar da lista para detalhes e voltar', async () => {
    // Renderizar página de lista
    const teamsPage = await TeamsPage()
    render(teamsPage)

    await waitFor(() => {
      expect(screen.getByTestId('team-card-18')).toBeInTheDocument()
    })

    // Verificar que há link para detalhes
    const teamLink = screen.getByText('Philadelphia Eagles').closest('a')
    expect(teamLink).toHaveAttribute('href', '/teams/18')

    // Renderizar página de detalhes
    const params = Promise.resolve({ locale: 'pt', id: '18' })
    const detailPage = await TeamDetailPage({ params })
    render(detailPage)

    await waitFor(() => {
      expect(screen.getByText('backToTeams')).toBeInTheDocument()
    })
  })
})
