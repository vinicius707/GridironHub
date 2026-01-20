import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Matcher para ignorar arquivos estáticos e API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
