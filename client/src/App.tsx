import { useState } from 'react'

import './App.css'
import { AuthModal } from './components/AuthModal'
import type { AuthMode } from './components/AuthModal/AuthModal.types'
import { NavBar } from './components/NavBar'
import { Thread } from './components/Thread'
import { useAuth } from './hooks/useAuth'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const { isAuthenticated, user, logout } = useAuth()

  function openAuthModal(mode: AuthMode): void {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <NavBar
        isAuthenticated={isAuthenticated}
        username={user?.username ?? null}
        onLoginClick={() => openAuthModal('login')}
        onRegisterClick={() => openAuthModal('register')}
        onLogoutClick={logout}
      />
      <h1 className="mb-4 text-2xl font-bold">Numeric Discussion</h1>
      <Thread onRequireAuth={() => openAuthModal('login')} />
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  )
}

export default App
