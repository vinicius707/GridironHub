/**
 * Mock do Next.js Link para testes
 */

import type { ReactNode } from 'react'

export default function Link({ children, href }: { children: ReactNode; href: string }) {
  return <a href={href}>{children}</a>
}
