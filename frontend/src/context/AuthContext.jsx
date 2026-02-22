import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)  // checking stored token on mount

  // On app load — check if token exists and is still valid
  useEffect(() => {
    const token = localStorage.getItem('metro-token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('metro-token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/signup', { name, email, password })
    localStorage.setItem('metro-token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('metro-token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('metro-token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}