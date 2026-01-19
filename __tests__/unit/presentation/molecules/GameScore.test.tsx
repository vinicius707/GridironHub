/**
 * Testes unitários para o componente GameScore
 */

import { render, screen } from '@testing-library/react'
import { GameScore } from '@/presentation/components/molecules/GameScore'
import type { Game, Team } from '@/domain/entities'

const mockHomeTeam: Team = {
  id: 18,
  conference: 'NFC',
  division: 'EAST',
  location: 'Philadelphia',
  name: 'Eagles',
  fullName: 'Philadelphia Eagles',
  abbreviation: 'PHI',
}

const mockVisitorTeam: Team = {
  id: 8,
  conference: 'NFC',
  division: 'NORTH',
  location: 'Green Bay',
  name: 'Packers',
  fullName: 'Green Bay Packers',
  abbreviation: 'GB',
}

const mockFinishedGame: Game = {
  id: 12345,
  visitorTeam: mockVisitorTeam,
  homeTeam: mockHomeTeam,
  homeTeamScore: 34,
  visitorTeamScore: 27,
  season: 2024,
  postseason: false,
  status: 'Final',
  week: 1,
  time: '8:20 PM ET',
  date: '2024-09-05',
}

const mockScheduledGame: Game = {
  ...mockFinishedGame,
  id: 12346,
  homeTeamScore: 0,
  visitorTeamScore: 0,
  status: 'Scheduled',
}

const mockInProgressGame: Game = {
  ...mockFinishedGame,
  id: 12347,
  homeTeamScore: 14,
  visitorTeamScore: 7,
  status: 'In Progress',
}

describe('GameScore Component', () => {
  it('deve renderizar os nomes dos times', () => {
    render(<GameScore game={mockFinishedGame} />)

    expect(screen.getByText('Green Bay Packers')).toBeInTheDocument()
    expect(screen.getByText('Philadelphia Eagles')).toBeInTheDocument()
  })

  it('deve renderizar o placar para jogo finalizado', () => {
    render(<GameScore game={mockFinishedGame} />)

    expect(screen.getByText('27')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
  })

  it('deve renderizar o status do jogo', () => {
    render(<GameScore game={mockFinishedGame} />)

    expect(screen.getByText('Final')).toBeInTheDocument()
  })

  it('deve renderizar semana e temporada para jogo finalizado', () => {
    render(<GameScore game={mockFinishedGame} />)

    expect(screen.getByText(/semana 1/i)).toBeInTheDocument()
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('deve renderizar horário para jogo agendado', () => {
    render(<GameScore game={mockScheduledGame} />)

    expect(screen.getByText('8:20 PM ET')).toBeInTheDocument()
  })

  it('não deve renderizar placar para jogo agendado', () => {
    render(<GameScore game={mockScheduledGame} />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('deve renderizar badge info para jogo agendado', () => {
    render(<GameScore game={mockScheduledGame} />)

    const badge = screen.getByText('Scheduled')
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('deve renderizar badge warning para jogo em andamento', () => {
    render(<GameScore game={mockInProgressGame} />)

    const badge = screen.getByText('In Progress')
    expect(badge).toHaveClass('bg-yellow-100')
  })

  it('deve renderizar data quando showDate é true', () => {
    render(<GameScore game={mockFinishedGame} showDate />)

    expect(screen.getByText('2024-09-05')).toBeInTheDocument()
  })

  it('não deve renderizar data quando showDate é false', () => {
    render(<GameScore game={mockFinishedGame} showDate={false} />)

    expect(screen.queryByText('2024-09-05')).not.toBeInTheDocument()
  })
})
