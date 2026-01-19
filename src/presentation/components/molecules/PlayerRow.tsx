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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <Text size="base" weight="semibold">
            {playerName}
          </Text>
          <Badge variant="info" size="sm">
            {position}
          </Badge>
        </div>

        {player.team && (
          <Text size="sm" color="muted" className="mt-1">
            {player.team.fullName}
          </Text>
        )}

        <div className="flex items-center gap-4 mt-2">
          {player.jerseyNumber && (
            <Text size="sm" color="muted">
              #{player.jerseyNumber}
            </Text>
          )}
          {player.height && (
            <Text size="sm" color="muted">
              {player.height}
            </Text>
          )}
          {player.weight && (
            <Text size="sm" color="muted">
              {player.weight}
            </Text>
          )}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {rowContent}
      </Link>
    )
  }

  return rowContent
}
