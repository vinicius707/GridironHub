/**
 * Implementação concreta do repositório de estatísticas de jogadores usando ESPN API
 */

import type {
  IPlayerStatsRepository,
  FindPlayerStatsParams,
} from '@/domain/repositories'
import type { PlayerStatistics } from '@/domain/entities'
import { mapPlayerStatisticsFromDTO } from '@/domain/entities'
import type { EspnApiClient } from '@/infrastructure/api/espn'
import { DEFAULT_SEASON } from '@/infrastructure/api/espn/config'

/**
 * Implementação concreta do repositório de estatísticas de jogadores
 * Usa o EspnApiClient para buscar dados da API
 */
export class EspnPlayerStatsRepository implements IPlayerStatsRepository {
  constructor(private readonly apiClient: EspnApiClient) {}

  /**
   * Busca estatísticas de um jogador
   */
  async findByPlayer(
    params: FindPlayerStatsParams
  ): Promise<PlayerStatistics | null> {
    try {
      const season = params.season || DEFAULT_SEASON
      const response = await this.apiClient.getPlayerStatistics(
        params.playerId,
        season
      )

      return mapPlayerStatisticsFromDTO(response, season)
    } catch (error) {
      // Se o erro for de recurso não encontrado, retorna null
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      // Para outros erros, propaga o erro
      throw error
    }
  }

  /**
   * Busca estatísticas de múltiplos jogadores
   */
  async findByPlayers(
    params: FindPlayerStatsParams[]
  ): Promise<PlayerStatistics[]> {
    const results = await Promise.allSettled(
      params.map((param) => this.findByPlayer(param))
    )

    // Filtra apenas resultados bem-sucedidos e não nulos
    const stats: PlayerStatistics[] = []
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        stats.push(result.value)
      }
    }

    return stats
  }

  /**
   * Busca estatísticas de jogadores de um time
   * Nota: Requer primeiro buscar o roster do time para obter os IDs dos jogadores
   */
  async findByTeam(
    teamId: string,
    season?: number
  ): Promise<PlayerStatistics[]> {
    // Primeiro busca o roster do time para obter os IDs dos jogadores
    const roster = await this.apiClient.getTeamRoster(
      teamId,
      season || DEFAULT_SEASON
    )

    if (!roster.athletes?.items || roster.athletes.items.length === 0) {
      return []
    }

    // Busca estatísticas de todos os jogadores do roster
    const playerIds = roster.athletes.items.map((player) => player.id)
    const params: FindPlayerStatsParams[] = playerIds.map((playerId) => ({
      playerId,
      season,
    }))

    return this.findByPlayers(params)
  }
}
