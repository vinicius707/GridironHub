/**
 * Interface de Repositório para Jogadores
 * Define contratos para busca de dados de jogadores sem conhecer a implementação
 */

import type { Player } from '../entities/player'
import type { PaginatedResponse } from '@/shared/types'

/**
 * Parâmetros para busca de jogadores
 */
export interface FindPlayersParams {
  cursor?: number
  perPage?: number
  teamIds?: number[]
  search?: string
  firstName?: string
  lastName?: string
}

/**
 * Interface do repositório de jogadores
 * Define métodos para buscar jogadores sem depender de implementação específica
 */
export interface IPlayerRepository {
  /**
   * Busca jogadores com paginação e filtros
   * @param params Parâmetros de busca e paginação
   */
  findMany(params?: FindPlayersParams): Promise<PaginatedResponse<Player>>

  /**
   * Busca um jogador específico pelo ID
   * @param id ID do jogador
   * @returns Jogador encontrado ou null se não existir
   */
  findById(id: number): Promise<Player | null>

  /**
   * Busca jogadores por time
   * @param teamId ID do time
   * @param params Parâmetros adicionais de busca e paginação
   */
  findByTeam(
    teamId: number,
    params?: Omit<FindPlayersParams, 'teamIds'>
  ): Promise<PaginatedResponse<Player>>

  /**
   * Busca jogadores por nome (search)
   * @param search Termo de busca
   * @param params Parâmetros adicionais de busca e paginação
   */
  search(
    search: string,
    params?: Omit<FindPlayersParams, 'search'>
  ): Promise<PaginatedResponse<Player>>
}
