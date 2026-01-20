/**
 * Container de Dependency Injection
 * Centraliza a criação de dependências e mantém instâncias singletons
 */

import type {
  ITeamRepository,
  IPlayerRepository,
  IRosterRepository,
  IPlayerStatsRepository,
} from '@/domain/repositories'
import {
  NflTeamRepository,
  NflPlayerRepository,
  EspnRosterRepository,
  EspnPlayerStatsRepository,
} from '@/infrastructure/repositories'
import type { NflApiClient } from '@/infrastructure/api/nfl/client'
import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { EspnApiClient } from '@/infrastructure/api/espn'
import { getEspnApiClient } from '@/infrastructure/api/espn'

/**
 * Container de dependências
 * Mantém instâncias singleton dos repositórios
 */
export class DependencyContainer {
  private teamRepository: ITeamRepository | null = null
  private playerRepository: IPlayerRepository | null = null
  private rosterRepository: IRosterRepository | null = null
  private playerStatsRepository: IPlayerStatsRepository | null = null
  private apiClient: NflApiClient | null = null
  private espnApiClient: EspnApiClient | null = null

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
   * Obtém ou cria o cliente da API ESPN
   */
  getEspnApiClient(): EspnApiClient {
    if (!this.espnApiClient) {
      this.espnApiClient = getEspnApiClient()
    }
    return this.espnApiClient
  }

  /**
   * Obtém ou cria o repositório de rosters
   */
  getRosterRepository(): IRosterRepository {
    if (!this.rosterRepository) {
      this.rosterRepository = new EspnRosterRepository(this.getEspnApiClient())
    }
    return this.rosterRepository
  }

  /**
   * Obtém ou cria o repositório de estatísticas de jogadores
   */
  getPlayerStatsRepository(): IPlayerStatsRepository {
    if (!this.playerStatsRepository) {
      this.playerStatsRepository = new EspnPlayerStatsRepository(
        this.getEspnApiClient()
      )
    }
    return this.playerStatsRepository
  }

  /**
   * Reseta todas as dependências (útil para testes)
   */
  reset(): void {
    this.teamRepository = null
    this.playerRepository = null
    this.rosterRepository = null
    this.playerStatsRepository = null
    this.apiClient = null
    this.espnApiClient = null
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
