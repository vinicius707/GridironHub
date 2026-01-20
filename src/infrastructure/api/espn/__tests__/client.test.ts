/**
 * Testes do ESPN API Client
 * 
 * Nota: Estes são testes de integração que fazem requisições reais para a ESPN API
 */

import { EspnApiClient, getEspnApiClient, createEspnApiClient } from '../client'

// Verifica se fetch está disponível no ambiente de teste
const isFetchAvailable = typeof fetch !== 'undefined'

describe('EspnApiClient', () => {
  let client: EspnApiClient

  beforeAll(() => {
    // Se fetch não estiver disponível no ambiente de teste, configura um mock básico
    if (!isFetchAvailable && typeof global !== 'undefined') {
      // @ts-expect-error - Adicionando fetch ao global para testes
      global.fetch = async (url: string) => {
        const response = await fetch(url)
        return response
      }
    }
  })

  beforeEach(() => {
    client = createEspnApiClient()
  })

  describe('getTeams', () => {
    it('deve buscar todos os times da NFL', async () => {
      // Skip se fetch não estiver disponível
      if (!isFetchAvailable) {
        console.warn('Fetch não disponível, pulando teste de integração')
        return
      }

      const response = await client.getTeams()

      expect(response).toBeDefined()
      expect(response.sports).toBeDefined()
      expect(Array.isArray(response.sports)).toBe(true)
      expect(response.sports.length).toBeGreaterThan(0)

      const league = response.sports[0]?.leagues?.[0]
      expect(league).toBeDefined()
      expect(league?.teams).toBeDefined()
      expect(Array.isArray(league?.teams)).toBe(true)
      expect(league?.teams.length).toBeGreaterThan(0)

      // Verifica estrutura de um time
      const team = league?.teams?.[0]?.team
      expect(team).toBeDefined()
      expect(team?.id).toBeDefined()
      expect(team?.displayName).toBeDefined()
      expect(team?.abbreviation).toBeDefined()
    }, 10000) // Timeout de 10 segundos para requisição real
  })

  describe('getTeamById', () => {
    it('deve buscar um time específico pelo ID', async () => {
      if (!isFetchAvailable) {
        console.warn('Fetch não disponível, pulando teste de integração')
        return
      }

      // Primeiro busca todos os times para obter um ID válido
      const teamsResponse = await client.getTeams()
      const firstTeam = teamsResponse.sports[0]?.leagues?.[0]?.teams?.[0]?.team

      if (!firstTeam?.id) {
        throw new Error('Nenhum time encontrado para teste')
      }

      const team = await client.getTeamById(firstTeam.id)

      expect(team).toBeDefined()
      expect(team.id).toBe(firstTeam.id)
      expect(team.displayName).toBeDefined()
      expect(team.abbreviation).toBeDefined()
    }, 10000)
  })

  describe('getTeamRoster', () => {
    it('deve buscar o roster de um time', async () => {
      if (!isFetchAvailable) {
        console.warn('Fetch não disponível, pulando teste de integração')
        return
      }

      // Primeiro busca todos os times para obter um ID válido
      const teamsResponse = await client.getTeams()
      const firstTeam = teamsResponse.sports[0]?.leagues?.[0]?.teams?.[0]?.team

      if (!firstTeam?.id) {
        throw new Error('Nenhum time encontrado para teste')
      }

      const roster = await client.getTeamRoster(firstTeam.id)

      expect(roster).toBeDefined()
      expect(roster.id).toBe(firstTeam.id)
      
      // O roster pode ou não ter atletas dependendo da temporada
      if (roster.athletes?.items) {
        expect(Array.isArray(roster.athletes.items)).toBe(true)
        
        // Se houver atletas, verifica a estrutura
        if (roster.athletes.items.length > 0) {
          const player = roster.athletes.items[0]
          expect(player.id).toBeDefined()
          expect(player.displayName).toBeDefined()
        }
      }
    }, 15000) // Timeout maior pois pode demorar mais
  })

  describe('getPlayerStatistics', () => {
    it('deve buscar estatísticas de um jogador', async () => {
      if (!isFetchAvailable) {
        console.warn('Fetch não disponível, pulando teste de integração')
        return
      }

      // Primeiro busca o roster de um time para obter um ID de jogador válido
      const teamsResponse = await client.getTeams()
      const firstTeam = teamsResponse.sports[0]?.leagues?.[0]?.teams?.[0]?.team

      if (!firstTeam?.id) {
        throw new Error('Nenhum time encontrado para teste')
      }

      const roster = await client.getTeamRoster(firstTeam.id)

      if (!roster.athletes?.items || roster.athletes.items.length === 0) {
        // Se não houver atletas no roster, pula o teste
        console.warn('Nenhum atleta encontrado no roster, pulando teste de estatísticas')
        return
      }

      const playerId = roster.athletes.items[0].id
      const stats = await client.getPlayerStatistics(playerId)

      expect(stats).toBeDefined()
      expect(stats.id).toBe(playerId)
      expect(stats.displayName).toBeDefined()
      
      // As estatísticas podem ou não estar disponíveis
      if (stats.splits) {
        expect(Array.isArray(stats.splits)).toBe(true)
      }
    }, 15000)
  })

  describe('singleton', () => {
    it('getEspnApiClient deve retornar a mesma instância', () => {
      const client1 = getEspnApiClient()
      const client2 = getEspnApiClient()

      expect(client1).toBe(client2)
    })
  })
})
