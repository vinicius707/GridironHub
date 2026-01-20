/**
 * Helper para mapeamento de IDs entre balldontlie e ESPN
 * 
 * Estratégia de mapeamento:
 * - Times: Usar abbreviation como chave comum (ex: "PHI")
 * - Jogadores: Requer busca mais complexa (nome + time) - será implementado conforme necessário
 */

import type { Team } from '@/domain/entities'

/**
 * Mapa de abreviações de times para IDs da ESPN
 * Este mapa será populado dinamicamente através da busca de times
 */
const teamAbbreviationToEspnId = new Map<string, string>()

/**
 * Cache de times da balldontlie para lookup rápido
 */
let teamsCache: Team[] | null = null

/**
 * Popula o cache de times e cria o mapeamento de IDs
 * @param teams Array de times da balldontlie
 */
export function populateTeamIdMapping(teams: Team[]): void {
  teamsCache = teams
  // Limpa o mapa anterior
  teamAbbreviationToEspnId.clear()
}

/**
 * Busca o ID da ESPN de um time baseado na abreviação
 * @param abbreviation Abreviação do time (ex: "PHI")
 * @returns ID do time na ESPN ou null se não encontrado
 */
export async function getEspnTeamIdByAbbreviation(
  abbreviation: string
): Promise<string | null> {
  // Se já temos no cache, retorna
  if (teamAbbreviationToEspnId.has(abbreviation)) {
    return teamAbbreviationToEspnId.get(abbreviation) || null
  }

  // Se não temos o cache de times, retorna null
  // O mapeamento será feito na primeira busca de roster
  return null
}

/**
 * Define o ID da ESPN para uma abreviação de time
 * @param abbreviation Abreviação do time
 * @param espnId ID do time na ESPN
 */
export function setEspnTeamId(abbreviation: string, espnId: string): void {
  teamAbbreviationToEspnId.set(abbreviation, espnId)
}

/**
 * Busca times da balldontlie por abreviação
 * @param abbreviation Abreviação do time
 * @returns Time encontrado ou null
 */
export function getTeamByAbbreviation(abbreviation: string): Team | null {
  if (!teamsCache) {
    return null
  }
  return teamsCache.find((team) => team.abbreviation === abbreviation) || null
}

/**
 * Limpa o cache de mapeamento (útil para testes)
 */
export function clearIdMapping(): void {
  teamAbbreviationToEspnId.clear()
  teamsCache = null
}

/**
 * Converte ID do time balldontlie (number) para tentar encontrar o ID ESPN
 * Requer que o cache de times esteja populado
 * @param balldontlieTeamId ID do time na balldontlie
 * @returns ID do time na ESPN ou null se não encontrado
 */
export async function getEspnTeamIdFromBalldontlie(
  balldontlieTeamId: number
): Promise<string | null> {
  if (!teamsCache) {
    return null
  }

  const team = teamsCache.find((t) => t.id === balldontlieTeamId)
  if (!team) {
    return null
  }

  return getEspnTeamIdByAbbreviation(team.abbreviation)
}
