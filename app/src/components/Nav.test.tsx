import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders all section links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Focus' })).toHaveAttribute('href', '#focus')
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })
})
