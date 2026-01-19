/**
 * Use Case: Buscar times da NFL
 * Refatorado para usar repositórios e Dependency Injection
 */

import type { Team } from '@/domain/entities'
import { getContainer } from '@/application/dependencies'

/**
 * Busca todos os times da NFL
 */
export async function getTeams(): Promise<Team[]> {
  const repository = getContainer().getTeamRepository()
  return repository.findAll()
}

/**
 * Busca um time específico pelo ID
 */
export async function getTeamById(id: number): Promise<Team | null> {
  const repository = getContainer().getTeamRepository()
  return repository.findById(id)
}

/**
 * Busca times por conferência
 */
export async function getTeamsByConference(conference: 'AFC' | 'NFC'): Promise<Team[]> {
  const repository = getContainer().getTeamRepository()
  return repository.findByConference(conference)
}

/**
 * Busca times por divisão
 */
export async function getTeamsByDivision(
  conference: 'AFC' | 'NFC',
  division: 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'
): Promise<Team[]> {
  const repository = getContainer().getTeamRepository()
  return repository.findByDivision(conference, division)
}
