/**
 * Testes unitários para o componente Text
 */

import { render, screen } from '@testing-library/react'
import { Text } from '@/presentation/components/atoms/Text'

describe('Text Component', () => {
  it('deve renderizar como parágrafo por padrão', () => {
    render(<Text>Conteúdo do texto</Text>)

    const text = screen.getByText('Conteúdo do texto')
    expect(text.tagName).toBe('P')
  })

  it('deve renderizar como h1 quando as="h1"', () => {
    render(<Text as="h1">Título</Text>)

    const text = screen.getByText('Título')
    expect(text.tagName).toBe('H1')
  })

  it('deve aplicar tamanho base por padrão', () => {
    render(<Text>Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('text-base')
  })

  it('deve aplicar tamanho quando especificado', () => {
    render(<Text size="lg">Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('text-lg')
  })

  it('deve aplicar peso normal por padrão', () => {
    render(<Text>Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('font-normal')
  })

  it('deve aplicar peso quando especificado', () => {
    render(<Text weight="bold">Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('font-bold')
  })

  it('deve aplicar cor default por padrão', () => {
    render(<Text>Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('text-gray-900')
  })

  it('deve aplicar cor quando especificado', () => {
    render(<Text color="primary">Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('text-blue-600')
  })

  it('deve aplicar className customizado', () => {
    render(<Text className="custom-class">Teste</Text>)

    const text = screen.getByText('Teste')
    expect(text).toHaveClass('custom-class')
  })
})
