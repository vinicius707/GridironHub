/**
 * Interface de Repositório para Roster
 * Define contratos para busca de dados de rosters sem conhecer a implementação
 */

import type { Roster } from '../entities/roster'

/**
 * Parâmetros para busca de roster
 */
export interface FindRosterParams {
  teamId: string // ID do time na ESPN
  season?: number // Temporada (opcional, usa padrão se não informado)
}

/**
 * Interface do repositório de rosters
 * Define métodos para buscar rosters sem depender de implementação específica
 */
export interface IRosterRepository {
  /**
   * Busca o roster de um time
   * @param params Parâmetros de busca (teamId obrigatório, season opcional)
   * @returns Roster do time ou null se não encontrado
   */
  findByTeam(params: FindRosterParams): Promise<Roster | null>

  /**
   * Busca rosters de múltiplos times
   * @param params Array de parâmetros de busca
   * @returns Array de rosters encontrados (sem nulls)
   */
  findByTeams(params: FindRosterParams[]): Promise<Roster[]>
}
