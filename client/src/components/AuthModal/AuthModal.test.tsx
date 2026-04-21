import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthModal } from './index'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

import { login, register } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

describe('AuthModal', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('submits login and closes on success', async () => {
    const onClose = vi.fn()
    const onModeChange = vi.fn()
    const setAuth = vi.fn()
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth,
      logout: vi.fn(),
    })
    vi.mocked(login).mockResolvedValueOnce({
      token: 'token-1',
      user: { id: '1', username: 'alice', avatar_url: null },
    })

    const user = userEvent.setup()
    render(<AuthModal isOpen mode="login" onModeChange={onModeChange} onClose={onClose} />)

    await user.type(screen.getByLabelText('Username'), 'alice')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(login).toHaveBeenCalledWith({
      username: 'alice',
      password: 'password123',
    })
    expect(setAuth).toHaveBeenCalledWith('token-1', {
      id: '1',
      username: 'alice',
      avatar_url: null,
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('toggles to register and submits register request', async () => {
    const onClose = vi.fn()
    const onModeChange = vi.fn()
    const setAuth = vi.fn()
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth,
      logout: vi.fn(),
    })
    vi.mocked(register).mockResolvedValueOnce({
      token: 'token-2',
      user: { id: '2', username: 'bob', avatar_url: null },
    })

    const user = userEvent.setup()
    const { rerender } = render(
      <AuthModal isOpen mode="login" onModeChange={onModeChange} onClose={onClose} />,
    )

    await user.click(screen.getByRole('button', { name: 'Need an account? Register' }))
    expect(onModeChange).toHaveBeenCalledWith('register')

    rerender(<AuthModal isOpen mode="register" onModeChange={onModeChange} onClose={onClose} />)

    await user.type(screen.getByLabelText('Username'), 'bob')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(register).toHaveBeenCalledWith({
      username: 'bob',
      password: 'password123',
    })
    expect(setAuth).toHaveBeenCalledWith('token-2', {
      id: '2',
      username: 'bob',
      avatar_url: null,
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows an error and keeps modal open when auth fails', async () => {
    const onClose = vi.fn()
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })
    vi.mocked(login).mockRejectedValueOnce(new Error('boom'))

    const user = userEvent.setup()
    render(<AuthModal isOpen mode="login" onModeChange={vi.fn()} onClose={onClose} />)

    await user.type(screen.getByLabelText('Username'), 'alice')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Unexpected client error')
    expect(onClose).not.toHaveBeenCalled()
  })
})
