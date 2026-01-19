import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('deve abrir o menu ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('deve fechar o menu ao clicar no botão de fechar', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const openButton = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(openButton)

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: /fechar menu/i })
      expect(closeButton).toBeInTheDocument()
    })

    const closeButton = screen.getByRole('button', { name: /fechar menu/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(openButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('deve renderizar todos os links de navegação', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(button)

    await waitFor(() => {
      mockLinks.forEach((link) => {
        expect(screen.getByText(link.label)).toBeInTheDocument()
      })
    })
  })

  it('deve fechar o menu ao pressionar ESC', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('deve ter aria-controls vinculando botão ao menu', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    expect(button).toHaveAttribute('aria-controls', 'mobile-menu')

    await user.click(button)

    await waitFor(() => {
      const menu = document.getElementById('mobile-menu')
      expect(menu).toBeInTheDocument()
    })
  })

  it('deve bloquear scroll do body quando menu está aberto', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu links={mockLinks} />)

    const button = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(button)

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden')
    })

    const closeButton = screen.getByRole('button', { name: /fechar menu/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('')
    })
  })
})
