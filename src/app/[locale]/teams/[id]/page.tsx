/**
 * Página de Detalhes de Time - GridironHub
 */

import { getTeamById, getTeams } from '@/application/use-cases'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { TeamCard } from '@/presentation/components/molecules'
import { Text, Button, Badge } from '@/presentation/components/atoms'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

interface TeamDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

/**
 * Gera parâmetros estáticos para todas as páginas de times
 * Pre-renderiza os 32 times da NFL em build time
 */
export async function generateStaticParams() {
  try {
    const teams = await getTeams()
    
    // Gera parâmetros para cada locale e cada time
    const params: Array<{ locale: string; id: string }> = []
    
    for (const locale of routing.locales) {
      for (const team of teams) {
        params.push({
          locale,
          id: team.id.toString(),
        })
      }
    }
    
    return params
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos para times:', error)
    // Em caso de erro, retorna array vazio (ISR on-demand será usado)
    return []
  }
}

/**
 * Revalidação: ISR a cada 1 hora (3600 segundos)
 * Times mudam raramente, então 1 hora é suficiente
 */
export const revalidate = 3600

export async function generateMetadata({ params }: TeamDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const teamId = parseInt(id, 10)
  const t = await getTranslations('teams')

  if (isNaN(teamId)) {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }

  const team = await getTeamById(teamId)

  if (!team) {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }

  return {
    title: `GridironHub - ${team.fullName}`,
    description: `${team.fullName} - ${team.conference} ${team.division} - ${team.location}`,
  }
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { id } = await params
  const teamId = parseInt(id, 10)
  const t = await getTranslations('teams')

  if (isNaN(teamId)) {
    notFound()
  }

  const team = await getTeamById(teamId)

  if (!team) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Botão Voltar */}
      <nav className="mb-6" aria-label="Navegação secundária">
        <Link href="/teams">
          <Button variant="outline" size="sm" aria-label={t('backToTeams')}>
            ← {t('backToTeams')}
          </Button>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Text as="h1" size="3xl" weight="bold" className="text-3xl sm:text-4xl">
            {team.fullName}
          </Text>
          <Badge variant="info" size="md" aria-label={`${t('abbreviation')}: ${team.abbreviation}`}>
            {team.abbreviation}
          </Badge>
        </div>
      </header>

      {/* Informações do Time */}
      <section aria-labelledby="team-info-title">
        <h2 id="team-info-title" className="sr-only">
          Informações do time
        </h2>
        <div className="max-w-2xl">
          <TeamCard team={team} />
        </div>
      </section>

      {/* Informações Detalhadas */}
      <section className="mt-8 sm:mt-12" aria-labelledby="team-details-title">
        <h2 id="team-details-title" className="sr-only">
          Detalhes do time
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 max-w-2xl">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('fullName')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {team.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('conference')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {team.conference}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('division')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {team.division}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('location')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {team.location}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('abbreviation')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {team.abbreviation}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
