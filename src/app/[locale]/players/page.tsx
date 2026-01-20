/**
 * Página de Lista de Jogadores - GridironHub
 */

import { getPlayers, getTeams } from '@/application/use-cases'
import { getTranslations } from 'next-intl/server'
import { PlayerRow } from '@/presentation/components/molecules'
import { Text, Button, Skeleton } from '@/presentation/components/atoms'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('players')
  return {
    title: `GridironHub - ${t('title')}`,
    description: t('description'),
  }
}

interface PlayersPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    teamId?: string
    position?: string
  }>
}

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const t = await getTranslations('players')
  const params = await searchParams

  // Parse query parameters
  const page = params.page ? parseInt(params.page, 10) : 1
  const cursor = page > 1 ? (page - 1) * 25 : undefined
  const search = params.search || undefined
  const teamId = params.teamId ? parseInt(params.teamId, 10) : undefined
  const teamIds = teamId ? [teamId] : undefined

  let playersResponse
  let teams = []

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:44',message:'PlayersPage: início do try',data:{page,cursor,search,teamId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  try {
    // Buscar jogadores
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:46',message:'PlayersPage: chamando getPlayers',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    playersResponse = await getPlayers({
      cursor,
      perPage: 25,
      search,
      teamIds,
    })
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:52',message:'PlayersPage: getPlayers concluído',data:{playersCount:playersResponse?.data?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    // Buscar times para filtro
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:54',message:'PlayersPage: chamando getTeams',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    teams = await getTeams()
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:55',message:'PlayersPage: getTeams concluído',data:{teamsCount:teams?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/9c6cdda6-827e-41a3-a832-8de87dba0317',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/[locale]/players/page.tsx:catch',message:'PlayersPage: ERRO capturado',data:{errorMessage:error instanceof Error?error.message:String(error),errorName:error instanceof Error?error.name:'unknown',stack:error instanceof Error?error.stack:''},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.error('Erro ao carregar jogadores:', error)
    notFound()
  }

  if (!playersResponse || !playersResponse.data || playersResponse.data.length === 0) {
    // Não é erro se não houver jogadores, apenas mostrar mensagem
  }

  const players = playersResponse.data
  const meta = playersResponse.meta
  const hasNextPage = meta.nextCursor !== null
  const hasPreviousPage = page > 1

  // Extrair posições únicas para filtro
  const positions = Array.from(
    new Set(
      players
        .map((player) => player.positionAbbreviation)
        .filter((pos): pos is string => pos !== null && pos !== undefined)
    )
  ).sort()

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

      {/* Filtros e Busca */}
      <section aria-labelledby="filters-title" className="mb-8">
        <h2 id="filters-title" className="sr-only">
          Filtros de busca
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <form method="GET" className="space-y-4">
            {/* Busca por nome */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('search')}
              </label>
              <input
                type="text"
                id="search"
                name="search"
                defaultValue={search || ''}
                placeholder={t('searchPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={t('searchPlaceholder')}
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Filtro por time */}
              <div>
                <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

              {/* Filtro por posição */}
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t('filterByPosition')}
                </label>
                <select
                  id="position"
                  name="position"
                  defaultValue={params.position || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={t('filterByPosition')}
                >
                  <option value="">{t('allPositions')}</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
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

      {/* Lista de Jogadores */}
      <section aria-labelledby="players-section-title">
        <h2 id="players-section-title" className="sr-only">
          Lista de jogadores
        </h2>

        {players.length === 0 ? (
          <div className="text-center py-12">
            <Text size="lg" color="muted">
              {t('noPlayersFound')}
            </Text>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {players.map((player) => (
                <PlayerRow key={player.id} player={player} href={`/players/${player.id}`} />
              ))}
            </div>

            {/* Paginação */}
            {meta.nextCursor || hasPreviousPage ? (
              <nav aria-label="Paginação de jogadores" className="flex items-center justify-between">
                <div>
                  {hasPreviousPage ? (
                    <Link href={`/players?page=${page - 1}${search ? `&search=${search}` : ''}${teamId ? `&teamId=${teamId}` : ''}${params.position ? `&position=${params.position}` : ''}`}>
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
                    <Link href={`/players?page=${page + 1}${search ? `&search=${search}` : ''}${teamId ? `&teamId=${teamId}` : ''}${params.position ? `&position=${params.position}` : ''}`}>
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
