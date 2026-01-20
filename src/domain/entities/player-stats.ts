/**
 * Entidade PlayerStatistics - Estatísticas de um jogador
 * Baseado na API ESPN: GET /seasons/{season}/athletes/{playerId}/statistics
 */

/**
 * Estatística individual
 */
export interface PlayerStat {
  name: string // Nome técnico da estatística
  displayName: string // Nome para exibição
  shortDisplayName: string // Nome curto
  description: string // Descrição
  abbreviation: string // Abreviação
  value: number | string // Valor bruto
  displayValue: string // Valor formatado para exibição
}

/**
 * Categoria de estatísticas (ex: Passing, Rushing, Receiving)
 */
export interface StatCategory {
  name: string
  displayName: string
  abbreviation: string
  stats: PlayerStat[]
}

/**
 * Split de estatísticas (ex: Regular Season, Postseason, Total)
 */
export interface StatSplit {
  displayName: string
  categories: StatCategory[]
}

/**
 * Estatísticas completas de um jogador
 */
export interface PlayerStatistics {
  playerId: string // ID do jogador na ESPN
  season: number // Temporada
  displayName: string // Nome do jogador
  splits: StatSplit[] // Diferentes splits de estatísticas
}

/**
 * DTO da ESPN API para estatística individual
 */
export interface EspnPlayerStatDTO {
  name: string
  displayName: string
  shortDisplayName: string
  description: string
  abbreviation: string
  value: number | string
  displayValue: string
}

/**
 * DTO da ESPN API para categoria de estatísticas
 */
export interface EspnStatCategoryDTO {
  name: string
  displayName: string
  abbreviation: string
  stats: EspnPlayerStatDTO[]
}

/**
 * DTO da ESPN API para split de estatísticas
 */
export interface EspnStatSplitDTO {
  displayName: string
  categories: EspnStatCategoryDTO[]
}

/**
 * DTO da ESPN API para resposta de estatísticas
 */
export interface EspnPlayerStatsResponseDTO {
  id: string
  uid: string
  displayName: string
  splits?: {
    id: string
    name: string
    abbreviation: string
    categories: EspnStatCategoryDTO[]
  }[]
}

/**
 * Mapper: DTO da ESPN -> Entity PlayerStat
 */
export function mapPlayerStatFromDTO(dto: EspnPlayerStatDTO): PlayerStat {
  return {
    name: dto.name,
    displayName: dto.displayName,
    shortDisplayName: dto.shortDisplayName,
    description: dto.description,
    abbreviation: dto.abbreviation,
    value: dto.value,
    displayValue: dto.displayValue,
  }
}

/**
 * Mapper: DTO da ESPN -> Entity StatCategory
 */
export function mapStatCategoryFromDTO(dto: EspnStatCategoryDTO): StatCategory {
  return {
    name: dto.name,
    displayName: dto.displayName,
    abbreviation: dto.abbreviation,
    stats: dto.stats.map(mapPlayerStatFromDTO),
  }
}

/**
 * Mapper: DTO da ESPN -> Entity StatSplit
 */
export function mapStatSplitFromDTO(dto: {
  displayName: string
  categories: EspnStatCategoryDTO[]
}): StatSplit {
  return {
    displayName: dto.displayName,
    categories: dto.categories.map(mapStatCategoryFromDTO),
  }
}

/**
 * Mapper: DTO da ESPN -> Entity PlayerStatistics
 */
export function mapPlayerStatisticsFromDTO(
  dto: EspnPlayerStatsResponseDTO,
  season: number
): PlayerStatistics {
  const splits: StatSplit[] =
    dto.splits?.map((split) =>
      mapStatSplitFromDTO({
        displayName: split.name || split.abbreviation,
        categories: split.categories,
      })
    ) || []

  return {
    playerId: dto.id,
    season,
    displayName: dto.displayName,
    splits,
  }
}

/**
 * Helper: Busca estatística por nome
 */
export function getStatByName(
  stats: PlayerStatistics,
  statName: string
): PlayerStat | undefined {
  for (const split of stats.splits) {
    for (const category of split.categories) {
      const stat = category.stats.find((s) => s.name === statName)
      if (stat) return stat
    }
  }
  return undefined
}

/**
 * Helper: Busca categoria de estatísticas por nome
 */
export function getCategoryByName(
  stats: PlayerStatistics,
  categoryName: string
): StatCategory | undefined {
  for (const split of stats.splits) {
    const category = split.categories.find(
      (c) => c.name === categoryName || c.abbreviation === categoryName
    )
    if (category) return category
  }
  return undefined
}

/**
 * Helper: Obtém todas as estatísticas de uma categoria específica
 */
export function getStatsByCategory(
  stats: PlayerStatistics,
  categoryName: string
): PlayerStat[] {
  const category = getCategoryByName(stats, categoryName)
  return category?.stats || []
}

/**
 * Helper: Calcula total de uma estatística específica
 */
export function getStatTotal(
  stats: PlayerStatistics,
  statName: string
): number {
  let total = 0
  for (const split of stats.splits) {
    for (const category of split.categories) {
      const stat = category.stats.find((s) => s.name === statName)
      if (stat && typeof stat.value === 'number') {
        total += stat.value
      }
    }
  }
  return total
}
