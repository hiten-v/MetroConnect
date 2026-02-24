import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { pathname }                          = useLocation()
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const navigate                              = useNavigate()
  const isAdminPage                           = pathname.startsWith('/admin')
  const [menuOpen,   setMenuOpen]             = useState(false)
  const [lightMode,  setLightMode]            = useState(
    () => localStorage.getItem('metro-theme') === 'light'
  )

  // Apply / remove .light class on <html> whenever lightMode changes
  useEffect(() => {
    const root = document.documentElement
    if (lightMode) {
      root.classList.add('light')
      localStorage.setItem('metro-theme', 'light')
    } else {
      root.classList.remove('light')
      localStorage.setItem('metro-theme', 'dark')
    }
  }, [lightMode])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-surface border-b border-metro sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 md:px-6 h-[60px]">


        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn && (
            <Link to="/"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${!isAdminPage ? 'bg-accent text-white' : 'text-muted border border-metro hover:bg-surface2'}`}>
              Book
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isAdminPage ? 'bg-accent text-white' : 'text-muted border border-metro hover:bg-surface2'}`}>
              Admin
            </Link>
          )}

          {/* ── Theme toggle ── */}
          <button
            onClick={() => setLightMode(v => !v)}
            title={lightMode ? 'Switch to Dark' : 'Switch to Dim Mode'}

            // title={lightMode ? 'Switch to Dark' : 'Switch to Light'}
            className="w-9 h-9 rounded-lg border border-metro bg-surface2 flex items-center
                       justify-center text-base hover:border-accent transition-all duration-200"
          >
          {lightMode ? '🌑' : '🔆'}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 ml-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface2 border border-metro rounded-lg">
                <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
                {isAdmin && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <button onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-muted border border-metro hover:bg-surface2 hover:text-red-400 transition-all">
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted border border-metro hover:bg-surface2 transition-all">
                Sign in
              </Link>
              <Link to="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-bold bg-accent text-white hover:bg-accent-h transition-all">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Theme toggle on mobile too */}
          <button
            onClick={() => setLightMode(v => !v)}
            className="w-8 h-8 rounded-lg border border-metro bg-surface2 flex items-center justify-center text-sm"
          >
            {lightMode ? '🌑' : '🔆'}
          </button>

          {isLoggedIn && (
            <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center text-accent text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-9 h-9 rounded-lg bg-surface2 border border-metro flex items-center justify-center text-muted"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-metro px-4 py-3 flex flex-col gap-2">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface2 rounded-xl mb-1">
                <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-accent text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user?.name}</div>
                  <div className="text-xs text-muted">{user?.email}</div>
                </div>
                {isAdmin && (
                  <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    ADMIN
                  </span>
                )}
              </div>

              <Link to="/" onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${!isAdminPage ? 'bg-accent text-white' : 'text-muted hover:bg-surface2'}`}>
                Book Tickets
              </Link>

              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isAdminPage ? 'bg-accent text-white' : 'text-muted hover:bg-surface2'}`}>
                  Admin Panel
                </Link>
              )}

              <button onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all text-left">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted border border-metro hover:bg-surface2 text-center transition-all">
                Sign in
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-accent text-white hover:bg-accent-h text-center transition-all">
                Sign up free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
