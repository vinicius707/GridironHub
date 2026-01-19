/**
 * Store Zustand para Times
 */

import { create } from 'zustand'
import type { Team } from '@/domain/entities'

interface TeamsState {
  teams: Team[]
  selectedTeam: Team | null
  isLoading: boolean
  error: string | null
  setTeams: (teams: Team[]) => void
  setSelectedTeam: (team: Team | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTeamsStore = create<TeamsState>((set) => ({
  teams: [],
  selectedTeam: null,
  isLoading: false,
  error: null,
  setTeams: (teams) => set({ teams }),
  setSelectedTeam: (selectedTeam) => set({ selectedTeam }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
