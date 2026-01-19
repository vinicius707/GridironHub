/**
 * Implementação concreta do repositório de times usando NFL API
 */

import type { ITeamRepository, Conference, Division } from '@/domain/repositories'
import type { Team } from '@/domain/entities'
import { mapTeamFromDTO } from '@/domain/entities'
import type { NflApiClient } from '@/infrastructure/api/nfl/client'
import { TeamNotFoundError } from '@/domain/errors'
import { HttpClientError } from '@/infrastructure/http/client'
import { ApiErrorCode } from '@/shared/types'
import { mapList } from '@/application/helpers'

/**
 * Implementação concreta do repositório de times
 * Usa o NflApiClient para buscar dados da API
 */
export class NflTeamRepository implements ITeamRepository {
  constructor(private readonly apiClient: NflApiClient) {}

  /**
   * Busca todos os times
   */
  async findAll(): Promise<Team[]> {
    const response = await this.apiClient.getTeams()
    return mapList(response.data, mapTeamFromDTO)
  }

  /**
   * Busca um time específico pelo ID
   */
  async findById(id: number): Promise<Team | null> {
    try {
      const response = await this.apiClient.getTeamById(id)
      return mapTeamFromDTO(response.data)
    } catch (error) {
      // Se for erro 404, retorna null (recurso não encontrado)
      if (error instanceof HttpClientError && error.code === ApiErrorCode.NOT_FOUND) {
        return null
      }
      // Para outros erros, propaga o erro
      throw error
    }
  }

  /**
   * Busca times por conferência
   * Nota: A API não suporta filtro direto, então busca todos e filtra localmente
   */
  async findByConference(conference: Conference): Promise<Team[]> {
    const teams = await this.findAll()
    return teams.filter((team) => team.conference === conference)
  }

  /**
   * Busca times por conferência e divisão
   * Nota: A API não suporta filtro direto, então busca todos e filtra localmente
   */
  async findByDivision(conference: Conference, division: Division): Promise<Team[]> {
    const teams = await this.findAll()
    return teams.filter((team) => team.conference === conference && team.division === division)
  }
}
