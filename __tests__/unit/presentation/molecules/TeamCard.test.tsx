/**
 * Testes unitários para o componente TeamCard
 */

import { render, screen } from '@testing-library/react'
import { TeamCard } from '@/presentation/components/molecules/TeamCard'
import type { Team } from '@/domain/entities'

const mockTeam: Team = {
  id: 18,
  conference: 'NFC',
  division: 'EAST',
  location: 'Philadelphia',
  name: 'Eagles',
  fullName: 'Philadelphia Eagles',
  abbreviation: 'PHI',
}

describe('TeamCard Component', () => {
  it('deve renderizar o nome completo do time', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
  })

  it('deve renderizar a abreviação do time', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.getByText('PHI')).toBeInTheDocument()
  })

  it('deve renderizar a conferência', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.getByText('NFC')).toBeInTheDocument()
  })

  it('deve renderizar a divisão', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.getByText('EAST')).toBeInTheDocument()
  })

  it('deve renderizar a localização', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.getByText('Philadelphia')).toBeInTheDocument()
  })

  it('deve renderizar como link quando href é fornecido', () => {
    render(<TeamCard team={mockTeam} href="/times/18" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/times/18')
  })

  it('não deve renderizar como link quando href não é fornecido', () => {
    render(<TeamCard team={mockTeam} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('deve aplicar badge NFC com variante info', () => {
    render(<TeamCard team={mockTeam} />)

    const nfcBadge = screen.getByText('NFC')
    expect(nfcBadge).toHaveClass('bg-blue-100')
  })

  it('deve aplicar badge AFC com variante default', () => {
    const afcTeam: Team = {
      ...mockTeam,
      conference: 'AFC',
    }

    render(<TeamCard team={afcTeam} />)

    const afcBadge = screen.getByText('AFC')
    expect(afcBadge).toHaveClass('bg-gray-100')
  })
})
