/**
 * Erros de domínio
 * Representa erros específicos do domínio da aplicação
 */

/**
 * Erro base do domínio
 */
export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    // Mantém o stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Erro quando um time não é encontrado
 */
export class TeamNotFoundError extends DomainError {
  readonly code = 'TEAM_NOT_FOUND'

  constructor(public readonly teamId: number) {
    super(`Time com ID ${teamId} não encontrado`)
  }
}

/**
 * Erro quando um jogador não é encontrado
 */
export class PlayerNotFoundError extends DomainError {
  readonly code = 'PLAYER_NOT_FOUND'

  constructor(public readonly playerId: number) {
    super(`Jogador com ID ${playerId} não encontrado`)
  }
}

/**
 * Erro quando uma partida não é encontrada
 */
export class GameNotFoundError extends DomainError {
  readonly code = 'GAME_NOT_FOUND'

  constructor(public readonly gameId: number) {
    super(`Partida com ID ${gameId} não encontrada`)
  }
}

/**
 * Erro genérico quando algo não é encontrado
 */
export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'

  constructor(resource: string, identifier: string | number) {
    super(`${resource} com identificador ${identifier} não encontrado`)
  }
}

/**
 * Erro quando há problema de autenticação/autorização
 */
export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED'

  constructor(message = 'Não autorizado. Verifique suas credenciais.') {
    super(message)
  }
}

/**
 * Erro quando há problema de validação
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'

  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message)
  }
}

/**
 * Erro quando o limite de requisições é excedido
 */
export class RateLimitError extends DomainError {
  readonly code = 'RATE_LIMIT_EXCEEDED'

  constructor(message = 'Limite de requisições excedido. Aguarde um momento.') {
    super(message)
  }
}

/**
 * Erro genérico de servidor
 */
export class ServerError extends DomainError {
  readonly code = 'SERVER_ERROR'

  constructor(message = 'Erro interno do servidor. Tente novamente mais tarde.') {
    super(message)
  }
}

/**
 * Erro desconhecido (fallback)
 */
export class UnknownError extends DomainError {
  readonly code = 'UNKNOWN_ERROR'

  constructor(public readonly originalError: unknown) {
    super(originalError instanceof Error ? originalError.message : 'Erro desconhecido ocorreu')
  }
}
