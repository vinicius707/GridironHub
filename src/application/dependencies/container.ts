/**
 * Container de Dependency Injection
 * Centraliza a criação de dependências e mantém instâncias singletons
 */

import type { ITeamRepository, IPlayerRepository } from '@/domain/repositories'
import { NflTeamRepository, NflPlayerRepository } from '@/infrastructure/repositories'
import type { NflApiClient } from '@/infrastructure/api/nfl/client'
import { getNflApiClient } from '@/infrastructure/api/nfl/client'

/**
 * Container de dependências
 * Mantém instâncias singleton dos repositórios
 */
export class DependencyContainer {
  private teamRepository: ITeamRepository | null = null
  private playerRepository: IPlayerRepository | null = null
  private apiClient: NflApiClient | null = null

  /**
   * Obtém ou cria o cliente da API NFL
   */
  getApiClient(): NflApiClient {
    if (!this.apiClient) {
      this.apiClient = getNflApiClient()
    }
    return this.apiClient
  }

  /**
   * Obtém ou cria o repositório de times
   */
  getTeamRepository(): ITeamRepository {
    if (!this.teamRepository) {
      this.teamRepository = new NflTeamRepository(this.getApiClient())
    }
    return this.teamRepository
  }

  /**
   * Obtém ou cria o repositório de jogadores
   */
  getPlayerRepository(): IPlayerRepository {
    if (!this.playerRepository) {
      this.playerRepository = new NflPlayerRepository(this.getApiClient())
    }
    return this.playerRepository
  }

  /**
   * Reseta todas as dependências (útil para testes)
   */
  reset(): void {
    this.teamRepository = null
    this.playerRepository = null
    this.apiClient = null
  }
}

/**
 * Instância singleton do container
 */
const container = new DependencyContainer()

/**
 * Obtém a instância do container de dependências
 */
export function getContainer(): DependencyContainer {
  return container
}
