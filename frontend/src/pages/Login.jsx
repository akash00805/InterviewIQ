import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [localError, setLocalError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required')
      return
    }

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              IQ
            </div>
            <h1 className="text-3xl font-bold text-white">InterviewIQ</h1>
          </div>
          <p className="text-purple-300 text-lg">Your AI-Powered Interview Coach</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Ace Your Next<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Dream Interview
            </span>
          </h2>
          <p className="text-purple-300 text-lg leading-relaxed">
            Practice with AI-generated questions, get real-time feedback, and track your progress.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-white font-medium">Smart Question Generation</p>
                <p className="text-purple-300 text-sm">Personalized for your resume & target company</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-white font-medium">Real-time AI Evaluation</p>
                <p className="text-purple-300 text-sm">Instant scores and detailed feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl">🎤</span>
              <div>
                <p className="text-white font-medium">Voice Interview Mode</p>
                <p className="text-purple-300 text-sm">Speak your answers like a real interview</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl">🏢</span>
              <div>
                <p className="text-white font-medium">Company Specific Prep</p>
                <p className="text-purple-300 text-sm">Google, Amazon, Microsoft & more</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-purple-400 text-sm">© 2026 InterviewIQ. All rights reserved.</p>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                IQ
              </div>
              <h1 className="text-2xl font-bold text-white">InterviewIQ</h1>
              <p className="text-purple-300 text-sm mt-1">AI-Powered Interview Preparation</p>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
            <p className="text-purple-300 text-sm mb-6">Sign in to continue your preparation.</p>

            {(error || localError) && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl text-sm">
                ⚠️ {error || localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-purple-300 hover:text-white text-sm transition"
                  >
                    {showPassword ? '🙈 Hide' : '👁 Show'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-300 hover:text-white transition"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-purple-300 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-white hover:text-purple-200 font-semibold underline transition">
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Stats below card */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-purple-400 text-xs">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6+</p>
              <p className="text-purple-400 text-xs">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">AI</p>
              <p className="text-purple-400 text-xs">Powered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}