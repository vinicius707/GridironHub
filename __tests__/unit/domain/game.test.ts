/**
 * Testes unitários para a entidade Game
 */

import {
  mapGameFromDTO,
  isGameFinished,
  isGameInProgress,
  isGameScheduled,
  getGameWinner,
  getGameScoreDisplay,
  getGameDateDisplay,
} from '@/domain/entities/game'
import { mapTeamFromDTO } from '@/domain/entities/team'
import type { GameDTO } from '@/domain/entities/game'
import type { TeamDTO } from '@/domain/entities/team'

describe('Game Entity', () => {
  const homeTeamDTO: TeamDTO = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    full_name: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const visitorTeamDTO: TeamDTO = {
    id: 8,
    conference: 'NFC',
    division: 'NORTH',
    location: 'Green Bay',
    name: 'Packers',
    full_name: 'Green Bay Packers',
    abbreviation: 'GB',
  }

  const mockFinishedGameDTO: GameDTO = {
    id: 12345,
    visitor_team: visitorTeamDTO,
    home_team: homeTeamDTO,
    home_team_score: 34,
    visitor_team_score: 27,
    season: 2024,
    postseason: false,
    status: 'Final',
    week: 1,
    time: '8:20 PM ET',
    date: '2024-09-05',
  }

  const mockScheduledGameDTO: GameDTO = {
    ...mockFinishedGameDTO,
    id: 12346,
    home_team_score: 0,
    visitor_team_score: 0,
    status: 'Scheduled',
  }

  const mockInProgressGameDTO: GameDTO = {
    ...mockFinishedGameDTO,
    id: 12347,
    home_team_score: 14,
    visitor_team_score: 7,
    status: 'In Progress',
  }

  describe('mapGameFromDTO', () => {
    it('deve mapear GameDTO para Game corretamente', () => {
      const result = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)

      expect(result.id).toBe(12345)
      expect(result.season).toBe(2024)
      expect(result.postseason).toBe(false)
      expect(result.status).toBe('Final')
      expect(result.week).toBe(1)
      expect(result.time).toBe('8:20 PM ET')
      expect(result.date).toBe('2024-09-05')
    })

    it('deve converter snake_case para camelCase', () => {
      const result = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)

      expect(result.homeTeamScore).toBe(34)
      expect(result.visitorTeamScore).toBe(27)
      expect(result).not.toHaveProperty('home_team_score')
      expect(result).not.toHaveProperty('visitor_team_score')
    })

    it('deve mapear os times corretamente', () => {
      const result = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)

      expect(result.homeTeam.fullName).toBe('Philadelphia Eagles')
      expect(result.visitorTeam.fullName).toBe('Green Bay Packers')
    })
  })

  describe('isGameFinished', () => {
    it('deve retornar true para jogo finalizado', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      expect(isGameFinished(game)).toBe(true)
    })

    it('deve retornar false para jogo agendado', () => {
      const game = mapGameFromDTO(mockScheduledGameDTO, mapTeamFromDTO)
      expect(isGameFinished(game)).toBe(false)
    })

    it('deve retornar false para jogo em andamento', () => {
      const game = mapGameFromDTO(mockInProgressGameDTO, mapTeamFromDTO)
      expect(isGameFinished(game)).toBe(false)
    })
  })

  describe('isGameInProgress', () => {
    it('deve retornar true para jogo em andamento', () => {
      const game = mapGameFromDTO(mockInProgressGameDTO, mapTeamFromDTO)
      expect(isGameInProgress(game)).toBe(true)
    })

    it('deve retornar false para jogo finalizado', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      expect(isGameInProgress(game)).toBe(false)
    })
  })

  describe('isGameScheduled', () => {
    it('deve retornar true para jogo agendado', () => {
      const game = mapGameFromDTO(mockScheduledGameDTO, mapTeamFromDTO)
      expect(isGameScheduled(game)).toBe(true)
    })

    it('deve retornar false para jogo finalizado', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      expect(isGameScheduled(game)).toBe(false)
    })
  })

  describe('getGameWinner', () => {
    it('deve retornar o time vencedor para jogo finalizado', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      const winner = getGameWinner(game)

      expect(winner).not.toBeNull()
      expect(winner?.fullName).toBe('Philadelphia Eagles')
    })

    it('deve retornar null para jogo não finalizado', () => {
      const game = mapGameFromDTO(mockScheduledGameDTO, mapTeamFromDTO)
      const winner = getGameWinner(game)

      expect(winner).toBeNull()
    })

    it('deve retornar null para empate', () => {
      const tieGameDTO: GameDTO = {
        ...mockFinishedGameDTO,
        home_team_score: 24,
        visitor_team_score: 24,
      }
      const game = mapGameFromDTO(tieGameDTO, mapTeamFromDTO)
      const winner = getGameWinner(game)

      expect(winner).toBeNull()
    })

    it('deve retornar time visitante quando ele vence', () => {
      const visitorWinsDTO: GameDTO = {
        ...mockFinishedGameDTO,
        home_team_score: 20,
        visitor_team_score: 35,
      }
      const game = mapGameFromDTO(visitorWinsDTO, mapTeamFromDTO)
      const winner = getGameWinner(game)

      expect(winner?.fullName).toBe('Green Bay Packers')
    })
  })

  describe('getGameScoreDisplay', () => {
    it('deve retornar o placar para jogo finalizado', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      const score = getGameScoreDisplay(game)

      expect(score).toBe('27 - 34')
    })

    it('deve retornar o horário para jogo agendado', () => {
      const game = mapGameFromDTO(mockScheduledGameDTO, mapTeamFromDTO)
      const score = getGameScoreDisplay(game)

      expect(score).toBe('8:20 PM ET')
    })
  })

  describe('getGameDateDisplay', () => {
    it('deve formatar a data corretamente', () => {
      const game = mapGameFromDTO(mockFinishedGameDTO, mapTeamFromDTO)
      const dateDisplay = getGameDateDisplay(game)

      // O formato depende do locale, mas deve conter informações da data
      expect(dateDisplay).toBeTruthy()
      expect(typeof dateDisplay).toBe('string')
    })
  })
})
