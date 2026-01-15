/**
 * Testes unitários para o use case getGames
 */

import {
  getGames,
  getGameById,
  getGamesBySeason,
  getGamesByTeam,
  getGamesByWeek,
  getPlayoffGames,
} from '@/application/use-cases/get-games'
import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { GameDTO, TeamDTO } from '@/domain/entities'

// Mock do cliente da API
jest.mock('@/infrastructure/api/nfl/client', () => ({
  getNflApiClient: jest.fn(),
}))

describe('getGames Use Case', () => {
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

  const mockGamesDTO: GameDTO[] = [
    {
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
    },
    {
      id: 12346,
      visitor_team: homeTeamDTO,
      home_team: visitorTeamDTO,
      home_team_score: 21,
      visitor_team_score: 28,
      season: 2024,
      postseason: false,
      status: 'Final',
      week: 10,
      time: '1:00 PM ET',
      date: '2024-11-10',
    },
  ]

  const mockMeta = {
    next_cursor: 100,
    per_page: 25,
  }

  const mockClient = {
    getGames: jest.fn(),
    getGameById: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getNflApiClient as jest.Mock).mockReturnValue(mockClient)
  })

  describe('getGames', () => {
    it('deve retornar lista paginada de jogos', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: mockGamesDTO,
        meta: mockMeta,
      })

      const result = await getGames()

      expect(result.data).toHaveLength(2)
      expect(result.meta.nextCursor).toBe(100)
    })

    it('deve mapear jogos corretamente', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: mockGamesDTO,
        meta: mockMeta,
      })

      const result = await getGames()

      expect(result.data[0]?.homeTeam.fullName).toBe('Philadelphia Eagles')
      expect(result.data[0]?.visitorTeam.fullName).toBe('Green Bay Packers')
      expect(result.data[0]?.homeTeamScore).toBe(34)
    })
  })

  describe('getGameById', () => {
    it('deve retornar um jogo específico', async () => {
      mockClient.getGameById.mockResolvedValueOnce({ data: mockGamesDTO[0] })

      const result = await getGameById(12345)

      expect(result.id).toBe(12345)
      expect(result.status).toBe('Final')
    })
  })

  describe('getGamesBySeason', () => {
    it('deve buscar jogos por temporada', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: mockGamesDTO,
        meta: mockMeta,
      })

      await getGamesBySeason(2024)

      expect(mockClient.getGames).toHaveBeenCalledWith(
        expect.objectContaining({
          seasons: [2024],
        })
      )
    })
  })

  describe('getGamesByTeam', () => {
    it('deve buscar jogos por time', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: mockGamesDTO,
        meta: mockMeta,
      })

      await getGamesByTeam(18)

      expect(mockClient.getGames).toHaveBeenCalledWith(
        expect.objectContaining({
          teamIds: [18],
        })
      )
    })
  })

  describe('getGamesByWeek', () => {
    it('deve buscar jogos por semana', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: [mockGamesDTO[0]],
        meta: { next_cursor: null, per_page: 25 },
      })

      await getGamesByWeek(2024, 1)

      expect(mockClient.getGames).toHaveBeenCalledWith(
        expect.objectContaining({
          seasons: [2024],
          weeks: [1],
        })
      )
    })
  })

  describe('getPlayoffGames', () => {
    it('deve buscar jogos de playoffs', async () => {
      mockClient.getGames.mockResolvedValueOnce({
        data: [],
        meta: { next_cursor: null, per_page: 25 },
      })

      await getPlayoffGames(2024)

      expect(mockClient.getGames).toHaveBeenCalledWith(
        expect.objectContaining({
          seasons: [2024],
          postseason: true,
        })
      )
    })
  })
})
