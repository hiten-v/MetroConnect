import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader } from './Loader'

// Requires login
export function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-[80vh]"><Loader text="Checking session..." /></div>
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

// Requires admin role
export function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-[80vh]"><Loader text="Checking session..." /></div>
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin)    return <Navigate to="/" replace />
  return children
}