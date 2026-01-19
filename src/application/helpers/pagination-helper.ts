/**
 * Helpers para paginação
 * Extrai lógica comum de paginação para evitar duplicação
 */

import type { PaginationMetaDTO } from '@/shared/types'
import { mapPaginationMeta } from '@/shared/types'

/**
 * Mapeia metadados de paginação de DTO para domain
 * @param dto Metadados de paginação em formato DTO
 * @returns Metadados de paginação em formato domain
 */
export function mapPagination(dto: PaginationMetaDTO) {
  return mapPaginationMeta(dto)
}
