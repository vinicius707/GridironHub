/**
 * Componente PlayerRow - Molécula
 * Linha de exibição de um jogador
 */

import Link from 'next/link'
import type { Player } from '@/domain/entities'
import { getPlayerFullName, getPlayerPositionDisplay } from '@/domain/entities/player'
import { Badge } from '@/presentation/components/atoms'
import { Text } from '@/presentation/components/atoms'

export interface PlayerRowProps {
  player: Player
  href?: string
}

export function PlayerRow({ player, href }: PlayerRowProps) {
  const playerName = getPlayerFullName(player)
  const position = getPlayerPositionDisplay(player)

  const rowContent = (
    <article
      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      aria-labelledby={`player-${player.id}-name`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <Text id={`player-${player.id}-name`} size="base" weight="semibold">
            {playerName}
          </Text>
          <Badge variant="info" size="sm" aria-label={`Posição: ${position}`}>
            {position}
          </Badge>
        </div>

        {player.team && (
          <Text size="sm" color="muted" className="mt-1">
            <span className="sr-only">Time:</span>
            {player.team.fullName}
          </Text>
        )}

        <dl className="flex items-center gap-4 mt-2">
          {player.jerseyNumber && (
            <div>
              <dt className="sr-only">Número da camisa</dt>
              <dd>
                <Text size="sm" color="muted">
                  #{player.jerseyNumber}
                </Text>
              </dd>
            </div>
          )}
          {player.height && (
            <div>
              <dt className="sr-only">Altura</dt>
              <dd>
                <Text size="sm" color="muted">
                  {player.height}
                </Text>
              </dd>
            </div>
          )}
          {player.weight && (
            <div>
              <dt className="sr-only">Peso</dt>
              <dd>
                <Text size="sm" color="muted">
                  {player.weight}
                </Text>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none"
        aria-label={`Ver detalhes do jogador ${playerName}`}
      >
        {rowContent}
      </Link>
    )
  }

  return rowContent
}
