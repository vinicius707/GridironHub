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
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'application/use-cases/get-teams.ts:12',message:'getTeams: início',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  try {
    const client = getNflApiClient()
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'application/use-cases/get-teams.ts:14',message:'getTeams: cliente obtido, chamando API',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const response = await client.getTeams()
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'application/use-cases/get-teams.ts:16',message:'getTeams: resposta obtida',data:{teamsCount:response.data?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    return response.data.map(mapTeamFromDTO)
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'application/use-cases/get-teams.ts:catch',message:'getTeams: ERRO capturado',data:{errorMessage:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    throw error
  }
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
