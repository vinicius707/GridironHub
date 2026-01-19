import { render, screen } from '@testing-library/react'
import { Navbar } from '@/presentation/components/organisms/Navbar'

const messages = {
  pt: {
    nav: {
      home: 'Início',
      teams: 'Times',
      players: 'Jogadores',
      games: 'Partidas',
      navigation: 'Navegação principal',
    },
  },
}

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
    if (namespace === 'nav') {
      return messages.pt.nav[key as keyof typeof messages.pt.nav]
    }
    return key
  },
}))

jest.mock('@/presentation/components/molecules/LanguageToggle', () => ({
  LanguageToggle: () => <button>Language Toggle</button>,
}))

jest.mock('@/presentation/components/molecules/HamburgerMenu', () => ({
  HamburgerMenu: ({ links }: { links: Array<{ href: string; label: string }> }) => (
    <nav data-testid="hamburger-menu">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  ),
}))

describe('Navbar Component', () => {
  it('deve renderizar a navbar', () => {
    render(<Navbar />)

    const navs = screen.getAllByRole('navigation')
    expect(navs.length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Navegação principal')).toBeInTheDocument()
  })

  it('deve renderizar o logo/brand', () => {
    render(<Navbar />)

    const logoLink = screen.getByLabelText('Início')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(screen.getByText('GridironHub')).toBeInTheDocument()
  })

  it('deve renderizar links de navegação no desktop', () => {
    render(<Navbar />)

    expect(screen.getByText('Início')).toBeInTheDocument()
    expect(screen.getByText('Times')).toBeInTheDocument()
    expect(screen.getByText('Jogadores')).toBeInTheDocument()
    expect(screen.getByText('Partidas')).toBeInTheDocument()
  })

  it('deve destacar link ativo', () => {
    render(<Navbar />)

    const homeLink = screen.getByText('Início').closest('a')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('deve ter estrutura semântica correta', () => {
    render(<Navbar />)

    const navs = screen.getAllByRole('navigation')
    const mainNav = navs.find((nav) => nav.getAttribute('aria-label') === 'Navegação principal')
    expect(mainNav).toBeInTheDocument()
    expect(mainNav).toHaveAttribute('aria-label', 'Navegação principal')
  })
})
