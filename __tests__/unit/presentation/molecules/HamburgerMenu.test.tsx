import { render, screen } from '@testing-library/react'
import { HamburgerMenu } from '@/presentation/components/molecules/HamburgerMenu'

const messages = {
  pt: {
    menu: {
      open: 'Abrir menu',
      close: 'Fechar menu',
      mobile: 'Menu mobile',
    },
    language: {
      change: 'Trocar idioma',
    },
  },
}

const mockLinks = [
  { href: '/', label: 'Início' },
  { href: '/teams', label: 'Times' },
  { href: '/players', label: 'Jogadores' },
]

jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocale: () => 'pt',
  useTranslations: (namespace: string) => (key: string) => {
    if (namespace === 'menu') {
      return messages.pt.menu[key as keyof typeof messages.pt.menu]
    }
    if (namespace === 'language') {
      return messages.pt.language[key as keyof typeof messages.pt.language]
    }
    return key
  },
}))

jest.mock('@/presentation/components/molecules/LanguageToggle', () => ({
  LanguageToggle: ({ variant }: { variant?: string }) => (
    <button data-testid="language-toggle">{variant || 'button'}</button>
  ),
}))

describe('HamburgerMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset body overflow
    document.body.style.overflow = ''
  })

  it('deve renderizar o botão hamburger', () => {
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    expect(button).toBeInTheDocument()
  })

  it('deve ter aria-controls vinculando botão ao menu', () => {
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    expect(button).toHaveAttribute('aria-controls', 'mobile-menu')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('deve ter estrutura semântica correta', () => {
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    expect(button).toBeInTheDocument()
  })
})
