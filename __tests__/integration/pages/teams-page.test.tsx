/**
 * Testes de integração para a página de lista de times
 */

import { render, screen, waitFor } from '@testing-library/react'
import TeamsPage from '@/app/[locale]/teams/page'
import { getTeams } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Team } from '@/domain/entities'

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getTeams: jest.fn(),
}))

// Mock do next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

// Mock do componente TeamCard
jest.mock('@/presentation/components/molecules', () => ({
  TeamCard: ({ team }: { team: Team }) => (
    <div data-testid={`team-card-${team.id}`}>{team.fullName}</div>
  ),
}))

// Mock do componente Text
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
}))

describe('TeamsPage - Integração', () => {
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

  const mockTranslations = {
    title: 'Times da NFL',
    description: 'Explore todos os 32 times da NFL',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
  })

  it('deve renderizar a página com lista de times', async () => {
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)

    const page = await TeamsPage()
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Times da NFL')).toBeInTheDocument()
      expect(screen.getByText('Explore todos os 32 times da NFL')).toBeInTheDocument()
    })

    expect(screen.getByTestId('team-card-18')).toBeInTheDocument()
    expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
  })

  it('deve agrupar times por conferência e divisão', async () => {
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)

    const page = await TeamsPage()
    render(page)

    await waitFor(() => {
      expect(screen.getByText('AFC')).toBeInTheDocument()
      expect(screen.getByText('NFC')).toBeInTheDocument()
    })
  })

  it('deve exibir mensagem de erro quando não conseguir carregar times', async () => {
    ;(getTeams as jest.Mock).mockRejectedValue(new Error('Erro ao carregar'))

    // Mock do notFound do Next.js
    const mockNotFound = jest.fn()
    jest.mock('next/navigation', () => ({
      notFound: mockNotFound,
    }))

    await expect(TeamsPage()).rejects.toThrow()
  })

  it('deve renderizar seção com título acessível', async () => {
    ;(getTeams as jest.Mock).mockResolvedValue(mockTeams)

    const page = await TeamsPage()
    render(page)

    await waitFor(() => {
      const section = screen.getByLabelText('Times da NFL organizados por conferência e divisão')
      expect(section).toBeInTheDocument()
    })
  })
})
