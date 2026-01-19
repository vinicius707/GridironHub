/**
 * Testes para use cases de times
 * Atualizado para usar repositórios via Dependency Injection
 */

import {
  getTeams,
  getTeamById,
  getTeamsByConference,
  getTeamsByDivision,
} from '@/application/use-cases'
import type { ITeamRepository } from '@/domain/repositories'
import type { Team } from '@/domain/entities'
import { getContainer } from '@/application/dependencies'

// Mock do container de dependências
jest.mock('@/application/dependencies', () => ({
  getContainer: jest.fn(),
}))

describe('Use Cases - Teams', () => {
  let mockRepository: jest.Mocked<ITeamRepository>
  let mockContainer: { getTeamRepository: jest.Mock }

  const mockTeam: Team = {
    id: 1,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    fullName: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockTeams: Team[] = [
    mockTeam,
    {
      id: 2,
      conference: 'NFC',
      division: 'WEST',
      location: 'San Francisco',
      name: '49ers',
      fullName: 'San Francisco 49ers',
      abbreviation: 'SF',
    },
    {
      id: 3,
      conference: 'AFC',
      division: 'EAST',
      location: 'Buffalo',
      name: 'Bills',
      fullName: 'Buffalo Bills',
      abbreviation: 'BUF',
    },
  ]

  beforeEach(() => {
    // Cria mock do repositório
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByConference: jest.fn(),
      findByDivision: jest.fn(),
    } as unknown as jest.Mocked<ITeamRepository>

    // Cria mock do container
    mockContainer = {
      getTeamRepository: jest.fn().mockReturnValue(mockRepository),
    }

    // Configura o mock do getContainer
    ;(getContainer as jest.Mock).mockReturnValue(mockContainer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getTeams', () => {
    it('deve retornar todos os times', async () => {
      mockRepository.findAll.mockResolvedValue(mockTeams)

      const result = await getTeams()

      expect(result).toEqual(mockTeams)
      expect(mockContainer.getTeamRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('deve retornar array vazio quando não há times', async () => {
      mockRepository.findAll.mockResolvedValue([])

      const result = await getTeams()

      expect(result).toEqual([])
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTeamById', () => {
    it('deve retornar um time específico pelo ID', async () => {
      mockRepository.findById.mockResolvedValue(mockTeam)

      const result = await getTeamById(1)

      expect(result).toEqual(mockTeam)
      expect(mockContainer.getTeamRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findById).toHaveBeenCalledWith(1)
    })

    it('deve retornar null quando time não é encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null)

      const result = await getTeamById(999)

      expect(result).toBeNull()
      expect(mockRepository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('getTeamsByConference', () => {
    it('deve retornar times filtrados por conferência', async () => {
      const nfcTeams = mockTeams.filter((team) => team.conference === 'NFC')
      mockRepository.findByConference.mockResolvedValue(nfcTeams)

      const result = await getTeamsByConference('NFC')

      expect(result).toEqual(nfcTeams)
      expect(mockContainer.getTeamRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findByConference).toHaveBeenCalledWith('NFC')
    })

    it('deve retornar array vazio quando não há times da conferência', async () => {
      mockRepository.findByConference.mockResolvedValue([])

      const result = await getTeamsByConference('AFC')

      expect(result).toEqual([])
      expect(mockRepository.findByConference).toHaveBeenCalledWith('AFC')
    })
  })

  describe('getTeamsByDivision', () => {
    it('deve retornar times filtrados por conferência e divisão', async () => {
      const nfcEastTeams = mockTeams.filter(
        (team) => team.conference === 'NFC' && team.division === 'EAST'
      )
      mockRepository.findByDivision.mockResolvedValue(nfcEastTeams)

      const result = await getTeamsByDivision('NFC', 'EAST')

      expect(result).toEqual(nfcEastTeams)
      expect(mockContainer.getTeamRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findByDivision).toHaveBeenCalledWith('NFC', 'EAST')
    })

    it('deve retornar array vazio quando não há times da divisão', async () => {
      mockRepository.findByDivision.mockResolvedValue([])

      const result = await getTeamsByDivision('AFC', 'WEST')

      expect(result).toEqual([])
      expect(mockRepository.findByDivision).toHaveBeenCalledWith('AFC', 'WEST')
    })
  })
})
