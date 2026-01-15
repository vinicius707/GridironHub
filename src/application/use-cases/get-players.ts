/**
 * Use Case: Buscar jogadores da NFL
 */

import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { GetPlayersParams } from '@/infrastructure/api/nfl/client'
import type { Player } from '@/domain/entities'
import { mapPlayerFromDTO, mapTeamFromDTO } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { mapPaginationMeta } from '@/shared/types'

/**
 * Busca jogadores com paginação e filtros
 */
export async function getPlayers(params?: GetPlayersParams): Promise<PaginatedResponse<Player>> {
  const client = getNflApiClient()
  const response = await client.getPlayers(params)

  return {
    data: response.data.map((dto) => mapPlayerFromDTO(dto, mapTeamFromDTO)),
    meta: mapPaginationMeta(response.meta),
  }
}

/**
 * Busca um jogador específico pelo ID
 */
export async function getPlayerById(id: number): Promise<Player> {
  const client = getNflApiClient()
  const response = await client.getPlayerById(id)

  return mapPlayerFromDTO(response.data, mapTeamFromDTO)
}

/**
 * Busca jogadores por time
 */
export async function getPlayersByTeam(
  teamId: number,
  params?: Omit<GetPlayersParams, 'teamIds'>
): Promise<PaginatedResponse<Player>> {
  return getPlayers({ ...params, teamIds: [teamId] })
}

/**
 * Busca jogadores por nome
 */
export async function searchPlayers(
  search: string,
  params?: Omit<GetPlayersParams, 'search'>
): Promise<PaginatedResponse<Player>> {
  return getPlayers({ ...params, search })
}
