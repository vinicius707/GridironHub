/**
 * Testes para use cases de partidas
 * Atualizado para usar repositórios via Dependency Injection
 */

import {
  getGames,
  getGameById,
  getGamesBySeason,
  getGamesByTeam,
  getGamesByWeek,
  getPlayoffGames,
} from '@/application/use-cases'
import type { IGameRepository, FindGamesParams } from '@/domain/repositories'
import type { Game } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { getContainer } from '@/application/dependencies'

// Mock do container de dependências
jest.mock('@/application/dependencies', () => ({
  getContainer: jest.fn(),
}))

describe('Use Cases - Games', () => {
  let mockRepository: jest.Mocked<IGameRepository>
  let mockContainer: { getGameRepository: jest.Mock }

  const mockGame: Game = {
    id: 1,
    visitorTeam: {
      id: 1,
      conference: 'NFC',
      division: 'EAST',
      location: 'Philadelphia',
      name: 'Eagles',
      fullName: 'Philadelphia Eagles',
      abbreviation: 'PHI',
    },
    homeTeam: {
      id: 2,
      conference: 'NFC',
      division: 'WEST',
      location: 'San Francisco',
      name: '49ers',
      fullName: 'San Francisco 49ers',
      abbreviation: 'SF',
    },
    homeTeamScore: 31,
    visitorTeamScore: 28,
    season: 2024,
    postseason: false,
    status: 'Final',
    week: 1,
    time: '8:20 PM ET',
    date: '2024-09-08',
  }

  const mockGamesResponse: PaginatedResponse<Game> = {
    data: [mockGame],
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
      findBySeason: jest.fn(),
      findByTeam: jest.fn(),
      findByWeek: jest.fn(),
      findPlayoffs: jest.fn(),
    } as unknown as jest.Mocked<IGameRepository>

    // Cria mock do container
    mockContainer = {
      getGameRepository: jest.fn().mockReturnValue(mockRepository),
    }

    // Configura o mock do getContainer
    ;(getContainer as jest.Mock).mockReturnValue(mockContainer)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getGames', () => {
    it('deve retornar partidas com paginação', async () => {
      mockRepository.findMany.mockResolvedValue(mockGamesResponse)

      const result = await getGames()

      expect(result).toEqual(mockGamesResponse)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findMany).toHaveBeenCalledWith(undefined)
    })

    it('deve passar parâmetros corretos para o repositório', async () => {
      const params: FindGamesParams = {
        perPage: 50,
        seasons: [2024],
      }
      mockRepository.findMany.mockResolvedValue(mockGamesResponse)

      await getGames(params)

      expect(mockRepository.findMany).toHaveBeenCalledWith(params)
    })
  })

  describe('getGameById', () => {
    it('deve retornar uma partida específica pelo ID', async () => {
      mockRepository.findById.mockResolvedValue(mockGame)

      const result = await getGameById(1)

      expect(result).toEqual(mockGame)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findById).toHaveBeenCalledWith(1)
    })

    it('deve retornar null quando partida não é encontrada', async () => {
      mockRepository.findById.mockResolvedValue(null)

      const result = await getGameById(999)

      expect(result).toBeNull()
      expect(mockRepository.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('getGamesBySeason', () => {
    it('deve retornar partidas de uma temporada específica', async () => {
      mockRepository.findBySeason.mockResolvedValue(mockGamesResponse)

      const result = await getGamesBySeason(2024)

      expect(result).toEqual(mockGamesResponse)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findBySeason).toHaveBeenCalledWith(2024, undefined)
    })

    it('deve passar parâmetros adicionais corretamente', async () => {
      const params: Omit<FindGamesParams, 'seasons'> = {
        perPage: 100,
      }
      mockRepository.findBySeason.mockResolvedValue(mockGamesResponse)

      await getGamesBySeason(2024, params)

      expect(mockRepository.findBySeason).toHaveBeenCalledWith(2024, params)
    })
  })

  describe('getGamesByTeam', () => {
    it('deve retornar partidas de um time específico', async () => {
      mockRepository.findByTeam.mockResolvedValue(mockGamesResponse)

      const result = await getGamesByTeam(18)

      expect(result).toEqual(mockGamesResponse)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findByTeam).toHaveBeenCalledWith(18, undefined)
    })
  })

  describe('getGamesByWeek', () => {
    it('deve retornar partidas de uma semana específica', async () => {
      mockRepository.findByWeek.mockResolvedValue(mockGamesResponse)

      const result = await getGamesByWeek(2024, 1)

      expect(result).toEqual(mockGamesResponse)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findByWeek).toHaveBeenCalledWith(2024, 1, undefined)
    })
  })

  describe('getPlayoffGames', () => {
    it('deve retornar partidas de playoffs', async () => {
      mockRepository.findPlayoffs.mockResolvedValue(mockGamesResponse)

      const result = await getPlayoffGames(2024)

      expect(result).toEqual(mockGamesResponse)
      expect(mockContainer.getGameRepository).toHaveBeenCalledTimes(1)
      expect(mockRepository.findPlayoffs).toHaveBeenCalledWith(2024, undefined)
    })
  })
})
