import { render, screen } from '@testing-library/react'
import { PageLayout } from '@/presentation/components/templates/PageLayout'

jest.mock('@/presentation/components/organisms/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}))

describe('PageLayout Component', () => {
  it('deve renderizar o layout com navbar', () => {
    render(
      <PageLayout>
        <div>Conteúdo</div>
      </PageLayout>
    )

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('deve renderizar skip link para acessibilidade', () => {
    render(
      <PageLayout>
        <div>Conteúdo</div>
      </PageLayout>
    )

    const skipLink = screen.getByText('Pular para o conteúdo principal')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('deve renderizar main com id correto', () => {
    render(
      <PageLayout>
        <div>Conteúdo</div>
      </PageLayout>
    )

    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main-content')
  })

  it('deve aplicar className customizada', () => {
    render(
      <PageLayout className="custom-class">
        <div>Conteúdo</div>
      </PageLayout>
    )

    const main = screen.getByRole('main')
    expect(main).toHaveClass('custom-class')
  })
})
