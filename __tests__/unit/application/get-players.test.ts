/**
 * Testes unitários para o use case getPlayers
 */

import {
  getPlayers,
  getPlayerById,
  getPlayersByTeam,
  searchPlayers,
} from '@/application/use-cases/get-players'
import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { PlayerDTO, TeamDTO } from '@/domain/entities'

// Mock do cliente da API
jest.mock('@/infrastructure/api/nfl/client', () => ({
  getNflApiClient: jest.fn(),
}))

describe('getPlayers Use Case', () => {
  const mockTeamDTO: TeamDTO = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    full_name: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockPlayersDTO: PlayerDTO[] = [
    {
      id: 490,
      first_name: 'Jalen',
      last_name: 'Hurts',
      position: 'Quarterback',
      position_abbreviation: 'QB',
      height: '6\'1"',
      weight: '223 lbs',
      jersey_number: '1',
      college: 'Oklahoma',
      experience: '5',
      age: 26,
      team: mockTeamDTO,
    },
    {
      id: 491,
      first_name: 'AJ',
      last_name: 'Brown',
      position: 'Wide Receiver',
      position_abbreviation: 'WR',
      height: '6\'1"',
      weight: '226 lbs',
      jersey_number: '11',
      college: 'Ole Miss',
      experience: '6',
      age: 27,
      team: mockTeamDTO,
    },
  ]

  const mockMeta = {
    next_cursor: 100,
    per_page: 25,
  }

  const mockClient = {
    getPlayers: jest.fn(),
    getPlayerById: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getNflApiClient as jest.Mock).mockReturnValue(mockClient)
  })

  describe('getPlayers', () => {
    it('deve retornar lista paginada de jogadores', async () => {
      mockClient.getPlayers.mockResolvedValueOnce({
        data: mockPlayersDTO,
        meta: mockMeta,
      })

      const result = await getPlayers()

      expect(result.data).toHaveLength(2)
      expect(result.meta.nextCursor).toBe(100)
      expect(result.meta.perPage).toBe(25)
    })

    it('deve mapear jogadores corretamente', async () => {
      mockClient.getPlayers.mockResolvedValueOnce({
        data: mockPlayersDTO,
        meta: mockMeta,
      })

      const result = await getPlayers()

      expect(result.data[0]?.firstName).toBe('Jalen')
      expect(result.data[0]?.lastName).toBe('Hurts')
      expect(result.data[0]?.team?.fullName).toBe('Philadelphia Eagles')
    })

    it('deve passar parâmetros para o cliente', async () => {
      mockClient.getPlayers.mockResolvedValueOnce({
        data: [],
        meta: { next_cursor: null, per_page: 10 },
      })

      await getPlayers({ cursor: 50, perPage: 10 })

      expect(mockClient.getPlayers).toHaveBeenCalledWith({
        cursor: 50,
        perPage: 10,
      })
    })
  })

  describe('getPlayerById', () => {
    it('deve retornar um jogador específico', async () => {
      mockClient.getPlayerById.mockResolvedValueOnce({ data: mockPlayersDTO[0] })

      const result = await getPlayerById(490)

      expect(result.id).toBe(490)
      expect(result.firstName).toBe('Jalen')
      expect(result.lastName).toBe('Hurts')
    })
  })

  describe('getPlayersByTeam', () => {
    it('deve buscar jogadores por time', async () => {
      mockClient.getPlayers.mockResolvedValueOnce({
        data: mockPlayersDTO,
        meta: mockMeta,
      })

      await getPlayersByTeam(18)

      expect(mockClient.getPlayers).toHaveBeenCalledWith(
        expect.objectContaining({
          teamIds: [18],
        })
      )
    })
  })

  describe('searchPlayers', () => {
    it('deve buscar jogadores por nome', async () => {
      mockClient.getPlayers.mockResolvedValueOnce({
        data: [mockPlayersDTO[0]],
        meta: { next_cursor: null, per_page: 25 },
      })

      const result = await searchPlayers('Hurts')

      expect(mockClient.getPlayers).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Hurts',
        })
      )
      expect(result.data).toHaveLength(1)
    })
  })
})
