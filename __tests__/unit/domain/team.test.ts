/**
 * Testes unitários para a entidade Team
 */

import { mapTeamFromDTO, mapTeamToDTO } from '@/domain/entities/team'
import type { Team, TeamDTO } from '@/domain/entities/team'

describe('Team Entity', () => {
  const mockTeamDTO: TeamDTO = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    full_name: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  const mockTeam: Team = {
    id: 18,
    conference: 'NFC',
    division: 'EAST',
    location: 'Philadelphia',
    name: 'Eagles',
    fullName: 'Philadelphia Eagles',
    abbreviation: 'PHI',
  }

  describe('mapTeamFromDTO', () => {
    it('deve mapear TeamDTO para Team corretamente', () => {
      const result = mapTeamFromDTO(mockTeamDTO)

      expect(result).toEqual(mockTeam)
    })

    it('deve converter full_name para fullName', () => {
      const result = mapTeamFromDTO(mockTeamDTO)

      expect(result.fullName).toBe('Philadelphia Eagles')
      expect(result).not.toHaveProperty('full_name')
    })

    it('deve manter conference e division corretos', () => {
      const result = mapTeamFromDTO(mockTeamDTO)

      expect(result.conference).toBe('NFC')
      expect(result.division).toBe('EAST')
    })
  })

  describe('mapTeamToDTO', () => {
    it('deve mapear Team para TeamDTO corretamente', () => {
      const result = mapTeamToDTO(mockTeam)

      expect(result).toEqual(mockTeamDTO)
    })

    it('deve converter fullName para full_name', () => {
      const result = mapTeamToDTO(mockTeam)

      expect(result.full_name).toBe('Philadelphia Eagles')
      expect(result).not.toHaveProperty('fullName')
    })
  })
})
