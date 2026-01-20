/**
 * Tipos compartilhados para a API balldontlie
 */

/**
 * Metadados de paginação (cursor-based)
 */
export interface PaginationMeta {
  nextCursor: number | null
  perPage: number
}

/**
 * DTO de paginação da API
 */
export interface PaginationMetaDTO {
  next_cursor: number | null
  per_page: number
}

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * DTO de resposta paginada da API
 */
export interface PaginatedResponseDTO<T> {
  data: T[]
  meta: PaginationMetaDTO
}

/**
 * Mapper: PaginationMetaDTO -> PaginationMeta
 */
export function mapPaginationMeta(dto: PaginationMetaDTO): PaginationMeta {
  return {
    nextCursor: dto.next_cursor,
    perPage: dto.per_page,
  }
}

/**
 * Parâmetros de paginação para requisições
 */
export interface PaginationParams {
  cursor?: number
  perPage?: number
}

/**
 * Códigos de erro da API
 */
export enum ApiErrorCode {
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  RATE_LIMITED = 429,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Erro da API
 */
export interface ApiError {
  code: ApiErrorCode
  message: string
}
