/**
 * Testes de integração para a página de detalhes do time
 */

import { render, screen, waitFor } from '@testing-library/react'
import TeamDetailPage from '@/app/[locale]/teams/[id]/page'
import { getTeamById } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Team } from '@/domain/entities'

// Mock do next/navigation antes de qualquer importação que o use
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getTeamById: jest.fn(),
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

describe('TeamDetailPage - Integração', () => {
  const mockTeam: Team = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    fullName: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockTranslations = {
    backToTeams: 'Voltar para Times',
    fullName: 'Nome Completo',
    conference: 'Conferência',
    division: 'Divisão',
    location: 'Localização',
    abbreviation: 'Abreviação',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
  })

  it('deve renderizar os detalhes do time', async () => {
    ;(getTeamById as jest.Mock).mockResolvedValue(mockTeam)

    const params = Promise.resolve({ locale: 'pt', id: '18' })
    const page = await TeamDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
      expect(screen.getByText('PHI')).toBeInTheDocument()
    })

    expect(screen.getByText('Nome Completo')).toBeInTheDocument()
    expect(screen.getByText('Conferência')).toBeInTheDocument()
    expect(screen.getByText('Divisão')).toBeInTheDocument()
  })

  it('deve exibir botão voltar', async () => {
    ;(getTeamById as jest.Mock).mockResolvedValue(mockTeam)

    const params = Promise.resolve({ locale: 'pt', id: '18' })
    const page = await TeamDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /backToTeams/i })).toBeInTheDocument()
    })
  })

  it('deve chamar notFound quando time não existe', async () => {
    ;(getTeamById as jest.Mock).mockResolvedValue(null)

    // Mock do notFound do Next.js
    const mockNotFound = jest.fn(() => {
      throw new Error('notFound')
    })
    jest.doMock('next/navigation', () => ({
      notFound: mockNotFound,
    }))

    const params = Promise.resolve({ locale: 'pt', id: '999' })
    
    // O notFound lança um erro, então esperamos que a promise seja rejeitada
    await expect(TeamDetailPage({ params })).rejects.toThrow('notFound')
  })
})
