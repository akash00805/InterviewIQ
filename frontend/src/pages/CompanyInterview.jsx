import { useNavigate } from 'react-router-dom'

const companies = [
  {
    name: 'Google',
    icon: '🔵',
    color: 'from-blue-500 to-green-500',
    desc: 'DSA, System Design, Problem Solving',
  },
  {
    name: 'Microsoft',
    icon: '🟦',
    color: 'from-blue-600 to-blue-400',
    desc: 'DSA, OOP, Behavioral, System Design',
  },
  {
    name: 'Amazon',
    icon: '🟠',
    color: 'from-orange-500 to-yellow-400',
    desc: 'Leadership Principles, DSA, System Design',
  },
  {
    name: 'Adobe',
    icon: '🔴',
    color: 'from-red-600 to-red-400',
    desc: 'DSA, Creative Problem Solving, OOP',
  },
  {
    name: 'Flipkart',
    icon: '🟡',
    color: 'from-yellow-500 to-orange-400',
    desc: 'DSA, System Design, Problem Solving',
  },
  {
    name: 'Infosys',
    icon: '🟢',
    color: 'from-green-600 to-teal-400',
    desc: 'Aptitude, Technical, HR',
  }
]

export default function CompanyInterview() {
  const navigate = useNavigate()

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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xl">
              🏢
            </div>
            <h2 className="text-3xl font-bold text-white">Company Interview</h2>
          </div>
          <p className="text-purple-300">
            Select a company to practice interview questions tailored to their style.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div
              key={company.name}
              onClick={() => navigate(`/company-interview/${company.name.toLowerCase()}`)}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 hover:border-purple-400 transition group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                {company.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{company.name}</h3>
              <p className="text-sm text-purple-300 mt-1">{company.desc}</p>
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
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-purple-400 text-xs mt-1">Companies available</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">AI</p>
            <p className="text-purple-400 text-xs mt-1">Tailored questions</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-purple-400 text-xs mt-1">Questions per session</p>
          </div>
        </div>
      </div>
    </div>
  )
}