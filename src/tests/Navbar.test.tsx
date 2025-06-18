import { describe, it, vi, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from '../components/Navbar'


vi.mock('react-router', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  )
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signInWithGitHub: vi.fn(),
    signOut: vi.fn()
  })
}))

describe('Navbar (unauthenticated)', () => {
  it('renders main links', () => {
    render(<Navbar />)

    // Use getByRole with accessible name instead of getByText regex for broken-up text
  expect(screen.getByRole('link', { name: /social \.media/i })).toBeInTheDocument()

    expect(screen.getAllByText(/home/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/create post/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/communities/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/create community/i)[0]).toBeInTheDocument()
  })

  it('shows sign-in button when user is not logged in', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument()
  })

  it('toggles mobile menu on click', () => {
    render(<Navbar />)
    const toggleBtn = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(toggleBtn)
    expect(screen.getAllByText(/home/i).length).toBeGreaterThan(1)
  })
})
