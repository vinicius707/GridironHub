/**
 * Interface de Repositório para Player Statistics
 * Define contratos para busca de dados de estatísticas de jogadores sem conhecer a implementação
 */

import type { PlayerStatistics } from '../entities/player-stats'

/**
 * Parâmetros para busca de estatísticas de jogador
 */
export interface FindPlayerStatsParams {
  playerId: string // ID do jogador na ESPN
  season?: number // Temporada (opcional, usa padrão se não informado)
}

/**
 * Interface do repositório de estatísticas de jogadores
 * Define métodos para buscar estatísticas sem depender de implementação específica
 */
export interface IPlayerStatsRepository {
  /**
   * Busca estatísticas de um jogador
   * @param params Parâmetros de busca (playerId obrigatório, season opcional)
   * @returns Estatísticas do jogador ou null se não encontrado
   */
  findByPlayer(params: FindPlayerStatsParams): Promise<PlayerStatistics | null>

  /**
   * Busca estatísticas de múltiplos jogadores
   * @param params Array de parâmetros de busca
   * @returns Array de estatísticas encontradas (sem nulls)
   */
  findByPlayers(params: FindPlayerStatsParams[]): Promise<PlayerStatistics[]>

  /**
   * Busca estatísticas de jogadores de um time
   * @param params Parâmetros de busca incluindo teamId
   * @returns Array de estatísticas dos jogadores do time
   */
  findByTeam(
    teamId: string,
    season?: number
  ): Promise<PlayerStatistics[]>
}
