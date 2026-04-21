import type { AuthUser } from '../types/auth.types'
import { useAuthStore } from '../store/authStore'

export interface UseAuthResult {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

export function useAuth(): UseAuthResult {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout,
  }
}
