import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RegistrationSuccess from '../components/RegistrationSuccess'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [localError, setLocalError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setLocalError('All fields are required')
      return
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      await register(formData)
      setShowSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const apiError = err.response?.data?.error || err.response?.data?.details || err.message
      setLocalError(apiError || 'Registration failed')
    }
  }

  return (
    <>
      {showSuccess && (
        <RegistrationSuccess onDismiss={() => navigate('/login')} />
      )}

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
              Start Your Journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                To Success
              </span>
            </h2>
            <p className="text-purple-300 text-lg leading-relaxed">
              Join thousands of candidates who have cracked their dream interviews with InterviewIQ.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-white font-medium">Free to Get Started</p>
                  <p className="text-purple-300 text-sm">No credit card required</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-white font-medium">AI-Powered Questions</p>
                  <p className="text-purple-300 text-sm">Tailored to your resume and goals</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-white font-medium">Track Your Progress</p>
                  <p className="text-purple-300 text-sm">See your improvement over time</p>
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

        {/* Right Side — Register Form */}
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

              <div className="flex items-center mb-4">
  <Link
    to="/login"
    className="flex items-center gap-2 text-purple-300 hover:text-white text-sm transition"
  >
    ← Back to Login
  </Link>
</div>
<h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
<p className="text-purple-300 text-sm mb-6">Start your interview preparation journey today.</p>

              {(error || localError) && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl text-sm">
                  ⚠️ {error || localError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Email Address</label>
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
                  <label className="block text-sm font-medium text-purple-200 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Min 6 characters"
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

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-400 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3 text-purple-300 hover:text-white text-sm transition"
                    >
                      {showConfirmPassword ? '🙈 Hide' : '👁 Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-semibold text-sm transition disabled:opacity-50 text-white"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-purple-300 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white hover:text-purple-200 font-semibold underline transition">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Stats */}
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
    </>
  )
}