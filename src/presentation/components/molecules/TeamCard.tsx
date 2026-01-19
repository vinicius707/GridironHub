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
    <article
      className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      aria-labelledby={`team-${team.id}-name`}
    >
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" id={`team-${team.id}-name`} size="lg" weight="semibold">
          {team.fullName}
        </Text>
        <Badge variant="info" size="sm" aria-label={`Abreviação: ${team.abbreviation}`}>
          {team.abbreviation}
        </Badge>
      </div>

      <dl className="space-y-2">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Conferência</dt>
          <dd className="flex items-center gap-2">
            <Text size="sm" color="muted">
              Conferência:
            </Text>
            <Badge variant={team.conference === 'AFC' ? 'default' : 'info'} size="sm">
              {team.conference}
            </Badge>
          </dd>
        </div>

        <div className="flex items-center gap-2">
          <dt className="sr-only">Divisão</dt>
          <dd className="flex items-center gap-2">
            <Text size="sm" color="muted">
              Divisão:
            </Text>
            <Text size="sm" weight="medium">
              {team.division}
            </Text>
          </dd>
        </div>

        <div className="flex items-center gap-2">
          <dt className="sr-only">Localização</dt>
          <dd className="flex items-center gap-2">
            <Text size="sm" color="muted">
              Localização:
            </Text>
            <Text size="sm" weight="medium">
              {team.location}
            </Text>
          </dd>
        </div>
      </dl>
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none"
        aria-label={`Ver detalhes do time ${team.fullName}`}
      >
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
