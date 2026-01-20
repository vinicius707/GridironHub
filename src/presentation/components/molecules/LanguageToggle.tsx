'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Button } from '@/presentation/components/atoms'
import type { ComponentProps } from 'react'
import React from 'react'

export interface LanguageToggleProps extends Omit<ComponentProps<'div'>, 'children'> {
  variant?: 'button' | 'select'
}

export function LanguageToggle({
  variant = 'button',
  className = '',
  ...props
}: LanguageToggleProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('language')

  const toggleLanguage = () => {
    const newLocale = locale === 'pt' ? 'en' : 'pt'
    router.push(pathname, { locale: newLocale })
  }

  const currentLanguage = locale === 'pt' ? t('pt') : t('en')

  if (variant === 'select') {
    return (
      <div className={`relative ${className}`} {...props}>
        <label htmlFor="language-select" className="sr-only">
          {t('select')}
        </label>
        <select
          id="language-select"
          value={locale}
          onChange={(e) => {
            router.push(pathname, { locale: e.target.value })
          }}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          aria-label={t('change')}
        >
          <option value="pt">{t('pt')}</option>
          <option value="en">{t('en')}</option>
        </select>
      </div>
    )
  }

  // Remove props que não são válidos para button (ref vem do div, não do button)
  const { onClick: _, ref: __, ...buttonProps } = props as React.ComponentProps<'button'>

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label={`${t('change')}: ${currentLanguage}`}
      className={className}
      {...buttonProps}
    >
      <span className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="hidden sm:inline">{currentLanguage}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
      </span>
    </Button>
  )
}
