/**
 * Use Case: Buscar partidas da NFL
 * Refatorado para usar repositórios e Dependency Injection
 */

import type { IGameRepository, FindGamesParams } from '@/domain/repositories'
import type { Game } from '@/domain/entities'
import type { PaginatedResponse } from '@/shared/types'
import { getContainer } from '@/application/dependencies'

/**
 * Busca jogos com paginação e filtros
 */
export async function getGames(params?: FindGamesParams): Promise<PaginatedResponse<Game>> {
  const repository = getContainer().getGameRepository()
  return repository.findMany(params)
}

/**
 * Busca um jogo específico pelo ID
 */
export async function getGameById(id: number): Promise<Game | null> {
  const repository = getContainer().getGameRepository()
  return repository.findById(id)
}

/**
 * Busca jogos por temporada
 */
export async function getGamesBySeason(
  season: number,
  params?: Omit<FindGamesParams, 'seasons'>
): Promise<PaginatedResponse<Game>> {
  const repository = getContainer().getGameRepository()
  return repository.findBySeason(season, params)
}

/**
 * Busca jogos por time
 */
export async function getGamesByTeam(
  teamId: number,
  params?: Omit<FindGamesParams, 'teamIds'>
): Promise<PaginatedResponse<Game>> {
  const repository = getContainer().getGameRepository()
  return repository.findByTeam(teamId, params)
}

/**
 * Busca jogos por semana
 */
export async function getGamesByWeek(
  season: number,
  week: number,
  params?: Omit<FindGamesParams, 'seasons' | 'weeks'>
): Promise<PaginatedResponse<Game>> {
  const repository = getContainer().getGameRepository()
  return repository.findByWeek(season, week, params)
}

/**
 * Busca jogos de playoffs
 */
export async function getPlayoffGames(
  season: number,
  params?: Omit<FindGamesParams, 'seasons' | 'postseason'>
): Promise<PaginatedResponse<Game>> {
  const repository = getContainer().getGameRepository()
  return repository.findPlayoffs(season, params)
}
