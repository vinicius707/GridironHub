/**
 * Interface de Repositório para Partidas
 * Define contratos para busca de dados de partidas sem conhecer a implementação
 */

import type { Game } from '../entities/game'
import type { PaginatedResponse } from '@/shared/types'

/**
 * Parâmetros para busca de partidas
 */
export interface FindGamesParams {
  cursor?: number
  perPage?: number
  dates?: string[] // YYYY-MM-DD
  seasons?: number[]
  teamIds?: number[]
  postseason?: boolean
  weeks?: number[]
}

/**
 * Interface do repositório de partidas
 * Define métodos para buscar partidas sem depender de implementação específica
 */
export interface IGameRepository {
  /**
   * Busca partidas com paginação e filtros
   * @param params Parâmetros de busca e paginação
   */
  findMany(params?: FindGamesParams): Promise<PaginatedResponse<Game>>

  /**
   * Busca uma partida específica pelo ID
   * @param id ID da partida
   * @returns Partida encontrada ou null se não existir
   */
  findById(id: number): Promise<Game | null>

  /**
   * Busca partidas por temporada
   * @param season Temporada (ano)
   * @param params Parâmetros adicionais de busca e paginação
   */
  findBySeason(
    season: number,
    params?: Omit<FindGamesParams, 'seasons'>
  ): Promise<PaginatedResponse<Game>>

  /**
   * Busca partidas por time
   * @param teamId ID do time
   * @param params Parâmetros adicionais de busca e paginação
   */
  findByTeam(
    teamId: number,
    params?: Omit<FindGamesParams, 'teamIds'>
  ): Promise<PaginatedResponse<Game>>

  /**
   * Busca partidas por semana
   * @param season Temporada (ano)
   * @param week Semana
   * @param params Parâmetros adicionais de busca e paginação
   */
  findByWeek(
    season: number,
    week: number,
    params?: Omit<FindGamesParams, 'seasons' | 'weeks'>
  ): Promise<PaginatedResponse<Game>>

  /**
   * Busca partidas de playoffs
   * @param season Temporada (ano)
   * @param params Parâmetros adicionais de busca e paginação
   */
  findPlayoffs(
    season: number,
    params?: Omit<FindGamesParams, 'seasons' | 'postseason'>
  ): Promise<PaginatedResponse<Game>>
}
