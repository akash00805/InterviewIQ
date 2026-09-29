import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { parseResumePdf } from '../services/resumeParser'

const bgStyle = { background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }

export default function Practice() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [resumeText, setResumeText] = useState('')
  const [company, setCompany] = useState('')
  const [questions, setQuestions] = useState([])
  const [answerInputs, setAnswerInputs] = useState({})
  const [evaluations, setEvaluations] = useState({})
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResumeFile = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setError('')
    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setLoading(true)
        setStatus('Extracting text from PDF...')
        const res = await parseResumePdf(file)
        const extracted = res?.text
        if (!extracted || !extracted.trim()) {
          setError('Could not extract text from this PDF. Please try another file.')
          setResumeText('')
        } else {
          setResumeText(extracted)
          setStatus(`${file.name} loaded successfully.`)
        }
      } else {
        const text = await file.text()
        setResumeText(text)
        setStatus(`${file.name} loaded successfully.`)
      }
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'PDF parsing failed')
      setResumeText('')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume text or upload a resume.')
      return
    }
    setLoading(true)
    setError('')
    setStatus('Generating personalized questions...')
    try {
      const response = await aiAPI.generateQuestions({ resumeText, company, count: 6 })
      setQuestions(response.data.questions || [])
      setEvaluations({})
      setAnswerInputs({})
      setStatus('Questions generated successfully.')
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to generate questions. Please try again.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (index, value) => {
    setAnswerInputs(prev => ({ ...prev, [index]: value }))
  }

  const handleEvaluate = async (index) => {
    const question = questions[index]
    const answer = answerInputs[index] || ''
    if (!answer.trim()) {
      setError('Please type an answer before evaluation.')
      return
    }
    setLoading(true)
    setError('')
    setStatus('Evaluating your answer...')
    try {
      const response = await aiAPI.evaluateAnswer({ question, answer })
      setEvaluations(prev => ({ ...prev, [index]: response.data }))
      setStatus('Answer evaluated successfully.')
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to evaluate answer. Please try again.')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={bgStyle}>

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-3 transition"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Interview Practice</h1>
                <p className="text-purple-300 text-sm">Upload your resume, generate questions, and evaluate your answers.</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/80 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
          <section className="space-y-6">

            {/* Resume Upload */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-xl font-bold text-white">Resume Upload & Question Generation</h2>
              <p className="text-purple-300 text-sm mt-1">Use your resume to generate personalized mock interview questions.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Upload resume (PDF/TXT/MD)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleResumeFile}
                    className="block w-full rounded-2xl border border-white/20 bg-white/5 p-3 text-purple-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Or paste your resume text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    rows={8}
                    className="block w-full rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                    placeholder="Paste your resume text here..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                    placeholder="Company / role focus (optional)"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    {loading ? 'Working...' : 'Generate Questions →'}
                  </button>
                </div>

                {status && <p className="text-sm text-green-300">✅ {status}</p>}
                {error && <p className="text-sm text-red-300">⚠️ {error}</p>}
              </div>
            </div>

            {/* Generated Questions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white">Generated Questions</h3>

              {/* Average Score */}
              {questions.length > 0 && Object.keys(evaluations).length === questions.length && (
                <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {Math.round(Object.values(evaluations).reduce((a, b) => a + (b.score || 0), 0) / questions.length)}/100
                  </p>
                  <p className="text-purple-300 mt-1 font-medium">Average Score</p>
                  <p className="text-purple-400 text-sm mt-1">
                    {Object.values(evaluations).filter(e => e.score >= 70).length} / {questions.length} answers scored above 70%
                  </p>
                  <button
                    onClick={() => { setQuestions([]); setEvaluations({}); setAnswerInputs({}); setResumeText(''); setStatus('') }}
                    className="mt-4 px-6 py-2 rounded-full text-sm font-semibold text-white transition"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    Start New Practice
                  </button>
                </div>
              )}

              {questions.length === 0 ? (
                <div className="mt-4 text-center py-8">
                  <p className="text-5xl mb-3">📝</p>
                  <p className="text-purple-300">No questions generated yet.</p>
                  <p className="text-purple-400 text-sm mt-1">Upload your resume and click Generate Questions.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {questions.map((question, index) => (
                    <div key={`question-${index}`} className="rounded-2xl border border-white/10 p-6 bg-white/5">
                      <p className="text-purple-400 text-sm font-semibold">Question {index + 1}</p>
                      <p className="mt-2 text-white font-medium">{question}</p>

                      <label className="mt-4 block text-sm font-medium text-purple-200">Your answer</label>
                      <textarea
                        value={answerInputs[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        rows={4}
                        className="mt-2 block w-full rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                        placeholder="Write your answer here..."
                      />

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-start gap-3">
                        <button
                          onClick={() => handleEvaluate(index)}
                          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition"
                          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                        >
                          Evaluate Answer
                        </button>
                        {evaluations[index] && (
                          <div className="rounded-2xl bg-green-500/20 border border-green-500/30 p-4 flex-1">
                            <p className="text-sm font-bold text-green-300">Score: {evaluations[index].score}/100</p>
                            <p className="mt-1 text-sm text-purple-200">{evaluations[index].feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-lg font-bold text-white">AI Practice Mode</h3>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">
                Generate personalized interview questions from your resume and get instant AI feedback on your answers.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <span className="text-green-400">✓</span> Resume-based questions
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <span className="text-green-400">✓</span> AI answer evaluation
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-300">
                  <span className="text-green-400">✓</span> Instant score and feedback
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Profile</h3>
              <div className="flex items-center gap-3 mb-4">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-purple-400" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {user?.firstName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-purple-300 text-xs">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 rounded-2xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition border border-white/20"
              >
                Go to Dashboard
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/mock-interview')}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 text-purple-300 text-sm hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
                >
                  🎯 Mock Interview
                </button>
                <button
                  onClick={() => navigate('/company-interview')}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 text-purple-300 text-sm hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
                >
                  🏢 Company Interview
                </button>
                <button
                  onClick={() => navigate('/voice-interview')}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 text-purple-300 text-sm hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
                >
                  🎤 Voice Interview
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}