/**
 * Interface de Repositório para Times
 * Define contratos para busca de dados de times sem conhecer a implementação
 */

import type { Team } from '../entities/team'

export type Conference = 'AFC' | 'NFC'
export type Division = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'

/**
 * Interface do repositório de times
 * Define métodos para buscar times sem depender de implementação específica
 */
export interface ITeamRepository {
  /**
   * Busca todos os times
   */
  findAll(): Promise<Team[]>

  /**
   * Busca um time específico pelo ID
   * @param id ID do time
   * @returns Time encontrado ou null se não existir
   */
  findById(id: number): Promise<Team | null>

  /**
   * Busca times por conferência
   * @param conference Conferência (AFC ou NFC)
   */
  findByConference(conference: Conference): Promise<Team[]>

  /**
   * Busca times por conferência e divisão
   * @param conference Conferência (AFC ou NFC)
   * @param division Divisão (EAST, WEST, NORTH, SOUTH)
   */
  findByDivision(conference: Conference, division: Division): Promise<Team[]>
}
