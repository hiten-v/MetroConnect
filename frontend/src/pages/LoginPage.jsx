import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      // Admins go to admin panel, users go to booking
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-surface border border-metro rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#e8eaf6]">Welcome back</h1>
            <p className="text-muted text-sm mt-1">Sign in to book metro tickets</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-5">
             {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-sm bg-accent text-white
                         hover:bg-accent-h disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-accent/20"
            >
              {loading ? 'Signing in...' : '→ Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:text-accent-h font-medium transition-colors">
              Sign up free
            </Link>
          </p>

          {/* Admin hint */}
          <div className="mt-6 p-3 bg-surface2 rounded-xl border border-metro text-center">
            <p className="text-xs text-muted">
              Admin?{' '}
              <span className="text-accent font-mono">Use your admin email & password</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Field({ label, name, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-surface2 border border-metro rounded-xl px-4 py-3 text-sm text-[#e8eaf6]
                   placeholder:text-muted outline-none focus:border-accent transition-colors duration-200"
      />
    </div>
  )
}