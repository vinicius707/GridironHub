/**
 * Entidade Team - Time da NFL
 * Baseado na API balldontlie: GET /nfl/v1/teams
 */

export type Conference = 'AFC' | 'NFC'

export type Division = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'

export interface Team {
  id: number
  conference: Conference
  division: Division
  location: string // Ex: "Philadelphia"
  name: string // Ex: "Eagles"
  fullName: string // Ex: "Philadelphia Eagles"
  abbreviation: string // Ex: "PHI"
}

/**
 * DTO da API (snake_case) para mapeamento
 */
export interface TeamDTO {
  id: number
  conference: Conference
  division: Division
  location: string
  name: string
  full_name: string
  abbreviation: string
}

/**
 * Mapper: DTO -> Entity
 */
export function mapTeamFromDTO(dto: TeamDTO): Team {
  return {
    id: dto.id,
    conference: dto.conference,
    division: dto.division,
    location: dto.location,
    name: dto.name,
    fullName: dto.full_name,
    abbreviation: dto.abbreviation,
  }
}

/**
 * Mapper: Entity -> DTO (para futuras necessidades)
 */
export function mapTeamToDTO(team: Team): TeamDTO {
  return {
    id: team.id,
    conference: team.conference,
    division: team.division,
    location: team.location,
    name: team.name,
    full_name: team.fullName,
    abbreviation: team.abbreviation,
  }
}
