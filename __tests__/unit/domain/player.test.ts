/**
 * Testes unitários para a entidade Player
 */

import {
  mapPlayerFromDTO,
  getPlayerFullName,
  getPlayerPositionDisplay,
} from '@/domain/entities/player'
import { mapTeamFromDTO } from '@/domain/entities/team'
import type { PlayerDTO } from '@/domain/entities/player'
import type { TeamDTO } from '@/domain/entities/team'

describe('Player Entity', () => {
  const mockTeamDTO: TeamDTO = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    full_name: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockPlayerDTO: PlayerDTO = {
    id: 490,
    first_name: 'Jalen',
    last_name: 'Hurts',
    position: 'Quarterback',
    position_abbreviation: 'QB',
    height: '6\'1"',
    weight: '223 lbs',
    jersey_number: '1',
    college: 'Oklahoma',
    experience: '5',
    age: 26,
    team: mockTeamDTO,
  }

  describe('mapPlayerFromDTO', () => {
    it('deve mapear PlayerDTO para Player corretamente', () => {
      const result = mapPlayerFromDTO(mockPlayerDTO, mapTeamFromDTO)

      expect(result.id).toBe(490)
      expect(result.firstName).toBe('Jalen')
      expect(result.lastName).toBe('Hurts')
      expect(result.position).toBe('Quarterback')
      expect(result.positionAbbreviation).toBe('QB')
      expect(result.height).toBe('6\'1"')
      expect(result.weight).toBe('223 lbs')
      expect(result.jerseyNumber).toBe('1')
      expect(result.college).toBe('Oklahoma')
      expect(result.experience).toBe('5')
      expect(result.age).toBe(26)
    })

    it('deve converter snake_case para camelCase', () => {
      const result = mapPlayerFromDTO(mockPlayerDTO, mapTeamFromDTO)

      expect(result.firstName).toBe('Jalen')
      expect(result.lastName).toBe('Hurts')
      expect(result.positionAbbreviation).toBe('QB')
      expect(result.jerseyNumber).toBe('1')
      expect(result).not.toHaveProperty('first_name')
      expect(result).not.toHaveProperty('last_name')
    })

    it('deve mapear o time do jogador corretamente', () => {
      const result = mapPlayerFromDTO(mockPlayerDTO, mapTeamFromDTO)

      expect(result.team).not.toBeNull()
      expect(result.team?.fullName).toBe('Philadelphia Eagles')
      expect(result.team?.abbreviation).toBe('PHI')
    })

    it('deve retornar team null quando jogador não tem time', () => {
      const playerWithoutTeam: PlayerDTO = {
        ...mockPlayerDTO,
        team: null,
      }

      const result = mapPlayerFromDTO(playerWithoutTeam, mapTeamFromDTO)

      expect(result.team).toBeNull()
    })
  })

  describe('getPlayerFullName', () => {
    it('deve retornar o nome completo do jogador', () => {
      const player = mapPlayerFromDTO(mockPlayerDTO, mapTeamFromDTO)
      const fullName = getPlayerFullName(player)

      expect(fullName).toBe('Jalen Hurts')
    })
  })

  describe('getPlayerPositionDisplay', () => {
    it('deve retornar a abreviação da posição quando disponível', () => {
      const player = mapPlayerFromDTO(mockPlayerDTO, mapTeamFromDTO)
      const position = getPlayerPositionDisplay(player)

      expect(position).toBe('QB')
    })

    it('deve retornar a posição completa quando abreviação não está disponível', () => {
      const playerWithoutAbbr: PlayerDTO = {
        ...mockPlayerDTO,
        position_abbreviation: '',
      }

      const player = mapPlayerFromDTO(playerWithoutAbbr, mapTeamFromDTO)
      const position = getPlayerPositionDisplay(player)

      expect(position).toBe('Quarterback')
    })
  })
})
