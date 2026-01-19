/**
 * Tipo Result para tratamento funcional de erros
 * Permite representar sucesso ou falha de forma explícita
 */

/**
 * Result type: representa sucesso (Ok) ou falha (Err)
 * @template T Tipo do valor de sucesso
 * @template E Tipo do erro (padrão: Error)
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

/**
 * Cria um Result de sucesso
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data }
}

/**
 * Cria um Result de falha
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error }
}

/**
 * Verifica se o Result é sucesso
 */
export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true
}

/**
 * Verifica se o Result é falha
 */
export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false
}

/**
 * Mapeia o valor de sucesso do Result
 */
export function mapResult<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
  if (isOk(result)) {
    return ok(fn(result.data))
  }
  return result
}

/**
 * Mapeia o erro do Result
 */
export function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  if (isErr(result)) {
    return err(fn(result.error))
  }
  return result
}
