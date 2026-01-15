/**
 * Testes unitários para o use case getTeams
 */

import {
  getTeams,
  getTeamById,
  getTeamsByConference,
  getTeamsByDivision,
} from '@/application/use-cases/get-teams'
import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { TeamDTO } from '@/domain/entities'

// Mock do cliente da API
jest.mock('@/infrastructure/api/nfl/client', () => ({
  getNflApiClient: jest.fn(),
}))

describe('getTeams Use Case', () => {
  const mockTeamsDTO: TeamDTO[] = [
    {
      id: 18,
      conference: 'NFC',
      division: 'EAST',
      location: 'Philadelphia',
      name: 'Eagles',
      full_name: 'Philadelphia Eagles',
      abbreviation: 'PHI',
    },
    {
      id: 8,
      conference: 'NFC',
      division: 'NORTH',
      location: 'Green Bay',
      name: 'Packers',
      full_name: 'Green Bay Packers',
      abbreviation: 'GB',
    },
    {
      id: 17,
      conference: 'AFC',
      division: 'EAST',
      location: 'New England',
      name: 'Patriots',
      full_name: 'New England Patriots',
      abbreviation: 'NE',
    },
  ]

  const mockClient = {
    getTeams: jest.fn(),
    getTeamById: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getNflApiClient as jest.Mock).mockReturnValue(mockClient)
  })

  describe('getTeams', () => {
    it('deve retornar lista de times mapeados', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: mockTeamsDTO })

      const result = await getTeams()

      expect(result).toHaveLength(3)
      expect(result[0]?.fullName).toBe('Philadelphia Eagles')
      expect(result[1]?.fullName).toBe('Green Bay Packers')
      expect(result[2]?.fullName).toBe('New England Patriots')
    })

    it('deve chamar o cliente da API corretamente', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: [] })

      await getTeams()

      expect(getNflApiClient).toHaveBeenCalled()
      expect(mockClient.getTeams).toHaveBeenCalled()
    })
  })

  describe('getTeamById', () => {
    it('deve retornar um time específico', async () => {
      mockClient.getTeamById.mockResolvedValueOnce({ data: mockTeamsDTO[0] })

      const result = await getTeamById(18)

      expect(result.id).toBe(18)
      expect(result.fullName).toBe('Philadelphia Eagles')
    })

    it('deve chamar o cliente com o ID correto', async () => {
      mockClient.getTeamById.mockResolvedValueOnce({ data: mockTeamsDTO[0] })

      await getTeamById(18)

      expect(mockClient.getTeamById).toHaveBeenCalledWith(18)
    })
  })

  describe('getTeamsByConference', () => {
    it('deve filtrar times por conferência NFC', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: mockTeamsDTO })

      const result = await getTeamsByConference('NFC')

      expect(result).toHaveLength(2)
      expect(result.every((team) => team.conference === 'NFC')).toBe(true)
    })

    it('deve filtrar times por conferência AFC', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: mockTeamsDTO })

      const result = await getTeamsByConference('AFC')

      expect(result).toHaveLength(1)
      expect(result[0]?.fullName).toBe('New England Patriots')
    })
  })

  describe('getTeamsByDivision', () => {
    it('deve filtrar times por conferência e divisão', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: mockTeamsDTO })

      const result = await getTeamsByDivision('NFC', 'EAST')

      expect(result).toHaveLength(1)
      expect(result[0]?.fullName).toBe('Philadelphia Eagles')
    })

    it('deve retornar array vazio se não houver times na divisão', async () => {
      mockClient.getTeams.mockResolvedValueOnce({ data: mockTeamsDTO })

      const result = await getTeamsByDivision('AFC', 'WEST')

      expect(result).toHaveLength(0)
    })
  })
})
