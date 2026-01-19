/**
 * Componente Badge - Átomo
 */

import type { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium'

  const variants = {
    default: 'bg-gray-100 text-gray-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-yellow-100 text-yellow-900',
    error: 'bg-red-100 text-red-900',
    info: 'bg-blue-100 text-blue-900',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <span
      className={classes}
      role="status"
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </span>
  )
}
