import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { userAPI } from '../services/api'

const availableCompanies = [
  'Google', 'Microsoft', 'Amazon', 'Adobe',
  'Flipkart', 'Infosys', 'TCS', 'Wipro',
  'Meta', 'Apple', 'Netflix', 'Uber'
]

const bgStyle = { background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }

export default function Profile() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [targetCompanies, setTargetCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState(null)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setTargetCompanies(user.targetCompanies || [])
      setPreviewPhoto(user.profilePicture || null)
    }
  }, [user])

  const toggleCompany = (company) => {
    setTargetCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    )
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be less than 2MB')
      return
    }
    setPhotoLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const response = await userAPI.uploadPhoto(formData)
      setPreviewPhoto(response.data.profilePicture)
      await refreshUser()
      setSuccess('Photo updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to upload photo. Please try again.')
    } finally {
      setPhotoLoading(false)
    }
  }

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await userAPI.updateProfile({ firstName, lastName, targetCompanies })
      await refreshUser()
      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6" style={bgStyle}>
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
            👤
          </div>
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-2xl font-medium">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl">
            ⚠️ {error}
          </div>
        )}

        {/* Profile Photo */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-400 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              {previewPhoto ? (
                <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-white font-bold">
                  {user?.firstName?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div>
              <label className="cursor-pointer">
                <span className={`px-4 py-2 rounded-full text-sm font-medium transition text-white ${
                  photoLoading ? 'opacity-50' : 'hover:opacity-90'
                }`}
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  {photoLoading ? 'Uploading...' : 'Upload Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={photoLoading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-purple-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-purple-400"
              />
              <p className="text-xs text-purple-500 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-purple-400"
              />
              <p className="text-xs text-purple-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Target Companies */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-1">Target Companies</h3>
          <p className="text-sm text-purple-300 mb-4">Select companies you are preparing for</p>

          <div className="flex flex-wrap gap-3">
            {availableCompanies.map((company) => (
              <button
                key={company}
                onClick={() => toggleCompany(company)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  targetCompanies.includes(company)
                    ? 'text-white'
                    : 'bg-white/10 text-purple-300 hover:bg-white/20 border border-white/20'
                }`}
                style={targetCompanies.includes(company)
                  ? { background: 'linear-gradient(135deg, #667eea, #764ba2)' }
                  : {}}
              >
                {targetCompanies.includes(company) ? '✓ ' : ''}{company}
              </button>
            ))}
          </div>

          {targetCompanies.length > 0 && (
            <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
              <p className="text-sm text-purple-200 font-medium">
                Selected: {targetCompanies.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Interview Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {user?.interviewStats?.totalInterviews || 0}
              </p>
              <p className="text-sm text-purple-300 mt-1">Total Interviews</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                {user?.interviewStats?.averageScore || 0}%
              </p>
              <p className="text-sm text-purple-300 mt-1">Average Score</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-semibold text-white transition disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
        >
          {loading ? 'Saving...' : 'Save Profile →'}
        </button>
      </div>
    </div>
  )
}