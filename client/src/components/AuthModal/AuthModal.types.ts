export type AuthMode = 'login' | 'register'

export interface AuthModalProps {
  isOpen: boolean
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
}
