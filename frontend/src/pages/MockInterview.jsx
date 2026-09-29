import { useNavigate } from 'react-router-dom'

export default function MockInterview() {
  const navigate = useNavigate()

  const categories = [
    { name: 'DSA', icon: '💻', desc: 'Data Structures & Algorithms', color: 'from-blue-500 to-cyan-500' },
    { name: 'DBMS', icon: '🗄️', desc: 'Database Management Systems', color: 'from-purple-500 to-pink-500' },
    { name: 'OS', icon: '⚙️', desc: 'Operating Systems', color: 'from-orange-500 to-yellow-500' },
    { name: 'CN', icon: '🌐', desc: 'Computer Networks', color: 'from-green-500 to-teal-500' },
    { name: 'OOP', icon: '🧩', desc: 'Object Oriented Programming', color: 'from-red-500 to-pink-500' },
    { name: 'HR', icon: '🤝', desc: 'HR & Behavioural Questions', color: 'from-indigo-500 to-purple-500' },
  ]

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
    >
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-8 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
              🎯
            </div>
            <h2 className="text-3xl font-bold text-white">Mock Interview</h2>
          </div>
          <p className="text-purple-300">Select a category to start your AI-powered mock interview.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/mock-interview/${cat.name.toLowerCase()}`)}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 hover:border-purple-400 transition group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{cat.name}</h3>
              <p className="text-sm text-purple-300 mt-1">{cat.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-purple-400 text-xs">
                <span>Start interview</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-purple-400 text-xs mt-1">Questions per session</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">AI</p>
            <p className="text-purple-400 text-xs mt-1">Powered evaluation</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-purple-400 text-xs mt-1">Categories available</p>
          </div>
        </div>
      </div>
    </div>
  )
}