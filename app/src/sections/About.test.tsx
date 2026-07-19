import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the three stat blocks', () => {
    render(<About />)
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('CTFs played')).toBeInTheDocument()
    expect(screen.getByText("'26")).toBeInTheDocument()
  })
})
