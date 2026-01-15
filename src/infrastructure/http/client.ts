/**
 * HTTP Client genérico com tratamento de erros
 * Preparado para expansão futura (NCAAF, etc.)
 */

import { ApiErrorCode } from '@/shared/types'
import type { ApiError } from '@/shared/types'

export interface HttpClientConfig {
  baseUrl: string
  apiKey: string
  defaultHeaders?: Record<string, string>
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
}

export class HttpClientError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'HttpClientError'
  }

  toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
    }
  }
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly apiKey: string
  private readonly defaultHeaders: Record<string, string>

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    }
  }

  /**
   * Constrói a URL com query params
   */
  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Trata erros da resposta HTTP
   */
  private async handleResponseError(response: Response): Promise<never> {
    const status = response.status as ApiErrorCode

    const errorMessages: Record<number, string> = {
      [ApiErrorCode.UNAUTHORIZED]: 'API key inválida ou endpoint não disponível no seu plano',
      [ApiErrorCode.BAD_REQUEST]: 'Requisição inválida. Verifique os parâmetros',
      [ApiErrorCode.NOT_FOUND]: 'Recurso não encontrado',
      [ApiErrorCode.RATE_LIMITED]: 'Limite de requisições excedido. Aguarde um momento',
      [ApiErrorCode.SERVER_ERROR]: 'Erro interno do servidor. Tente novamente mais tarde',
      [ApiErrorCode.SERVICE_UNAVAILABLE]: 'Serviço temporariamente indisponível',
    }

    const message = errorMessages[status] || `Erro HTTP: ${status}`
    throw new HttpClientError(status, message)
  }

  /**
   * Realiza requisição GET
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        Authorization: this.apiKey,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      await this.handleResponseError(response)
    }

    return response.json() as Promise<T>
  }
}

/**
 * Factory para criar instância do HttpClient
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  return new HttpClient(config)
}
