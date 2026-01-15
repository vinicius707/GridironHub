/**
 * Use Case: Buscar times da NFL
 */

import { getNflApiClient } from '@/infrastructure/api/nfl/client'
import type { Team } from '@/domain/entities'
import { mapTeamFromDTO } from '@/domain/entities'

/**
 * Busca todos os times da NFL
 */
export async function getTeams(): Promise<Team[]> {
  const client = getNflApiClient()
  const response = await client.getTeams()

  return response.data.map(mapTeamFromDTO)
}

/**
 * Busca um time específico pelo ID
 */
export async function getTeamById(id: number): Promise<Team> {
  const client = getNflApiClient()
  const response = await client.getTeamById(id)

  return mapTeamFromDTO(response.data)
}

/**
 * Busca times por conferência
 */
export async function getTeamsByConference(conference: 'AFC' | 'NFC'): Promise<Team[]> {
  const teams = await getTeams()
  return teams.filter((team) => team.conference === conference)
}

/**
 * Busca times por divisão
 */
export async function getTeamsByDivision(
  conference: 'AFC' | 'NFC',
  division: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'
): Promise<Team[]> {
  const teams = await getTeams()
  return teams.filter((team) => team.conference === conference && team.division === division)
}
