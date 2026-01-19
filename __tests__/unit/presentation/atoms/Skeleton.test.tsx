/**
 * Testes unitários para o componente Skeleton
 */

import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/presentation/components/atoms/Skeleton'

describe('Skeleton Component', () => {
  it('deve renderizar o skeleton', () => {
    render(<Skeleton />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toBeInTheDocument()
  })

  it('deve aplicar largura padrão quando não especificada', () => {
    render(<Skeleton />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveStyle({ width: '100%' })
  })

  it('deve aplicar largura customizada quando especificada', () => {
    render(<Skeleton width="200px" />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveStyle({ width: '200px' })
  })

  it('deve aplicar altura padrão quando não especificada', () => {
    render(<Skeleton />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveStyle({ height: '1rem' })
  })

  it('deve aplicar altura customizada quando especificada', () => {
    render(<Skeleton height="2rem" />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveStyle({ height: '2rem' })
  })

  it('deve aplicar rounded md por padrão', () => {
    render(<Skeleton />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveClass('rounded-md')
  })

  it('deve aplicar rounded full quando especificado', () => {
    render(<Skeleton rounded="full" />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('deve aplicar className customizado', () => {
    render(<Skeleton className="custom-class" />)

    const skeleton = screen.getByLabelText('Carregando...')
    expect(skeleton).toHaveClass('custom-class')
  })
})
