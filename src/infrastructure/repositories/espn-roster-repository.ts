/**
 * Implementação concreta do repositório de rosters usando ESPN API
 */

import type { IRosterRepository, FindRosterParams } from '@/domain/repositories'
import type { Roster } from '@/domain/entities'
import { mapRosterFromDTO } from '@/domain/entities'
import type { EspnApiClient } from '@/infrastructure/api/espn'
import { DEFAULT_SEASON } from '@/infrastructure/api/espn/config'

/**
 * Implementação concreta do repositório de rosters
 * Usa o EspnApiClient para buscar dados da API
 */
export class EspnRosterRepository implements IRosterRepository {
  constructor(private readonly apiClient: EspnApiClient) {}

  /**
   * Busca o roster de um time
   */
  async findByTeam(params: FindRosterParams): Promise<Roster | null> {
    try {
      const season = params.season || DEFAULT_SEASON
      const response = await this.apiClient.getTeamRoster(params.teamId, season)
      
      return mapRosterFromDTO(response, params.teamId, season)
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
   * Busca rosters de múltiplos times
   */
  async findByTeams(params: FindRosterParams[]): Promise<Roster[]> {
    const results = await Promise.allSettled(
      params.map((param) => this.findByTeam(param))
    )

    // Filtra apenas resultados bem-sucedidos e não nulos
    const rosters: Roster[] = []
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        rosters.push(result.value)
      }
    }

    return rosters
  }
}
