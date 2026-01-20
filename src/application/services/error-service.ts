/**
 * Serviço centralizado de tratamento de erros
 * Fornece funções utilitárias para lidar com erros de forma consistente
 */

import type { DomainError } from '@/domain/errors'
import { mapHttpErrorToDomain } from '@/shared/utils'

/**
 * Trata um erro desconhecido e retorna um erro de domínio
 * @param error Erro a ser tratado
 * @returns Erro de domínio mapeado
 */
export function handleError(error: unknown): DomainError {
  return mapHttpErrorToDomain(error)
}

/**
 * Verifica se um erro é de um tipo específico
 */
export function isDomainError(error: unknown): error is DomainError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as DomainError).code === 'string'
  )
}

/**
 * Extrai a mensagem de erro de forma segura
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (isDomainError(error)) {
    return error.message
  }
  return 'Erro desconhecido ocorreu'
}

/**
 * Extrai o código de erro de forma segura
 */
export function getErrorCode(error: unknown): string {
  if (isDomainError(error)) {
    return error.code
  }
  return 'UNKNOWN_ERROR'
}
