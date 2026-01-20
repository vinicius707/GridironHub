/**
 * Componente Text - Átomo
 */

import type { HTMLAttributes, ReactNode } from 'react'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'secondary'
}

export function Text({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = '',
  ...props
}: TextProps) {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colors = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
  }

  const classes = `${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
