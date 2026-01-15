/**
 * Use Case: Buscar partidas da NFL
 */

import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { GetGamesParams } from '@/infrastructure/api/nfl/client'
import type { Game } from '@/domain/entities'
import { mapGameFromDTO, mapTeamFromDTO } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { mapPaginationMeta } from '@/shared/types'

/**
 * Busca jogos com paginação e filtros
 */
export async function getGames(params?: GetGamesParams): Promise<PaginatedResponse<Game>> {
  const client = getNflApiClient()
  const response = await client.getGames(params)

  return {
    data: response.data.map((dto) => mapGameFromDTO(dto, mapTeamFromDTO)),
    meta: mapPaginationMeta(response.meta),
  }
}

/**
 * Busca um jogo específico pelo ID
 */
export async function getGameById(id: number): Promise<Game> {
  const client = getNflApiClient()
  const response = await client.getGameById(id)

  return mapGameFromDTO(response.data, mapTeamFromDTO)
}

/**
 * Busca jogos por temporada
 */
export async function getGamesBySeason(
  season: number,
  params?: Omit<GetGamesParams, 'seasons'>
): Promise<PaginatedResponse<Game>> {
  return getGames({ ...params, seasons: [season] })
}

/**
 * Busca jogos por time
 */
export async function getGamesByTeam(
  teamId: number,
  params?: Omit<GetGamesParams, 'teamIds'>
): Promise<PaginatedResponse<Game>> {
  return getGames({ ...params, teamIds: [teamId] })
}

/**
 * Busca jogos por semana
 */
export async function getGamesByWeek(
  season: number,
  week: number,
  params?: Omit<GetGamesParams, 'seasons' | 'weeks'>
): Promise<PaginatedResponse<Game>> {
  return getGames({ ...params, seasons: [season], weeks: [week] })
}

/**
 * Busca jogos de playoffs
 */
export async function getPlayoffGames(
  season: number,
  params?: Omit<GetGamesParams, 'seasons' | 'postseason'>
): Promise<PaginatedResponse<Game>> {
  return getGames({ ...params, seasons: [season], postseason: true })
}
