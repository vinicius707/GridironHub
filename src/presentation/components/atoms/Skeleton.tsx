/**
 * Componente Skeleton - Átomo (Loading placeholder)
 */

import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
  ...props
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  const classes = `bg-gray-200 animate-pulse ${roundedClasses[rounded]} ${className}`

  return <div className={classes} style={{ width, height }} {...props} aria-label="Carregando..." />
}
