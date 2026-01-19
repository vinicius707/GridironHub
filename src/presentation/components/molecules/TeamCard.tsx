/**
 * Componente TeamCard - Molécula
 * Card de exibição de um time da NFL
 */

import Link from 'next/link'
import type { Team } from '@/domain/entities'
import { Badge } from '@/presentation/components/atoms'
import { Text } from '@/presentation/components/atoms'

export interface TeamCardProps {
  team: Team
  href?: string
}

export function TeamCard({ team, href }: TeamCardProps) {
  const cardContent = (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" size="lg" weight="semibold">
          {team.fullName}
        </Text>
        <Badge variant="info" size="sm">
          {team.abbreviation}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Text size="sm" color="muted">
            Conferência:
          </Text>
          <Badge variant={team.conference === 'AFC' ? 'default' : 'info'} size="sm">
            {team.conference}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Text size="sm" color="muted">
            Divisão:
          </Text>
          <Text size="sm" weight="medium">
            {team.division}
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <Text size="sm" color="muted">
            Localização:
          </Text>
          <Text size="sm" weight="medium">
            {team.location}
          </Text>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
