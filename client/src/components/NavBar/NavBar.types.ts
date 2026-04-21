export interface NavBarProps {
  isAuthenticated: boolean
  username: string | null
  onLoginClick: () => void
  onRegisterClick: () => void
  onLogoutClick: () => void
}
