/**
 * Página de Detalhes de Jogador - GridironHub
 */

import { getPlayerById } from '@/application/use-cases'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { PlayerRow } from '@/presentation/components/molecules'
import { Text, Button, Badge } from '@/presentation/components/atoms'
import { getPlayerFullName } from '@/domain/entities/player'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PlayerDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PlayerDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const playerId = parseInt(id, 10)
  const t = await getTranslations('players')

  if (isNaN(playerId)) {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }

  try {
    const player = await getPlayerById(playerId)

    if (!player) {
      return {
        title: `GridironHub - ${t('notFound')}`,
        description: t('notFound'),
      }
    }

    const fullName = getPlayerFullName(player)

    return {
      title: `GridironHub - ${fullName}`,
      description: `${fullName} - ${player.position} ${player.team ? `- ${player.team.fullName}` : ''}`,
    }
  } catch {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { id } = await params
  const playerId = parseInt(id, 10)
  const t = await getTranslations('players')

  if (isNaN(playerId)) {
    notFound()
  }

  let player

  try {
    player = await getPlayerById(playerId)
  } catch (error) {
    console.error('Erro ao carregar jogador:', error)
    notFound()
  }

  if (!player) {
    notFound()
  }

  const fullName = getPlayerFullName(player)

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Botão Voltar */}
      <nav className="mb-6" aria-label="Navegação secundária">
        <Link href="/players" className="inline-block">
          <Button variant="outline" size="sm" aria-label={t('backToPlayers')}>
            ← {t('backToPlayers')}
          </Button>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Text as="h1" size="3xl" weight="bold" className="text-3xl sm:text-4xl">
            {fullName}
          </Text>
          {player.positionAbbreviation && (
            <Badge variant="info" size="md" aria-label={`${t('position')}: ${player.positionAbbreviation}`}>
              {player.positionAbbreviation}
            </Badge>
          )}
          {player.jerseyNumber && (
            <Badge variant="default" size="md" aria-label={`${t('jerseyNumber')}: ${player.jerseyNumber}`}>
              #{player.jerseyNumber}
            </Badge>
          )}
        </div>
      </header>

      {/* Informações do Jogador */}
      <section aria-labelledby="player-info-title">
        <h2 id="player-info-title" className="sr-only">
          Informações do jogador
        </h2>
        <div className="max-w-2xl mb-8">
          <PlayerRow player={player} />
        </div>
      </section>

      {/* Informações Detalhadas */}
      <section className="mt-8 sm:mt-12" aria-labelledby="player-details-title">
        <h2 id="player-details-title" className="sr-only">
          Detalhes do jogador
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 max-w-2xl">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('fullName')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{fullName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('position')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {player.position}
              </dd>
            </div>

            {player.team && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('team')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  <Link
                    href={`/teams/${player.team.id}`}
                    className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    {player.team.fullName}
                  </Link>
                </dd>
              </div>
            )}

            {player.jerseyNumber && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('jerseyNumber')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  #{player.jerseyNumber}
                </dd>
              </div>
            )}

            {player.height && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('height')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{player.height}</dd>
              </div>
            )}

            {player.weight && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('weight')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">{player.weight}</dd>
              </div>
            )}

            {player.age && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('age')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {player.age} {player.age === 1 ? t('year') : t('years')}
                </dd>
              </div>
            )}

            {player.experience && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('experience')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {player.experience} {parseInt(player.experience) === 1 ? t('year') : t('years')}
                </dd>
              </div>
            )}

            {player.college && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('college')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {player.college}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>
    </div>
  )
}
