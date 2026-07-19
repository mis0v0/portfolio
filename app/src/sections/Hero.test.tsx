import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./NetworkBackground', () => ({ NetworkBackground: () => null }))

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the CTA links to work and contact', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view work/i })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '#contact')
  })

  it('renders the mascot image', () => {
    render(<Hero />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
