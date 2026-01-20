/**
 * Root Layout
 * O Next.js requer que o RootLayout tenha <html> e <body>
 * O middleware do next-intl redireciona automaticamente para [locale]
 */

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // O Next.js requer <html> e <body> no root layout
  // O middleware do next-intl redireciona para [locale]/* antes deste layout ser usado
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
