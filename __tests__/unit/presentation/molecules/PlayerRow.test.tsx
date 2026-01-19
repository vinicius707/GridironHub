/**
 * Testes unitários para o componente PlayerRow
 */

import { render, screen } from '@testing-library/react'
import { PlayerRow } from '@/presentation/components/molecules/PlayerRow'
import type { Player, Team } from '@/domain/entities'

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
  id: 490,
  firstName: 'Jalen',
  lastName: 'Hurts',
  position: 'Quarterback',
  positionAbbreviation: 'QB',
  height: '6\'1"',
  weight: '223 lbs',
  jerseyNumber: '1',
  college: 'Oklahoma',
  experience: '5',
  age: 26,
  team: mockTeam,
}

describe('PlayerRow Component', () => {
  it('deve renderizar o nome completo do jogador', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
  })

  it('deve renderizar a posição do jogador', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.getByText('QB')).toBeInTheDocument()
  })

  it('deve renderizar o time do jogador quando disponível', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
  })

  it('deve renderizar o número da camisa quando disponível', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('deve renderizar altura e peso quando disponíveis', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.getByText('6\'1"')).toBeInTheDocument()
    expect(screen.getByText('223 lbs')).toBeInTheDocument()
  })

  it('deve renderizar como link quando href é fornecido', () => {
    render(<PlayerRow player={mockPlayer} href="/jogadores/490" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/jogadores/490')
  })

  it('não deve renderizar como link quando href não é fornecido', () => {
    render(<PlayerRow player={mockPlayer} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('deve renderizar corretamente quando jogador não tem time', () => {
    const playerWithoutTeam: Player = {
      ...mockPlayer,
      team: null,
    }

    render(<PlayerRow player={playerWithoutTeam} />)

    expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
    expect(screen.queryByText('Philadelphia Eagles')).not.toBeInTheDocument()
  })

  it('deve renderizar corretamente quando jogador não tem número de camisa', () => {
    const playerWithoutJersey: Player = {
      ...mockPlayer,
      jerseyNumber: '',
    }

    render(<PlayerRow player={playerWithoutJersey} />)

    expect(screen.getByText('Jalen Hurts')).toBeInTheDocument()
    expect(screen.queryByText('#1')).not.toBeInTheDocument()
  })
})
