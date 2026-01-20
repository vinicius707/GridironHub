/**
 * Página de Lista de Partidas - GridironHub
 */

import { getGames, getTeams } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import { GameScore } from '@/presentation/components/molecules'
import { Text, Button } from '@/presentation/components/atoms'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'

/**
 * Revalidação: ISR a cada 15 minutos (900 segundos)
 * Partidas podem ter mudanças frequentes (placares, status)
 * Tempo menor para garantir dados atualizados
 */
export const revalidate = 900

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('games')
  return {
    title: `GridironHub - ${t('title')}`,
    description: t('description'),
  }
}

interface GamesPageProps {
  searchParams: Promise<{
    page?: string
    season?: string
    week?: string
    teamId?: string
    postseason?: string
  }>
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const t = await getTranslations('games')
  const params = await searchParams

  // Parse query parameters
  const page = params.page ? parseInt(params.page, 10) : 1
  const cursor = page > 1 ? (page - 1) * 25 : undefined
  const season = params.season ? parseInt(params.season, 10) : undefined
  const seasons = season ? [season] : undefined
  const week = params.week ? parseInt(params.week, 10) : undefined
  const weeks = week ? [week] : undefined
  const teamId = params.teamId ? parseInt(params.teamId, 10) : undefined
  const teamIds = teamId ? [teamId] : undefined
  const postseason = params.postseason === 'true' ? true : params.postseason === 'false' ? false : undefined

  let gamesResponse
  let teams = []

  try {
    // Buscar partidas
    gamesResponse = await getGames({
      cursor,
      perPage: 25,
      seasons,
      weeks,
      teamIds,
      postseason,
    })

    // Buscar times para filtro
    teams = await getTeams()
  } catch (error) {
    console.error('Erro ao carregar partidas:', error)
    notFound()
  }

  if (!gamesResponse || !gamesResponse.data || gamesResponse.data.length === 0) {
    // Não é erro se não houver partidas, apenas mostrar mensagem
  }

  const games = gamesResponse.data
  const meta = gamesResponse.meta
  const hasNextPage = meta.nextCursor !== null
  const hasPreviousPage = page > 1

  // Extrair temporadas únicas para filtro (últimas 5 temporadas)
  const currentYear = new Date().getFullYear()
  const seasonsList = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // Semanas (1-18 para temporada regular, mais playoffs)
  const weeksList = Array.from({ length: 18 }, (_, i) => i + 1)

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

      {/* Filtros */}
      <section aria-labelledby="filters-title" className="mb-8">
        <h2 id="filters-title" className="sr-only">
          Filtros de busca
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <form method="GET" className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por temporada */}
              <div>
                <label
                  htmlFor="season"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('filterBySeason')}
                </label>
                <select
                  id="season"
                  name="season"
                  defaultValue={season?.toString() || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={t('filterBySeason')}
                >
                  <option value="">{t('allSeasons')}</option>
                  {seasonsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por semana */}
              <div>
                <label
                  htmlFor="week"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('filterByWeek')}
                </label>
                <select
                  id="week"
                  name="week"
                  defaultValue={week?.toString() || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={t('filterByWeek')}
                >
                  <option value="">{t('allWeeks')}</option>
                  {weeksList.map((w) => (
                    <option key={w} value={w}>
                      {t('week')} {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por time */}
              <div>
                <label
                  htmlFor="teamId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('filterByTeam')}
                </label>
                <select
                  id="teamId"
                  name="teamId"
                  defaultValue={teamId?.toString() || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={t('filterByTeam')}
                >
                  <option value="">{t('allTeams')}</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por tipo (regular/postseason) */}
              <div>
                <label
                  htmlFor="postseason"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('filterByType')}
                </label>
                <select
                  id="postseason"
                  name="postseason"
                  defaultValue={
                    postseason === true ? 'true' : postseason === false ? 'false' : ''
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={t('filterByType')}
                >
                  <option value="">{t('allTypes')}</option>
                  <option value="false">{t('regularSeason')}</option>
                  <option value="true">{t('postseason')}</option>
                </select>
              </div>
            </div>

            {/* Botão de busca */}
            <div>
              <Button type="submit" variant="primary" size="md">
                {t('search')}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Lista de Partidas */}
      <section aria-labelledby="games-section-title">
        <h2 id="games-section-title" className="sr-only">
          Lista de partidas
        </h2>

        {games.length === 0 ? (
          <div className="text-center py-12">
            <Text size="lg" color="muted">
              {t('noGamesFound')}
            </Text>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {games.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="block focus:outline-none"
                  aria-label={`Ver detalhes da partida entre ${game.visitorTeam.fullName} e ${game.homeTeam.fullName}`}
                >
                  <GameScore game={game} showDate />
                </Link>
              ))}
            </div>

            {/* Paginação */}
            {meta.nextCursor || hasPreviousPage ? (
              <nav aria-label="Paginação de partidas" className="flex items-center justify-between">
                <div>
                  {hasPreviousPage ? (
                    <Link
                      href={`/games?page=${page - 1}${season ? `&season=${season}` : ''}${week ? `&week=${week}` : ''}${teamId ? `&teamId=${teamId}` : ''}${postseason !== undefined ? `&postseason=${postseason}` : ''}`}
                    >
                      <Button variant="outline" size="md" aria-label={t('previousPage')}>
                        ← {t('previousPage')}
                      </Button>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>

                <Text size="sm" color="muted">
                  {t('page')} {page}
                </Text>

                <div>
                  {hasNextPage ? (
                    <Link
                      href={`/games?page=${page + 1}${season ? `&season=${season}` : ''}${week ? `&week=${week}` : ''}${teamId ? `&teamId=${teamId}` : ''}${postseason !== undefined ? `&postseason=${postseason}` : ''}`}
                    >
                      <Button variant="outline" size="md" aria-label={t('nextPage')}>
                        {t('nextPage')} →
                      </Button>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </nav>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
