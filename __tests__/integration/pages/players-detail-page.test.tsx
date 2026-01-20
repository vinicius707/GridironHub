/**
 * Testes de integração para a página de detalhes do jogador
 */

import { render, screen, waitFor } from '@testing-library/react'
import PlayerDetailPage from '@/app/[locale]/players/[id]/page'
import { getPlayerById } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import type { Player } from '@/domain/entities'

// Mock do next/navigation antes de qualquer importação que o use
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('notFound')
  }),
}))

// Mock dos use cases
jest.mock('@/application/use-cases', () => ({
  getPlayerById: jest.fn(),
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
  Badge: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
}))

describe('PlayerDetailPage - Integração', () => {
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
    team: {
      id: 18,
      conference: 'NFC',
      division: 'EAST',
      location: 'Philadelphia',
      name: 'Eagles',
      fullName: 'Philadelphia Eagles',
      abbreviation: 'PHI',
    },
  }

  const mockTranslations = {
    backToPlayers: 'Voltar para Jogadores',
    fullName: 'Nome Completo',
    position: 'Posição',
    team: 'Time',
    jerseyNumber: 'Número da Camisa',
    height: 'Altura',
    weight: 'Peso',
    age: 'Idade',
    college: 'Universidade',
    experience: 'Experiência',
    year: 'ano',
    years: 'anos',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTranslations as jest.Mock).mockResolvedValue((key: string) => mockTranslations[key as keyof typeof mockTranslations] || key)
  })

  it('deve renderizar os detalhes do jogador', async () => {
    ;(getPlayerById as jest.Mock).mockResolvedValue(mockPlayer)

    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const page = await PlayerDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
      expect(screen.getByText('QB')).toBeInTheDocument()
    })

    expect(screen.getByText('Nome Completo')).toBeInTheDocument()
    expect(screen.getByText('Posição')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
  })

  it('deve exibir botão voltar', async () => {
    ;(getPlayerById as jest.Mock).mockResolvedValue(mockPlayer)

    const params = Promise.resolve({ locale: 'pt', id: '1' })
    const page = await PlayerDetailPage({ params })
    render(page)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /backToPlayers/i })).toBeInTheDocument()
    })
  })
})
