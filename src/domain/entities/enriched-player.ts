/**
 * Entidade EnrichedPlayer - Jogador enriquecido com dados de múltiplas fontes
 * Combina dados da balldontlie API (Player) com dados da ESPN (RosterPlayer, PlayerStatistics)
 */

import type { Player } from './player'
import type { RosterPlayer } from './roster'
import type { PlayerStatistics } from './player-stats'

/**
 * Jogador enriquecido com dados de múltiplas fontes
 */
export interface EnrichedPlayer {
  // Dados base da balldontlie API
  player: Player

  // Dados adicionais da ESPN (opcionais)
  rosterData?: RosterPlayer
  statistics?: PlayerStatistics
}

/**
 * Factory: Cria EnrichedPlayer a partir de Player base
 */
export function createEnrichedPlayer(player: Player): EnrichedPlayer {
  return {
    player,
  }
}

/**
 * Enriquece um Player com dados do roster
 */
export function enrichPlayerWithRoster(
  player: Player,
  rosterPlayer: RosterPlayer
): EnrichedPlayer {
  return {
    player,
    rosterData: rosterPlayer,
  }
}

/**
 * Enriquece um Player com estatísticas
 */
export function enrichPlayerWithStats(
  player: Player,
  statistics: PlayerStatistics
): EnrichedPlayer {
  return {
    player,
    statistics,
  }
}

/**
 * Enriquece um Player com todos os dados disponíveis
 */
export function enrichPlayer(
  player: Player,
  rosterPlayer?: RosterPlayer,
  statistics?: PlayerStatistics
): EnrichedPlayer {
  return {
    player,
    rosterData: rosterPlayer,
    statistics,
  }
}

/**
 * Helper: Obtém número da camisa (prioriza ESPN, depois balldontlie)
 */
export function getJerseyNumber(enriched: EnrichedPlayer): string | undefined {
  return enriched.rosterData?.jersey || enriched.player.jerseyNumber || undefined
}

/**
 * Helper: Obtém posição formatada (prioriza ESPN, depois balldontlie)
 */
export function getPositionDisplay(enriched: EnrichedPlayer): string {
  return (
    enriched.rosterData?.position?.abbreviation ||
    enriched.player.positionAbbreviation ||
    enriched.player.position ||
    'N/A'
  )
}

/**
 * Helper: Obtém foto do jogador (headshot da ESPN ou fallback)
 */
export function getPlayerHeadshot(enriched: EnrichedPlayer): string | undefined {
  return enriched.rosterData?.headshot?.href
}

/**
 * Helper: Verifica se o jogador tem estatísticas disponíveis
 */
export function hasStatistics(enriched: EnrichedPlayer): boolean {
  return (
    enriched.statistics !== undefined &&
    enriched.statistics.splits.length > 0 &&
    enriched.statistics.splits.some((split) => split.categories.length > 0)
  )
}
