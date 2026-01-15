import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Caminho para o app Next.js
  dir: './',
})

const config: Config = {
  // Ambiente de teste
  testEnvironment: 'jest-environment-jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/layout.tsx',
    '!src/app/page.tsx', // Página padrão do Next.js
    '!src/infrastructure/api/nfl/client.ts', // Cliente da API (testes de integração)
  ],

  // Diretório de cobertura
  coverageDirectory: 'coverage',

  // Thresholds de cobertura (ajustado para MVP)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Mapeamento de módulos (alias)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Padrões de arquivos de teste
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],

  // Arquivos a ignorar
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],

  // Transformações
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Verbose output
  verbose: true,
}

export default createJestConfig(config)
