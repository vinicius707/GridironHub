import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import '../globals.css'
import { routing } from '@/i18n/routing'
import { PageLayout } from '@/presentation/components/templates'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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

  // Determina o lang do HTML baseado no locale
  const htmlLang = locale === 'pt' ? 'pt-BR' : 'en-US'

  return (
    <html lang={htmlLang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <PageLayout>{children}</PageLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
