/**
 * Mapeador de erros HTTP para erros de domínio
 * Converte erros da camada de infrastructure para erros de domain
 */

import {
  TeamNotFoundError,
  PlayerNotFoundError,
  GameNotFoundError,
  UnauthorizedError,
  RateLimitError,
  ServerError,
  UnknownError,
  type DomainError,
} from '@/domain/errors'
import { HttpClientError } from '@/infrastructure/http/client'
import { ApiErrorCode } from '@/shared/types'

/**
 * Mapeia um erro HTTP para um erro de domínio
 */
export function mapHttpErrorToDomain(error: unknown): DomainError {
  // Se já é um erro de domínio, retorna como está
  if (error instanceof DomainError) {
    return error
  }

  // Se é um HttpClientError, mapeia baseado no código
  if (error instanceof HttpClientError) {
    switch (error.code) {
      case ApiErrorCode.UNAUTHORIZED:
        return new UnauthorizedError(error.message)
      case ApiErrorCode.NOT_FOUND:
        // Tenta inferir o tipo de recurso pela mensagem ou contexto
        return new NotFoundError('Recurso', 'desconhecido')
      case ApiErrorCode.RATE_LIMITED:
        return new RateLimitError(error.message)
      case ApiErrorCode.SERVER_ERROR:
      case ApiErrorCode.SERVICE_UNAVAILABLE:
        return new ServerError(error.message)
      case ApiErrorCode.BAD_REQUEST:
        return new ValidationError(error.message)
      default:
        return new ServerError(error.message)
    }
  }

  // Se é um Error padrão, converte para UnknownError
  if (error instanceof Error) {
    return new UnknownError(error)
  }

  // Fallback para qualquer outro tipo
  return new UnknownError(error)
}

/**
 * Mapeia um erro HTTP 404 para um erro de domínio específico baseado no recurso
 */
export function mapNotFoundError(resource: 'team' | 'player' | 'game', id: number): DomainError {
  switch (resource) {
    case 'team':
      return new TeamNotFoundError(id)
    case 'player':
      return new PlayerNotFoundError(id)
    case 'game':
      return new GameNotFoundError(id)
    default:
      return new NotFoundError(resource, id)
  }
}
