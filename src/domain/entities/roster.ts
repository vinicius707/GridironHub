/**
 * Entidade Roster - Elenco de um time
 * Baseado na API ESPN: GET /seasons/{season}/teams/{teamId}?enable=roster
 */

/**
 * Jogador em um roster
 */
export interface RosterPlayer {
  id: string // ID do jogador na ESPN
  displayName: string // Nome completo do jogador
  shortName: string // Nome curto
  jersey?: string // Número da camisa
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
}

/**
 * Roster de um time
 */
export interface Roster {
  teamId: string // ID do time na ESPN
  season: number // Temporada
  players: RosterPlayer[] // Lista de jogadores
}

/**
 * DTO da ESPN API para jogador no roster
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
 * DTO da ESPN API para resposta do roster
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
 * Mapper: DTO da ESPN -> Entity RosterPlayer
 */
export function mapRosterPlayerFromDTO(dto: EspnRosterPlayerDTO): RosterPlayer {
  return {
    id: dto.id,
    displayName: dto.displayName,
    shortName: dto.shortName,
    jersey: dto.jersey,
    position: dto.position
      ? {
          id: dto.position.id,
          name: dto.position.name,
          displayName: dto.position.displayName,
          abbreviation: dto.position.abbreviation,
        }
      : undefined,
    headshot: dto.headshot
      ? {
          href: dto.headshot.href,
          alt: dto.headshot.alt,
        }
      : undefined,
  }
}

/**
 * Mapper: DTO da ESPN -> Entity Roster
 */
export function mapRosterFromDTO(
  dto: EspnRosterResponseDTO,
  teamId: string,
  season: number
): Roster {
  const players = dto.athletes?.items?.map(mapRosterPlayerFromDTO) || []

  return {
    teamId,
    season,
    players,
  }
}

/**
 * Helper: Busca jogadores por posição no roster
 */
export function getPlayersByPosition(
  roster: Roster,
  positionAbbreviation: string
): RosterPlayer[] {
  return roster.players.filter(
    (player) => player.position?.abbreviation === positionAbbreviation
  )
}

/**
 * Helper: Busca jogador por número da camisa
 */
export function getPlayerByJersey(roster: Roster, jersey: string): RosterPlayer | undefined {
  return roster.players.find((player) => player.jersey === jersey)
}

/**
 * Helper: Ordena jogadores por número da camisa
 */
export function sortPlayersByJersey(players: RosterPlayer[]): RosterPlayer[] {
  return [...players].sort((a, b) => {
    const jerseyA = parseInt(a.jersey || '999', 10)
    const jerseyB = parseInt(b.jersey || '999', 10)
    return jerseyA - jerseyB
  })
}
