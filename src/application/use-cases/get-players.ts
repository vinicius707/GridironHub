/**
 * Use Case: Buscar jogadores da NFL
 * Refatorado para usar repositórios e Dependency Injection
 */

import type { FindPlayersParams } from '@/domain/repositories'
import type { Player } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { getContainer } from '@/application/dependencies'

/**
 * Busca jogadores com paginação e filtros
 */
export async function getPlayers(params?: FindPlayersParams): Promise<PaginatedResponse<Player>> {
  const repository = getContainer().getPlayerRepository()
  return repository.findMany(params)
}

/**
 * Busca um jogador específico pelo ID
 */
export async function getPlayerById(id: number): Promise<Player | null> {
  const repository = getContainer().getPlayerRepository()
  return repository.findById(id)
}

/**
 * Busca jogadores por time
 */
export async function getPlayersByTeam(
  teamId: number,
  params?: Omit<FindPlayersParams, 'teamIds'>
): Promise<PaginatedResponse<Player>> {
  const repository = getContainer().getPlayerRepository()
  return repository.findByTeam(teamId, params)
}

/**
 * Busca jogadores por nome
 */
export async function searchPlayers(
  search: string,
  params?: Omit<FindPlayersParams, 'search'>
): Promise<PaginatedResponse<Player>> {
  const repository = getContainer().getPlayerRepository()
  return repository.search(search, params)
}
