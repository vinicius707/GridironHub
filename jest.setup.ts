/**
 * Jest Setup - Configurações globais de teste
 */

import '@testing-library/jest-dom'

// Mock do fetch global
global.fetch = jest.fn()

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks()
})

// Mock das variáveis de ambiente
process.env.BALLDONTLIE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.balldontlie.io/v1'
