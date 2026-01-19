import { render, screen } from '@testing-library/react'
import { LanguageToggle } from '@/presentation/components/molecules/LanguageToggle'

const messages = {
  pt: {
    language: {
      pt: 'Português',
      en: 'English',
      change: 'Trocar idioma',
      current: 'Idioma atual',
      select: 'Selecione um idioma',
    },
  },
  en: {
    language: {
      pt: 'Português',
      en: 'English',
      change: 'Change language',
      current: 'Current language',
      select: 'Select a language',
    },
  },
}

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

jest.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => mockRouter,
  usePathname: () => '/',
}))

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocale: () => 'pt',
  useTranslations: () => (key: string) =>
    messages.pt.language[key as keyof typeof messages.pt.language],
}))

describe('LanguageToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar o botão com idioma atual', () => {
    render(<LanguageToggle />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })

  it('deve exibir o ícone de globo', () => {
    render(<LanguageToggle />)

    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('deve ter aria-label descritivo', () => {
    render(<LanguageToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Trocar idioma: Português')
  })

  it('deve renderizar select quando variant é select', () => {
    render(<LanguageToggle variant="select" />)

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('pt')
  })

  it('deve ter label acessível para select', () => {
    render(<LanguageToggle variant="select" />)

    const label = screen.getByText('Selecione um idioma')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('sr-only')
  })
})
