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

/**
 * Root Layout
 * O Next.js requer um root layout com <html> e <body>.
 * Este layout é o único que deve ter essas tags - o LocaleLayout apenas fornece conteúdo.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // O Next.js requer <html> e <body> no root layout.
  // Este é o único layout que deve ter essas tags.
  // O LocaleLayout em [locale]/layout.tsx renderiza apenas o conteúdo.
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
