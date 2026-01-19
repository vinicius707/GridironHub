/**
 * Implementação concreta do repositório de jogadores usando NFL API
 */

import type { IPlayerRepository, FindPlayersParams } from '@/domain/repositories'
import type { Player } from '@/domain/entities'
import { mapPlayerFromDTO, mapTeamFromDTO } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { mapPaginationMeta } from '@/shared/types'
import type { NflApiClient, GetPlayersParams } from '@/infrastructure/api/nfl/client'

/**
 * Implementação concreta do repositório de jogadores
 * Usa o NflApiClient para buscar dados da API
 */
export class NflPlayerRepository implements IPlayerRepository {
  constructor(private readonly apiClient: NflApiClient) {}

  /**
   * Converte FindPlayersParams (domain) para GetPlayersParams (infrastructure)
   */
  private mapParams(params?: FindPlayersParams): GetPlayersParams | undefined {
    if (!params) return undefined

    return {
      cursor: params.cursor,
      perPage: params.perPage,
      teamIds: params.teamIds,
      search: params.search,
      firstName: params.firstName,
      lastName: params.lastName,
    }
  }

  /**
   * Busca jogadores com paginação e filtros
   */
  async findMany(params?: FindPlayersParams): Promise<PaginatedResponse<Player>> {
    const apiParams = this.mapParams(params)
    const response = await this.apiClient.getPlayers(apiParams)

    return {
      data: response.data.map((dto) => mapPlayerFromDTO(dto, mapTeamFromDTO)),
      meta: mapPaginationMeta(response.meta),
    }
  }

  /**
   * Busca um jogador específico pelo ID
   */
  async findById(id: number): Promise<Player | null> {
    try {
      const response = await this.apiClient.getPlayerById(id)
      return mapPlayerFromDTO(response.data, mapTeamFromDTO)
    } catch (_error) {
      // TODO: Melhorar tratamento de erro (verificar se é 404)
      return null
    }
  }

  /**
   * Busca jogadores por time
   */
  async findByTeam(
    teamId: number,
    params?: Omit<FindPlayersParams, 'teamIds'>
  ): Promise<PaginatedResponse<Player>> {
    return this.findMany({ ...params, teamIds: [teamId] })
  }

  /**
   * Busca jogadores por nome (search)
   */
  async search(
    search: string,
    params?: Omit<FindPlayersParams, 'search'>
  ): Promise<PaginatedResponse<Player>> {
    return this.findMany({ ...params, search })
  }
}
