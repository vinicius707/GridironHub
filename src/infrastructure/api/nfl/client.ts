/**
 * Cliente da NFL API (balldontlie)
 * Documentação: https://nfl.balldontlie.io/#nfl-api
 */

import type { HttpClient } from '@/infrastructure/http/client'
import { createHttpClient } from '@/infrastructure/http/client'
import type { TeamDTO, PlayerDTO, GameDTO } from '@/domain/entities'
import type { PaginatedResponseDTO, PaginationParams } from '@/shared/types'

const NFL_API_BASE_URL = 'https://api.balldontlie.io/nfl/v1'

export interface NflApiConfig {
  apiKey: string
}

export interface GetPlayersParams extends PaginationParams {
  teamIds?: number[]
  search?: string
  firstName?: string
  lastName?: string
}

export interface GetGamesParams extends PaginationParams {
  dates?: string[]
  seasons?: number[]
  teamIds?: number[]
  postseason?: boolean
  weeks?: number[]
}

/**
 * Resposta da API para lista de times
 */
interface TeamsResponseDTO {
  data: TeamDTO[]
}

/**
 * Resposta da API para um time específico
 */
interface TeamResponseDTO {
  data: TeamDTO
}

/**
 * Resposta da API para lista de jogadores
 */
type PlayersResponseDTO = PaginatedResponseDTO<PlayerDTO>

/**
 * Resposta da API para um jogador específico
 */
interface PlayerResponseDTO {
  data: PlayerDTO
}

/**
 * Resposta da API para lista de jogos
 */
type GamesResponseDTO = PaginatedResponseDTO<GameDTO>

/**
 * Resposta da API para um jogo específico
 */
interface GameResponseDTO {
  data: GameDTO
}

export class NflApiClient {
  private readonly http: HttpClient

  constructor(config: NflApiConfig) {
    this.http = createHttpClient({
      baseUrl: NFL_API_BASE_URL,
      apiKey: config.apiKey,
    })
  }

  // ============================================
  // TEAMS
  // ============================================

  /**
   * Busca todos os times da NFL
   */
  async getTeams(): Promise<TeamsResponseDTO> {
    return this.http.get<TeamsResponseDTO>('/teams')
  }

  /**
   * Busca um time específico pelo ID
   */
  async getTeamById(id: number): Promise<TeamResponseDTO> {
    return this.http.get<TeamResponseDTO>(`/teams/${id}`)
  }

  // ============================================
  // PLAYERS
  // ============================================

  /**
   * Busca jogadores com paginação e filtros
   */
  async getPlayers(params?: GetPlayersParams): Promise<PlayersResponseDTO> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      cursor: params?.cursor,
      per_page: params?.perPage,
      search: params?.search,
      first_name: params?.firstName,
      last_name: params?.lastName,
    }

    // Adiciona team_ids[] como parâmetros separados
    if (params?.teamIds?.length) {
      params.teamIds.forEach((id, index) => {
        queryParams[`team_ids[${index}]`] = id
      })
    }

    return this.http.get<PlayersResponseDTO>('/players', { params: queryParams })
  }

  /**
   * Busca um jogador específico pelo ID
   */
  async getPlayerById(id: number): Promise<PlayerResponseDTO> {
    return this.http.get<PlayerResponseDTO>(`/players/${id}`)
  }

  // ============================================
  // GAMES
  // ============================================

  /**
   * Busca jogos com paginação e filtros
   */
  async getGames(params?: GetGamesParams): Promise<GamesResponseDTO> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      cursor: params?.cursor,
      per_page: params?.perPage,
      postseason: params?.postseason,
    }

    // Adiciona arrays como parâmetros separados
    if (params?.dates?.length) {
      params.dates.forEach((date, index) => {
        queryParams[`dates[${index}]`] = date
      })
    }

    if (params?.seasons?.length) {
      params.seasons.forEach((season, index) => {
        queryParams[`seasons[${index}]`] = season
      })
    }

    if (params?.teamIds?.length) {
      params.teamIds.forEach((id, index) => {
        queryParams[`team_ids[${index}]`] = id
      })
    }

    if (params?.weeks?.length) {
      params.weeks.forEach((week, index) => {
        queryParams[`weeks[${index}]`] = week
      })
    }

    return this.http.get<GamesResponseDTO>('/games', { params: queryParams })
  }

  /**
   * Busca um jogo específico pelo ID
   */
  async getGameById(id: number): Promise<GameResponseDTO> {
    return this.http.get<GameResponseDTO>(`/games/${id}`)
  }
}

/**
 * Factory para criar instância do NflApiClient
 */
export function createNflApiClient(config: NflApiConfig): NflApiClient {
  return new NflApiClient(config)
}

/**
 * Instância singleton do cliente (lazy initialization)
 */
let nflApiClientInstance: NflApiClient | null = null

export function getNflApiClient(): NflApiClient {
  if (!nflApiClientInstance) {
    const apiKey = process.env.BALLDONTLIE_API_KEY

    if (!apiKey) {
      throw new Error('BALLDONTLIE_API_KEY não configurada nas variáveis de ambiente')
    }

    nflApiClientInstance = createNflApiClient({ apiKey })
  }

  return nflApiClientInstance
}
