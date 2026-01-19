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

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {showDate && (
        <Text size="sm" color="muted" className="mb-2">
          {game.date}
        </Text>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Text size="sm" weight="medium">
              {game.visitorTeam.fullName}
            </Text>
            {isFinished && (
              <Text size="lg" weight="bold">
                {game.visitorTeamScore}
              </Text>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Text size="sm" weight="medium">
              {game.homeTeam.fullName}
            </Text>
            {isFinished && (
              <Text size="lg" weight="bold">
                {game.homeTeamScore}
              </Text>
            )}
          </div>
        </div>

        <div className="text-right">
          <Badge
            variant={isFinished ? 'default' : game.status === 'In Progress' ? 'warning' : 'info'}
            size="sm"
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
          Semana {game.week} - {game.season}
        </Text>
      )}
    </div>
  )
}
