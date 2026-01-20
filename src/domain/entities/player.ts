/**
 * Entidade Player - Jogador da NFL
 * Baseado na API balldontlie: GET /nfl/v1/players
 */

import type { Team, TeamDTO, mapTeamFromDTO } from './team'

export interface Player {
  id: number
  firstName: string
  lastName: string
  position: string // Ex: "Quarterback"
  positionAbbreviation: string // Ex: "QB"
  height: string // Ex: "6'5\""
  weight: string // Ex: "244 lbs"
  jerseyNumber: string // Ex: "1"
  college: string // Ex: "Oklahoma"
  experience: string // Ex: "6"
  age: number // Ex: 29
  team: Team | null
}

/**
 * DTO da API (snake_case) para mapeamento
 */
export interface PlayerDTO {
  id: number
  first_name: string
  last_name: string
  position: string
  position_abbreviation: string
  height: string
  weight: string
  jersey_number: string
  college: string
  experience: string
  age: number
  team: TeamDTO | null
}

/**
 * Mapper: DTO -> Entity
 */
export function mapPlayerFromDTO(dto: PlayerDTO, teamMapper: typeof mapTeamFromDTO): Player {
  return {
    id: dto.id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    position: dto.position,
    positionAbbreviation: dto.position_abbreviation,
    height: dto.height,
    weight: dto.weight,
    jerseyNumber: dto.jersey_number,
    college: dto.college,
    experience: dto.experience,
    age: dto.age,
    team: dto.team ? teamMapper(dto.team) : null,
  }
}

/**
 * Helper: Nome completo do jogador
 */
export function getPlayerFullName(player: Player): string {
  return `${player.firstName} ${player.lastName}`
}

/**
 * Helper: Posição formatada
 */
export function getPlayerPositionDisplay(player: Player): string {
  return player.positionAbbreviation || player.position
}
