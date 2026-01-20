/**
 * Cliente da ESPN API (não oficial)
 * Documentação: https://sports.core.api.espn.com/
 * 
 * Nota: Esta API não é oficial e não requer autenticação
 */

import { ESPN_CORE_BASE_URL, DEFAULT_SEASON, type EspnApiConfig } from './config'

/**
 * DTOs da ESPN API
 */

/**
 * Time da ESPN
 */
export interface EspnTeamDTO {
  id: string
  uid: string
  displayName: string
  abbreviation: string
  name: string
  logos?: Array<{
    href: string
    alt?: string
  }>
  links?: Array<{
    href: string
    text?: string
  }>
}

/**
 * Referência a um recurso da ESPN API
 */
export interface EspnRefDTO {
  $ref: string
}

/**
 * Resposta paginada da ESPN API
 */
export interface EspnPaginatedResponseDTO {
  count: number
  pageIndex: number
  pageSize: number
  pageCount: number
  items: Array<EspnRefDTO | EspnTeamDTO>
}

/**
 * Resposta da API para lista de times
 * A ESPN pode retornar diretamente os times ou referências
 */
export type EspnTeamsResponseDTO = EspnPaginatedResponseDTO

/**
 * Jogador da ESPN (roster)
 */
export interface EspnRosterPlayerDTO {
  id: string
  uid: string
  displayName: string
  shortName: string
  jersey?: string
  position?: {
    id: string
    name: string
    displayName: string
    abbreviation: string
  }
  headshot?: {
    href: string
    alt?: string
  }
  links?: Array<{
    href: string
    text?: string
  }>
}

/**
 * Resposta da API para roster de time
 */
export interface EspnRosterResponseDTO {
  id: string
  uid: string
  athletes?: {
    id: string
    items: EspnRosterPlayerDTO[]
  }
}

/**
 * Estatística individual de um jogador
 */
export interface EspnPlayerStatDTO {
  name: string
  displayName: string
  shortDisplayName: string
  description: string
  abbreviation: string
  value: number | string
  displayValue: string
}

/**
 * Categoria de estatísticas
 */
export interface EspnStatCategoryDTO {
  name: string
  displayName: string
  abbreviation: string
  stats: EspnPlayerStatDTO[]
}

/**
 * Split de estatísticas (ex: regular season, postseason)
 */
export interface EspnStatSplitDTO {
  displayName: string
  categories: EspnStatCategoryDTO[]
}

/**
 * Resposta da API para estatísticas de jogador
 */
export interface EspnPlayerStatsResponseDTO {
  id: string
  uid: string
  displayName: string
  splits?: {
    id: string
    name: string
    abbreviation: string
    categories: EspnStatCategoryDTO[]
  }[]
}

/**
 * Cliente da ESPN API
 */
export class EspnApiClient {
  private readonly baseUrl: string
  private readonly season: number

  constructor(config: EspnApiConfig = {}) {
    this.baseUrl = config.baseUrl || ESPN_CORE_BASE_URL
    this.season = config.season || DEFAULT_SEASON
  }

  /**
   * Realiza uma requisição GET simples (ESPN não requer autenticação)
   */
  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
  }

  // ============================================
  // TEAMS
  // ============================================

  /**
   * Busca todos os times da NFL
   */
  async getTeams(): Promise<EspnTeamsResponseDTO> {
    const url = `${this.baseUrl}/teams`
    return this.fetchJson<EspnTeamsResponseDTO>(url)
  }

  /**
   * Busca um time específico pelo ID
   */
  async getTeamById(teamId: string): Promise<EspnTeamDTO> {
    const url = `${this.baseUrl}/teams/${teamId}`
    return this.fetchJson<EspnTeamDTO>(url)
  }

  // ============================================
  // ROSTERS
  // ============================================

  /**
   * Busca o roster (elencos) de um time
   * @param teamId ID do time na ESPN
   * @param season Temporada (padrão: DEFAULT_SEASON)
   */
  async getTeamRoster(teamId: string, season?: number): Promise<EspnRosterResponseDTO> {
    const seasonParam = season || this.season
    const url = `${this.baseUrl}/seasons/${seasonParam}/teams/${teamId}?enable=roster`
    return this.fetchJson<EspnRosterResponseDTO>(url)
  }

  // ============================================
  // PLAYER STATISTICS
  // ============================================

  /**
   * Busca estatísticas de um jogador
   * @param playerId ID do jogador na ESPN
   * @param season Temporada (padrão: DEFAULT_SEASON)
   */
  async getPlayerStatistics(
    playerId: string,
    season?: number
  ): Promise<EspnPlayerStatsResponseDTO> {
    const seasonParam = season || this.season
    const url = `${this.baseUrl}/seasons/${seasonParam}/athletes/${playerId}/statistics`
    return this.fetchJson<EspnPlayerStatsResponseDTO>(url)
  }
}

/**
 * Factory para criar instância do EspnApiClient
 */
export function createEspnApiClient(config?: EspnApiConfig): EspnApiClient {
  return new EspnApiClient(config)
}

/**
 * Instância singleton do cliente (lazy initialization)
 */
let espnApiClientInstance: EspnApiClient | null = null

/**
 * Obtém a instância singleton do ESPN API Client
 */
export function getEspnApiClient(): EspnApiClient {
  if (!espnApiClientInstance) {
    espnApiClientInstance = createEspnApiClient()
  }

  return espnApiClientInstance
}
