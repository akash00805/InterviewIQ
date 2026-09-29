import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../services/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalInterviews: 0, averageScore: 0 })
  const [recentInterviews, setRecentInterviews] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userAPI.getProfile()
        const interviewStats = response.data?.interviewStats
        if (interviewStats) {
          setStats(interviewStats)
          setRecentInterviews(interviewStats.recentInterviews || [])
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              IQ
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">InterviewIQ</h1>
              <p className="text-xs text-purple-300">AI-powered interview prep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-purple-400"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div className="text-right hidden md:block">
              <p className="text-xs text-purple-300">Signed in as</p>
              <p className="text-sm font-semibold text-white">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition border border-white/20"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/80 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
          <section className="space-y-6">

            {/* Welcome Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome back, {user?.firstName}! 👋
                  </h2>
                  <p className="text-purple-300 mt-2">
                    Your interview preparation dashboard is ready. Track your progress and launch your next mock interview.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/practice')}
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  Start AI Practice →
                </button>
              </div>
            </div>

            {/* Stats + Recent */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Interview Progress */}
              <article className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white">Interview Progress</h3>
                <p className="mt-1 text-sm text-purple-300">Track your completed interviews and scores.</p>
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                    <p className="text-4xl font-bold text-white">{stats.totalInterviews}</p>
                    <p className="text-sm text-purple-300 mt-1">Completed mocks</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {stats.averageScore}%
                    </p>
                    <p className="text-sm text-purple-300 mt-1">Average score</p>
                  </div>
                </div>
              </article>

              {/* Recent Interviews */}
              <article className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white">Recent Interviews</h3>
                {recentInterviews.length === 0 ? (
                  <ul className="mt-4 space-y-3">
                    <li className="rounded-2xl bg-white/5 p-4 text-purple-300 text-sm">Upload your resume to get personalized AI questions.</li>
                    <li className="rounded-2xl bg-white/5 p-4 text-purple-300 text-sm">Practice technical and HR interviews.</li>
                    <li className="rounded-2xl bg-white/5 p-4 text-purple-300 text-sm">Review your improvement recommendations.</li>
                  </ul>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {recentInterviews.slice(0, 5).map((interview, i) => (
                      <li
                        key={i}
                        onClick={() => navigate(`/interview-result/${i}`)}
                        className="rounded-2xl bg-white/5 p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 transition border border-white/10"
                      >
                        <div>
                          <p className="font-semibold text-white">{interview.category}</p>
                          <p className="text-xs text-purple-400 mt-1">
                            {new Date(interview.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`text-lg font-bold ${interview.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                            {interview.score}%
                          </div>
                          <span className="text-purple-400 text-sm">→</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          </section>

          <aside className="space-y-6">

            {/* Profile Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Summary</h3>

              {/* Profile Photo */}
              <div className="flex items-center gap-4 mb-5">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-400"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                    {user?.firstName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-white text-lg">{user?.firstName} {user?.lastName}</p>
                  <p className="text-purple-300 text-sm">@{user?.username}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-xs uppercase tracking-widest text-purple-400">Email</p>
                  <p className="mt-1 font-medium text-white text-sm">{user?.email}</p>
                </div>
                {user?.targetCompanies?.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <p className="text-xs uppercase tracking-widest text-purple-400">Target Companies</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.targetCompanies.map((company, i) => (
                        <span key={i} className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white">What's next?</h3>
              <p className="mt-2 text-sm text-purple-300">
                Prepare for AI-generated technical, HR, and company-specific interview questions.
              </p>
              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => navigate('/resume-upload')}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/10 text-left flex items-center gap-3"
                >
                  <span>📄</span> Resume Upload
                </button>
                <button
                  onClick={() => navigate('/mock-interview')}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/10 text-left flex items-center gap-3"
                >
                  <span>🎯</span> Mock Interview
                </button>
                <button
                  onClick={() => navigate('/company-interview')}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/10 text-left flex items-center gap-3"
                >
                  <span>🏢</span> Company Interview
                </button>
                <button
                  onClick={() => navigate('/voice-interview')}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/10 text-left flex items-center gap-3"
                >
                  <span>🎤</span> Voice Interview
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}