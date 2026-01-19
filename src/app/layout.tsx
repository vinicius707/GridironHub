/**
 * Root Layout
 * Este layout é usado apenas como fallback até que o middleware redirecione para [locale]
 */

import { redirect } from 'next/navigation'

export default function RootLayout({
  children: _children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Redireciona para o locale padrão
  redirect('/pt')
}
