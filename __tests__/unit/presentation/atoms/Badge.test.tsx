/**
 * Testes unitários para o componente Badge
 */

import { render, screen } from '@testing-library/react'
import { Badge } from '@/presentation/components/atoms/Badge'

describe('Badge Component', () => {
  it('deve renderizar o conteúdo do badge', () => {
    render(<Badge>NFL</Badge>)

    expect(screen.getByText('NFL')).toBeInTheDocument()
  })

  it('deve aplicar variante default por padrão', () => {
    render(<Badge>Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('bg-gray-100')
  })

  it('deve aplicar variante success quando especificado', () => {
    render(<Badge variant="success">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('bg-green-100')
  })

  it('deve aplicar variante warning quando especificado', () => {
    render(<Badge variant="warning">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('bg-yellow-100')
  })

  it('deve aplicar variante error quando especificado', () => {
    render(<Badge variant="error">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('bg-red-100')
  })

  it('deve aplicar variante info quando especificado', () => {
    render(<Badge variant="info">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('deve aplicar tamanho md por padrão', () => {
    render(<Badge>Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('text-sm')
  })

  it('deve aplicar tamanho sm quando especificado', () => {
    render(<Badge size="sm">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('text-xs')
  })

  it('deve aplicar className customizado', () => {
    render(<Badge className="custom-class">Teste</Badge>)

    const badge = screen.getByText('Teste')
    expect(badge).toHaveClass('custom-class')
  })
})
