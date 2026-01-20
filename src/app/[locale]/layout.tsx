import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { PageLayout } from '@/presentation/components/templates'

export const metadata: Metadata = {
  title: 'GridironHub - NFL Stats & Information',
  description:
    'Explore times, jogadores e partidas da NFL. Dados atualizados da temporada em tempo real.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // Garante que o locale está na lista de suportados
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Habilita renderização estática
  setRequestLocale(locale)

  // Carrega mensagens de tradução
  const messages = await getMessages()

  // Não renderizamos <html> e <body> aqui - eles vêm do RootLayout
  // Este layout apenas fornece o conteúdo e configurações do locale
  return (
    <NextIntlClientProvider messages={messages}>
      <PageLayout>{children}</PageLayout>
    </NextIntlClientProvider>
  )
}
