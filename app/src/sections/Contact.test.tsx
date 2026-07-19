import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders the email and CV links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'you@example.com' })).toHaveAttribute('href', 'mailto:you@example.com')
    expect(screen.getByRole('link', { name: 'Download CV' })).toBeInTheDocument()
  })

  it('renders the social links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })
})
