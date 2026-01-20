/**
 * Testes para use cases de jogadores
 * Atualizado para usar repositórios via Dependency Injection
 */

import { getPlayers, getPlayerById, getPlayersByTeam, searchPlayers } from '@/application/use-cases'
import type { IPlayerRepository, FindPlayersParams } from '@/domain/repositories'
import type { Player } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { getContainer } from '@/application/dependencies'

// Mock do container de dependências
jest.mock('@/application/dependencies', () => ({
  getContainer: jest.fn(),
}))

describe('Use Cases - Players', () => {
  let mockRepository: jest.Mocked<IPlayerRepository>
  let mockContainer: { getPlayerRepository: jest.Mock }

  const mockPlayer: Player = {
    id: 1,
    firstName: 'Jalen',
    lastName: 'Hurts',
    position: 'Quarterback',
    positionAbbreviation: 'QB',
    height: '6\'1"',
    weight: '223 lbs',
    jerseyNumber: '1',
    college: 'Oklahoma',
    experience: '4',
    age: 25,
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

  const mockPlayersResponse: PaginatedResponse<Player> = {
    data: [mockPlayer],
    meta: {
      nextCursor: null,
      perPage: 25,
    },
  }

  beforeEach(() => {
    // Cria mock do repositório
    mockRepository = {
      findMany: jest.fn(),
      findById: jest.fn(),
      findByTeam: jest.fn(),
      search: jest.fn(),
    } as unknown as jest.Mocked<IPlayerRepository>

    // Cria mock do container
    mockContainer = {
      getPlayerRepository: jest.fn().mockReturnValue(mockRepository),
    }

    // Configura o mock do getContainer
    ;(getContainer as jest.Mock).mockReturnValue(mockContainer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getPlayers', () => {
    it('deve retornar jogadores com paginação', async () => {
      mockRepository.findMany.mockResolvedValue(mockPlayersResponse)

      const result = await getPlayers()

      expect(result).toEqual(mockPlayersResponse)
      expect(mockContainer.getPlayerRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findMany).toHaveBeenCalledWith(undefined)
    })

    it('deve passar parâmetros corretos para o repositório', async () => {
      const params: FindPlayersParams = {
        perPage: 50,
        cursor: 100,
      }
      mockRepository.findMany.mockResolvedValue(mockPlayersResponse)

      await getPlayers(params)

      expect(mockRepository.findMany).toHaveBeenCalledWith(params)
    })
  })

  describe('getPlayerById', () => {
    it('deve retornar um jogador específico pelo ID', async () => {
      mockRepository.findById.mockResolvedValue(mockPlayer)

      const result = await getPlayerById(1)

      expect(result).toEqual(mockPlayer)
      expect(mockContainer.getPlayerRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findById).toHaveBeenCalledWith(1)
    })

    it('deve retornar null quando jogador não é encontrado', async () => {
      mockRepository.findById.mockResolvedValue(null)

      const result = await getPlayerById(999)

      expect(result).toBeNull()
      expect(mockRepository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('getPlayersByTeam', () => {
    it('deve retornar jogadores de um time específico', async () => {
      mockRepository.findByTeam.mockResolvedValue(mockPlayersResponse)

      const result = await getPlayersByTeam(18)

      expect(result).toEqual(mockPlayersResponse)
      expect(mockContainer.getPlayerRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findByTeam).toHaveBeenCalledWith(18, undefined)
    })

    it('deve passar parâmetros adicionais corretamente', async () => {
      const params: Omit<FindPlayersParams, 'teamIds'> = {
        perPage: 100,
      }
      mockRepository.findByTeam.mockResolvedValue(mockPlayersResponse)

      await getPlayersByTeam(18, params)

      expect(mockRepository.findByTeam).toHaveBeenCalledWith(18, params)
    })
  })

  describe('searchPlayers', () => {
    it('deve retornar jogadores filtrados por busca', async () => {
      mockRepository.search.mockResolvedValue(mockPlayersResponse)

      const result = await searchPlayers('Hurts')

      expect(result).toEqual(mockPlayersResponse)
      expect(mockContainer.getPlayerRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.search).toHaveBeenCalledWith('Hurts', undefined)
    })

    it('deve passar parâmetros adicionais corretamente', async () => {
      const params: Omit<FindPlayersParams, 'search'> = {
        perPage: 10,
      }
      mockRepository.search.mockResolvedValue(mockPlayersResponse)

      await searchPlayers('Smith', params)

      expect(mockRepository.search).toHaveBeenCalledWith('Smith', params)
    })
  })
})
