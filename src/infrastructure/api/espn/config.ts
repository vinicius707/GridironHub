/**
 * Configurações da ESPN API
 * Documentação: https://sports.core.api.espn.com/
 */

export const ESPN_CORE_BASE_URL = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl'

/**
 * Temporada atual da NFL (2024)
 * TODO: Atualizar automaticamente ou tornar configurável
 */
export const DEFAULT_SEASON = 2024

/**
 * Configuração da ESPN API
 */
export interface EspnApiConfig {
  baseUrl?: string
  season?: number
}
