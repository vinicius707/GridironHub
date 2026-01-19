/**
 * Componente GameScore - Molécula
 * Exibição de placar de uma partida
 */

import type { Game } from '@/domain/entities'
import { getGameScoreDisplay, isGameFinished } from '@/domain/entities/game'
import { Badge } from '@/presentation/components/atoms'
import { Text } from '@/presentation/components/atoms'

export interface GameScoreProps {
  game: Game
  showDate?: boolean
}

export function GameScore({ game, showDate = false }: GameScoreProps) {
  const isFinished = isGameFinished(game)
  const scoreDisplay = getGameScoreDisplay(game)

  const statusLabel = isFinished
    ? 'Finalizado'
    : game.status === 'In Progress'
      ? 'Em andamento'
      : 'Agendado'

  return (
    <article
      className="p-4 bg-white rounded-lg border border-gray-200"
      aria-labelledby={`game-${game.id}-title`}
    >
      {showDate && (
        <Text size="sm" color="muted" className="mb-2">
          <time dateTime={game.date}>{game.date}</time>
        </Text>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 id={`game-${game.id}-title`} className="sr-only">
            Partida entre {game.visitorTeam.fullName} e {game.homeTeam.fullName} - {statusLabel}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Text size="sm" weight="medium">
              {game.visitorTeam.fullName}
            </Text>
            {isFinished && (
              <Text
                size="lg"
                weight="bold"
                aria-label={`${game.visitorTeam.fullName} ${game.visitorTeamScore} pontos`}
              >
                {game.visitorTeamScore}
              </Text>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Text size="sm" weight="medium">
              {game.homeTeam.fullName}
            </Text>
            {isFinished && (
              <Text
                size="lg"
                weight="bold"
                aria-label={`${game.homeTeam.fullName} ${game.homeTeamScore} pontos`}
              >
                {game.homeTeamScore}
              </Text>
            )}
          </div>
        </div>

        <div className="text-right">
          <Badge
            variant={isFinished ? 'default' : game.status === 'In Progress' ? 'warning' : 'info'}
            size="sm"
            aria-label={`Status: ${statusLabel}`}
          >
            {game.status}
          </Badge>
          {!isFinished && (
            <Text size="sm" color="muted" className="mt-1">
              {scoreDisplay}
            </Text>
          )}
        </div>
      </div>

      {isFinished && (
        <Text size="sm" color="muted" className="mt-2">
          <span className="sr-only">Semana</span> {game.week} -{' '}
          <span className="sr-only">Temporada</span> {game.season}
        </Text>
      )}
    </article>
  )
}
