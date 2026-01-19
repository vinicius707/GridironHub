/**
 * Implementação concreta do repositório de partidas usando NFL API
 */

import type { IGameRepository, FindGamesParams } from '@/domain/repositories'
import type { Game } from '@/domain/entities'
import { mapGameFromDTO, mapTeamFromDTO } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import type { NflApiClient, GetGamesParams } from '@/infrastructure/api/nfl/client'
import { mapPaginatedResponse } from '@/application/helpers'

/**
 * Implementação concreta do repositório de partidas
 * Usa o NflApiClient para buscar dados da API
 */
export class NflGameRepository implements IGameRepository {
  constructor(private readonly apiClient: NflApiClient) {}

  /**
   * Converte FindGamesParams (domain) para GetGamesParams (infrastructure)
   */
  private mapParams(params?: FindGamesParams): GetGamesParams | undefined {
    if (!params) return undefined

    return {
      cursor: params.cursor,
      perPage: params.perPage,
      dates: params.dates,
      seasons: params.seasons,
      teamIds: params.teamIds,
      postseason: params.postseason,
      weeks: params.weeks,
    }
  }

  /**
   * Busca partidas com paginação e filtros
   */
  async findMany(params?: FindGamesParams): Promise<PaginatedResponse<Game>> {
    const apiParams = this.mapParams(params)
    const response = await this.apiClient.getGames(apiParams)

    return mapPaginatedResponse(response, (dto) => mapGameFromDTO(dto, mapTeamFromDTO))
  }

  /**
   * Busca uma partida específica pelo ID
   */
  async findById(id: number): Promise<Game | null> {
    try {
      const response = await this.apiClient.getGameById(id)
      return mapGameFromDTO(response.data, mapTeamFromDTO)
    } catch {
      // TODO: Melhorar tratamento de erro (verificar se é 404)
      return null
    }
  }

  /**
   * Busca partidas por temporada
   */
  async findBySeason(
    season: number,
    params?: Omit<FindGamesParams, 'seasons'>
  ): Promise<PaginatedResponse<Game>> {
    return this.findMany({ ...params, seasons: [season] })
  }

  /**
   * Busca partidas por time
   */
  async findByTeam(
    teamId: number,
    params?: Omit<FindGamesParams, 'teamIds'>
  ): Promise<PaginatedResponse<Game>> {
    return this.findMany({ ...params, teamIds: [teamId] })
  }

  /**
   * Busca partidas por semana
   */
  async findByWeek(
    season: number,
    week: number,
    params?: Omit<FindGamesParams, 'seasons' | 'weeks'>
  ): Promise<PaginatedResponse<Game>> {
    return this.findMany({ ...params, seasons: [season], weeks: [week] })
  }

  /**
   * Busca partidas de playoffs
   */
  async findPlayoffs(
    season: number,
    params?: Omit<FindGamesParams, 'seasons' | 'postseason'>
  ): Promise<PaginatedResponse<Game>> {
    return this.findMany({ ...params, seasons: [season], postseason: true })
  }
}
