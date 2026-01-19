/**
 * Helpers para mapeamento de DTOs para entidades
 * Extrai lógica comum de mapeamento para evitar duplicação
 */

import type { PaginatedResponse, PaginatedResponseDTO, PaginationMetaDTO } from '@/shared/types'
import { mapPaginationMeta } from '@/shared/types'

/**
 * Mapeia uma resposta paginada de DTOs para entidades
 * @param response Resposta paginada com DTOs
 * @param mapper Função de mapeamento DTO -> Entity
 * @returns Resposta paginada com entidades
 */
export function mapPaginatedResponse<TDto, TEntity>(
  response: PaginatedResponseDTO<TDto>,
  mapper: (dto: TDto) => TEntity
): PaginatedResponse<TEntity> {
  return {
    data: response.data.map(mapper),
    meta: mapPaginationMeta(response.meta),
  }
}

/**
 * Mapeia uma lista de DTOs para entidades
 * @param dtos Lista de DTOs
 * @param mapper Função de mapeamento DTO -> Entity
 * @returns Lista de entidades
 */
export function mapList<TDto, TEntity>(dtos: TDto[], mapper: (dto: TDto) => TEntity): TEntity[] {
  return dtos.map(mapper)
}
