import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { AuthUser } from '../types/auth.types'
import { useAuthStore } from './authStore'

const AUTH_STORAGE_KEY = 'auth-storage'

function makeUser(): AuthUser {
  return {
    id: 'user-1',
    username: 'alice',
    avatar_url: null,
  }
}

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    })
  })

  afterEach(() => {
    useAuthStore.persist.clearStorage()
  })

  it('sets authenticated state when setAuth is called', () => {
    const user = makeUser()

    useAuthStore.getState().setAuth('token-123', user)

    const state = useAuthStore.getState()
    expect(state.token).toBe('token-123')
    expect(state.user).toEqual(user)
    expect(state.isAuthenticated).toBe(true)
  })

  it('clears auth state on logout', () => {
    useAuthStore.getState().setAuth('token-123', makeUser())

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('persists auth fields to localStorage', () => {
    useAuthStore.getState().setAuth('token-123', makeUser())

    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    expect(stored).not.toBeNull()
    expect(stored).toContain('token-123')
    expect(stored).toContain('alice')
  })
})
