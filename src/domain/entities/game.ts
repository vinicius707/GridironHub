/**
 * Entidade Game - Partida da NFL
 * Baseado na API balldontlie: GET /nfl/v1/games
 */

import type { Team, TeamDTO, mapTeamFromDTO } from './team'

export type GameStatus = 'Final' | 'In Progress' | 'Scheduled' | string

export interface Game {
  id: number
  visitorTeam: Team
  homeTeam: Team
  homeTeamScore: number
  visitorTeamScore: number
  season: number // Ex: 2024
  postseason: boolean
  status: GameStatus
  week: number
  time: string // Ex: "8:20 PM ET"
  date: string // Ex: "2024-09-05"
}

/**
 * DTO da API (snake_case) para mapeamento
 */
export interface GameDTO {
  id: number
  visitor_team: TeamDTO
  home_team: TeamDTO
  home_team_score: number
  visitor_team_score: number
  season: number
  postseason: boolean
  status: GameStatus
  week: number
  time: string
  date: string
}

/**
 * Mapper: DTO -> Entity
 */
export function mapGameFromDTO(dto: GameDTO, teamMapper: typeof mapTeamFromDTO): Game {
  return {
    id: dto.id,
    visitorTeam: teamMapper(dto.visitor_team),
    homeTeam: teamMapper(dto.home_team),
    homeTeamScore: dto.home_team_score,
    visitorTeamScore: dto.visitor_team_score,
    season: dto.season,
    postseason: dto.postseason,
    status: dto.status,
    week: dto.week,
    time: dto.time,
    date: dto.date,
  }
}

/**
 * Helper: Verifica se o jogo já terminou
 */
export function isGameFinished(game: Game): boolean {
  return game.status === 'Final'
}

/**
 * Helper: Verifica se o jogo está em andamento
 */
export function isGameInProgress(game: Game): boolean {
  return game.status === 'In Progress'
}

/**
 * Helper: Verifica se o jogo está agendado
 */
export function isGameScheduled(game: Game): boolean {
  return game.status === 'Scheduled'
}

/**
 * Helper: Retorna o time vencedor (null se empate ou não finalizado)
 */
export function getGameWinner(game: Game): Team | null {
  if (!isGameFinished(game)) return null
  if (game.homeTeamScore === game.visitorTeamScore) return null

  return game.homeTeamScore > game.visitorTeamScore ? game.homeTeam : game.visitorTeam
}

/**
 * Helper: Formata o placar do jogo
 */
export function getGameScoreDisplay(game: Game): string {
  if (isGameScheduled(game)) {
    return game.time
  }
  return `${game.visitorTeamScore} - ${game.homeTeamScore}`
}

/**
 * Helper: Formata a data do jogo
 */
export function getGameDateDisplay(game: Game): string {
  const date = new Date(game.date)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}
