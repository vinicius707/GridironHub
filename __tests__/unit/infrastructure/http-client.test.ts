/**
 * Testes unitários para o HTTP Client
 */

import { HttpClient, HttpClientError, createHttpClient } from '@/infrastructure/http/client'
import { ApiErrorCode } from '@/shared/types'

describe('HttpClient', () => {
  const mockConfig = {
    baseUrl: 'https://api.example.com',
    apiKey: 'test-api-key',
  }

  let client: HttpClient

  beforeEach(() => {
    client = createHttpClient(mockConfig)
    jest.clearAllMocks()
  })

  describe('createHttpClient', () => {
    it('deve criar uma instância do HttpClient', () => {
      const instance = createHttpClient(mockConfig)
      expect(instance).toBeInstanceOf(HttpClient)
    })
  })

  describe('get', () => {
    it('deve fazer uma requisição GET com sucesso', async () => {
      const mockData = { data: [{ id: 1, name: 'Test' }] }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await client.get('/test')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'test-api-key',
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toEqual(mockData)
    })

    it('deve adicionar query params na URL', async () => {
      const mockData = { data: [] }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await client.get('/test', {
        params: {
          page: 1,
          limit: 10,
          search: 'test',
        },
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.anything()
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.anything()
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=test'),
        expect.anything()
      )
    })

    it('deve ignorar params undefined', async () => {
      const mockData = { data: [] }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await client.get('/test', {
        params: {
          page: 1,
          limit: undefined,
        },
      })

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0]?.[0] as string
      expect(calledUrl).toContain('page=1')
      expect(calledUrl).not.toContain('limit')
    })

    it('deve lançar HttpClientError para erro 401', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(client.get('/test')).rejects.toThrow(HttpClientError)
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      })

      await expect(client.get('/test')).rejects.toThrow(
        'API key inválida ou endpoint não disponível no seu plano'
      )
    })

    it('deve lançar HttpClientError para erro 429 (rate limit)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 429,
      })

      await expect(client.get('/test')).rejects.toThrow(HttpClientError)
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 429,
      })

      await expect(client.get('/test')).rejects.toThrow('Limite de requisições excedido')
    })

    it('deve lançar HttpClientError para erro 404', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(client.get('/test')).rejects.toThrow('Recurso não encontrado')
    })

    it('deve lançar HttpClientError para erro 500', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(client.get('/test')).rejects.toThrow('Erro interno do servidor')
    })
  })
})

describe('HttpClientError', () => {
  it('deve criar um erro com código e mensagem', () => {
    const error = new HttpClientError(ApiErrorCode.NOT_FOUND, 'Recurso não encontrado')

    expect(error.code).toBe(ApiErrorCode.NOT_FOUND)
    expect(error.message).toBe('Recurso não encontrado')
    expect(error.name).toBe('HttpClientError')
  })

  it('deve converter para ApiError', () => {
    const error = new HttpClientError(ApiErrorCode.RATE_LIMITED, 'Rate limit')
    const apiError = error.toApiError()

    expect(apiError.code).toBe(ApiErrorCode.RATE_LIMITED)
    expect(apiError.message).toBe('Rate limit')
  })
})
