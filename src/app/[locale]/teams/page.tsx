/**
 * Página de Lista de Times - GridironHub
 */

import { getTeams } from '@/application/use-cases'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { TeamCard } from '@/presentation/components/molecules'
import { Text } from '@/presentation/components/atoms'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('teams')
  return {
    title: `GridironHub - ${t('title')}`,
    description: t('description'),
  }
}

export default async function TeamsPage() {
  const t = await getTranslations('teams')
  let teams

  try {
    teams = await getTeams()
  } catch (error) {
    console.error('Erro ao carregar times:', error)
    notFound()
  }

  if (!teams || teams.length === 0) {
    notFound()
  }

  // Agrupa times por conferência e divisão
  const teamsByConference = teams.reduce(
    (acc, team) => {
      const key = `${team.conference}-${team.division}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key]!.push(team)
      return acc
    },
    {} as Record<string, typeof teams>
  )

  // Organiza em estrutura hierárquica
  const conferences = ['AFC', 'NFC'] as const
  const divisions = ['EAST', 'WEST', 'NORTH', 'SOUTH'] as const

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <Text as="h1" size="3xl" weight="bold" className="mb-4 text-3xl sm:text-4xl">
          {t('title')}
        </Text>
        <Text as="p" size="lg" color="muted" className="text-lg sm:text-xl">
          {t('description')}
        </Text>
      </header>

      {/* Times agrupados por conferência e divisão */}
      <section aria-labelledby="teams-section-title">
        <h2 id="teams-section-title" className="sr-only">
          Times da NFL organizados por conferência e divisão
        </h2>
        <div className="space-y-12">
          {conferences.map((conference) => (
            <div key={conference} className="space-y-6">
              {/* Cabeçalho da Conferência */}
              <div className="border-b-2 border-gray-300 dark:border-gray-700 pb-2">
                <Text as="h2" size="2xl" weight="semibold">
                  {conference}
                </Text>
              </div>

              {/* Divisões */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {divisions.map((division) => {
                  const key = `${conference}-${division}`
                  const divisionTeams = teamsByConference[key] || []

                  if (divisionTeams.length === 0) {
                    return null
                  }

                  return (
                    <div key={key} className="space-y-4">
                      {/* Cabeçalho da Divisão */}
                      <Text
                        as="h3"
                        size="lg"
                        weight="medium"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {division}
                      </Text>

                      {/* Cards dos Times */}
                      <div className="space-y-4">
                        {divisionTeams.map((team) => (
                          <TeamCard key={team.id} team={team} href={`/teams/${team.id}`} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
