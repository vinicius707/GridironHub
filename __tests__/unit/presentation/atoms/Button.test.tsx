/**
 * Testes unitários para o componente Button
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/presentation/components/atoms/Button'

describe('Button Component', () => {
  it('deve renderizar o texto do botão', () => {
    render(<Button>Clique aqui</Button>)

    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument()
  })

  it('deve aplicar variante primary por padrão', () => {
    render(<Button>Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('deve aplicar variante secondary quando especificado', () => {
    render(<Button variant="secondary">Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
  })

  it('deve aplicar variante outline quando especificado', () => {
    render(<Button variant="outline">Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-blue-600')
  })

  it('deve aplicar tamanho sm quando especificado', () => {
    render(<Button size="sm">Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-sm')
  })

  it('deve aplicar tamanho lg quando especificado', () => {
    render(<Button size="lg">Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-lg')
  })

  it('deve estar desabilitado quando disabled é true', () => {
    render(<Button disabled>Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('deve estar desabilitado quando isLoading é true', () => {
    render(<Button isLoading>Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('deve exibir loading quando isLoading é true', () => {
    render(<Button isLoading>Teste</Button>)

    expect(screen.getByText(/carregando\.\.\./i)).toBeInTheDocument()
    expect(screen.getByText('Carregando', { selector: '.sr-only' })).toBeInTheDocument()
  })

  it('deve chamar onClick quando clicado', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Clique</Button>)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('não deve chamar onClick quando desabilitado', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(
      <Button disabled onClick={handleClick}>
        Clique
      </Button>
    )

    await user.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('deve aplicar className customizado', () => {
    render(<Button className="custom-class">Teste</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})
