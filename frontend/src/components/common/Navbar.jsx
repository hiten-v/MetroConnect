import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { pathname }              = useLocation()
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const navigate                  = useNavigate()
  const isAdmin_page              = pathname.startsWith('/admin')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 h-[60px] bg-surface border-b border-metro sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center text-white font-bold text-base">
          M
        </div>
        <span className="font-bold text-lg text-[#e8eaf6]">MetroLink</span>
        <span className="text-xs text-muted -ml-1 hidden sm:block">by MoveInSync</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Book nav — only for logged-in users */}
        {isLoggedIn && (
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${!isAdmin_page
                ? 'bg-accent text-white'
                : 'text-muted border border-metro hover:bg-surface2'}`}
          >
            🚇 Book
          </Link>
        )}

        {/* Admin nav — only for admins */}
        {isAdmin && (
          <Link
            to="/admin"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isAdmin_page
                ? 'bg-accent text-white'
                : 'text-muted border border-metro hover:bg-surface2'}`}
          >
            ⚙️ Admin
          </Link>
        )}

        {/* Logged in — user chip + logout */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 ml-2">
            {/* User avatar chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface2 border border-metro rounded-lg">
              <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-[#e8eaf6] font-medium hidden sm:block">{user?.name}</span>
              {isAdmin && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold hidden sm:block">
                  ADMIN
                </span>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm text-muted border border-metro hover:bg-surface2 hover:text-red-400 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        ) : (
          /* Not logged in — show login/signup */
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted border border-metro hover:bg-surface2 transition-all duration-200"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 rounded-lg text-sm font-bold bg-accent text-white hover:bg-accent-h transition-all duration-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}