import type { JSX } from 'react'

import type { NavBarProps } from './NavBar.types'

export function NavBar({
  isAuthenticated,
  username,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}: NavBarProps): JSX.Element {
  return (
    <header className="mb-4 flex items-center justify-between rounded border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm font-medium">Numeric Discussion</p>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">{`Hi ${username ?? 'there'}`}</span>
          <button
            type="button"
            onClick={onLogoutClick}
            className="rounded border border-slate-300 px-3 py-1 text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded border border-slate-300 px-3 py-1 text-sm cursor-pointer"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="rounded bg-slate-900 px-3 py-1 text-sm text-white cursor-pointer"
          >
            Register
          </button>
        </div>
      )}
    </header>
  )
}
