/**
 * Página de Detalhes de Partida - GridironHub
 */

import { getGameById } from '@/application/use-cases'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { GameScore } from '@/presentation/components/molecules'
import { Text, Button, Badge } from '@/presentation/components/atoms'
import {
  isGameFinished,
  isGameInProgress,
  isGameScheduled,
  getGameWinner,
  getGameDateDisplay,
} from '@/domain/entities/game'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface GameDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const gameId = parseInt(id, 10)
  const t = await getTranslations('games')

  if (isNaN(gameId)) {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }

  try {
    const game = await getGameById(gameId)

    if (!game) {
      return {
        title: `GridironHub - ${t('notFound')}`,
        description: t('notFound'),
      }
    }

    const gameTitle = `${game.visitorTeam.fullName} vs ${game.homeTeam.fullName}`
    return {
      title: `GridironHub - ${gameTitle}`,
      description: `${gameTitle} - ${game.season} ${game.postseason ? t('postseason') : t('regularSeason')}`,
    }
  } catch {
    return {
      title: `GridironHub - ${t('notFound')}`,
      description: t('notFound'),
    }
  }
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params
  const gameId = parseInt(id, 10)
  const t = await getTranslations('games')

  if (isNaN(gameId)) {
    notFound()
  }

  let game

  try {
    game = await getGameById(gameId)
  } catch (error) {
    console.error('Erro ao carregar partida:', error)
    notFound()
  }

  if (!game) {
    notFound()
  }

  const isFinished = isGameFinished(game)
  const isInProgress = isGameInProgress(game)
  const isScheduled = isGameScheduled(game)
  const winner = getGameWinner(game)
  const gameDate = getGameDateDisplay(game)

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Botão Voltar */}
      <nav className="mb-6" aria-label="Navegação secundária">
        <Link href="/games" className="inline-block">
          <Button variant="outline" size="sm" aria-label={t('backToGames')}>
            ← {t('backToGames')}
          </Button>
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8 sm:mb-12">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Text as="h1" size="3xl" weight="bold" className="text-3xl sm:text-4xl">
            {game.visitorTeam.fullName} vs {game.homeTeam.fullName}
          </Text>
          <Badge
            variant={isFinished ? 'default' : isInProgress ? 'warning' : 'info'}
            size="md"
            aria-label={`${t('status')}: ${game.status}`}
          >
            {game.status}
          </Badge>
          {game.postseason && (
            <Badge variant="info" size="md" aria-label={t('postseason')}>
              {t('postseason')}
            </Badge>
          )}
        </div>
        <Text size="lg" color="muted">
          {gameDate} - {t('season')} {game.season} - {t('week')} {game.week}
        </Text>
      </header>

      {/* Informações da Partida */}
      <section aria-labelledby="game-info-title">
        <h2 id="game-info-title" className="sr-only">
          Informações da partida
        </h2>
        <div className="max-w-2xl mb-8">
          <GameScore game={game} showDate />
        </div>
      </section>

      {/* Informações Detalhadas */}
      <section className="mt-8 sm:mt-12" aria-labelledby="game-details-title">
        <h2 id="game-details-title" className="sr-only">
          Detalhes da partida
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 max-w-2xl">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('visitorTeam')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <Link
                  href={`/teams/${game.visitorTeam.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {game.visitorTeam.fullName}
                </Link>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('homeTeam')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <Link
                  href={`/teams/${game.homeTeam.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {game.homeTeam.fullName}
                </Link>
              </dd>
            </div>

            {isFinished && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('visitorScore')}
                  </dt>
                  <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {game.visitorTeamScore}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('homeScore')}
                  </dt>
                  <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {game.homeTeamScore}
                  </dd>
                </div>

                {winner && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t('winner')}
                    </dt>
                    <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      <Link
                        href={`/teams/${winner.id}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      >
                        {winner.fullName}
                      </Link>
                    </dd>
                  </div>
                )}
              </>
            )}

            {isScheduled && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {t('scheduledTime')}
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {game.time}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('season')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {game.season}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('week')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {game.week}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('date')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                <time dateTime={game.date}>{gameDate}</time>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('type')}
              </dt>
              <dd className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {game.postseason ? t('postseason') : t('regularSeason')}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
