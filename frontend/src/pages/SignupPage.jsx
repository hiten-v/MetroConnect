import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signup }  = useAuth()
  const navigate    = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3

  const strengthLabel = ['', 'Weak', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-green-500']

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-metro rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              M
            </div>
            <h1 className="text-2xl font-bold text-[#e8eaf6]">Create account</h1>
            <p className="text-muted text-sm mt-1">Start booking metro tickets today</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-5">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="Full Name"
              name="name"
              type="text"
              placeholder="Hiten Sharma"
              value={form.name}
              onChange={handleChange}
            />
            <Field
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

            {/* Password with strength bar */}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-surface2 border border-metro rounded-xl px-4 py-3 text-sm text-[#e8eaf6]
                           placeholder:text-muted outline-none focus:border-accent transition-colors duration-200"
              />
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${i <= strength ? strengthColor[strength] : 'bg-metro'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-semibold
                    ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-green-400'}`}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            <Field
              label="Confirm Password"
              name="confirm"
              type="password"
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={handleChange}
            />

            {/* Match indicator */}
            {form.confirm && (
              <p className={`text-xs -mt-2 ${form.password === form.confirm ? 'text-green-400' : 'text-red-400'}`}>
                {form.password === form.confirm ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 rounded-xl font-bold text-sm bg-accent text-white
                         hover:bg-accent-h disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-accent/20"
            >
              {loading ? '⏳ Creating account...' : '🚇 Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-h font-medium transition-colors">
              Sign in
            </Link>
          </p>
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