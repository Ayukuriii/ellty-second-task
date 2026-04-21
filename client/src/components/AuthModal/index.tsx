import type { FormEvent, JSX } from 'react'
import { useState } from 'react'

import { login, register } from '../../api/auth'
import { toApiError } from '../../api/errors'
import { useAuth } from '../../hooks/useAuth'
import type { AuthModalProps } from './AuthModal.types'

export function AuthModal({ isOpen, mode, onModeChange, onClose }: AuthModalProps): JSX.Element | null {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { setAuth } = useAuth()

  if (!isOpen) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const payload = { username: username.trim(), password }
      const authPayload = mode === 'login' ? await login(payload) : await register(payload)
      setAuth(authPayload.token, authPayload.user)
      onClose()
    } catch (error) {
      const apiError = toApiError(error)
      setErrorMessage(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="auth-modal-title" className="text-lg font-semibold">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-600 cursor-pointer">
            Close
          </button>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm">Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2"
              required
              autoFocus
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2"
              minLength={8}
              required
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-blue-700 cursor-pointer"
            >
              {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60 cursor-pointerma"
            >
              {isSubmitting ? 'Submitting...' : mode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
