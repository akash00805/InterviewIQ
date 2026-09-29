import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiAPI } from '../services/api'

const categories = [
  { name: 'DSA', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'DBMS', icon: '🗄️', color: 'from-purple-500 to-pink-500' },
  { name: 'OS', icon: '⚙️', color: 'from-orange-500 to-yellow-500' },
  { name: 'CN', icon: '🌐', color: 'from-green-500 to-teal-500' },
  { name: 'OOP', icon: '🧩', color: 'from-red-500 to-pink-500' },
  { name: 'HR', icon: '🤝', color: 'from-indigo-500 to-purple-500' }
]

const categoryPrompts = {
  DSA: 'Generate 5 Data Structures and Algorithms interview questions covering arrays, linked lists, trees, graphs, sorting and time complexity.',
  DBMS: 'Generate 5 Database Management System interview questions covering normalization, SQL, ACID properties, indexing and transactions.',
  OS: 'Generate 5 Operating System interview questions covering processes, threads, deadlock, memory management and scheduling.',
  CN: 'Generate 5 Computer Networks interview questions covering OSI model, TCP/IP, DNS, HTTP and routing.',
  OOP: 'Generate 5 Object Oriented Programming interview questions covering inheritance, polymorphism, encapsulation and abstraction.',
  HR: 'Generate 5 HR behavioral interview questions covering teamwork, leadership, conflict resolution and career goals.'
}

const bgStyle = { background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }

export default function VoiceInterview() {
  const navigate = useNavigate()
  const [step, setStep] = useState('select')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [evaluations, setEvaluations] = useState({})
  const [isListening, setIsListening] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingEval, setLoadingEval] = useState(false)
  const [error, setError] = useState('')
  const [speechSupported, setSpeechSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false)
    }
  }, [])

  const generateQuestions = async (category) => {
    setLoadingQuestions(true)
    setError('')
    try {
      const resume = localStorage.getItem('userResume') || ''
      const prompt = resume
        ? `${categoryPrompts[category]} Consider this candidate background: ${resume.slice(0, 300)}`
        : categoryPrompts[category]
      const response = await aiAPI.generateQuestions({ resumeText: prompt, company: category, count: 5 })
      setQuestions(response.data.questions || [])
      setStep('interview')
    } catch (err) {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    generateQuestions(category)
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript
      }
      setAnswers(prev => ({ ...prev, [currentQuestion]: (prev[currentQuestion] || '') + finalTranscript }))
    }
    recognition.onerror = (event) => { setError('Microphone error: ' + event.error); setIsListening(false) }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false) }
  }

  const handleEvaluate = async () => {
    const answer = answers[currentQuestion]
    if (!answer?.trim()) { setError('Please speak your answer first.'); return }
    setLoadingEval(true)
    setError('')
    try {
      const response = await aiAPI.evaluateAnswer({ question: questions[currentQuestion], answer })
      setEvaluations(prev => ({ ...prev, [currentQuestion]: response.data }))
    } catch (err) {
      setError('Failed to evaluate answer.')
    } finally {
      setLoadingEval(false)
    }
  }

  const totalScore = () => {
    const scores = Object.values(evaluations).map(e => e.score || 0)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  // Step 1 — Category Selection
  if (step === 'select') {
    return (
      <div className="min-h-screen p-6" style={bgStyle}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-8 transition"
          >
            ← Back to Dashboard
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4">
              🎤
            </div>
            <h2 className="text-3xl font-bold text-white">Voice Interview</h2>
            <p className="text-purple-300 mt-2">Speak your answers — AI will evaluate them!</p>
          </div>

          {!speechSupported && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl text-center">
              ⚠️ Your browser does not support voice recognition. Please use Chrome or Edge.
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl">{error}</div>
          )}

          {loadingQuestions ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-purple-300">Generating questions for {selectedCategory}...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => speechSupported && handleCategorySelect(cat.name)}
                  className={`bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center cursor-pointer hover:bg-white/20 hover:border-purple-400 transition group ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  <p className="text-purple-400 text-xs mt-1">Start speaking →</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl">🎤</p>
              <p className="text-purple-400 text-xs mt-1">Voice recognition</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl">🤖</p>
              <p className="text-purple-400 text-xs mt-1">AI evaluation</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl">📊</p>
              <p className="text-purple-400 text-xs mt-1">Instant score</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2 — Interview
  if (step === 'interview') {
    return (
      <div className="min-h-screen p-6" style={bgStyle}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => { stopListening(); setStep('select'); setCurrentQuestion(0); setAnswers({}); setEvaluations({}) }}
            className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition"
          >
            ← Back to Categories
          </button>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">🎤 {selectedCategory} Voice Interview</h2>
              <span className="text-sm text-purple-300">{currentQuestion + 1} / {questions.length}</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2 mb-8">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              />
            </div>

            {error && <p className="text-red-300 text-sm mb-4">{error}</p>}

            <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
              <p className="text-sm text-purple-400 font-semibold mb-2">Question {currentQuestion + 1}</p>
              <p className="text-white text-lg font-medium">{questions[currentQuestion]}</p>
            </div>

            <div className="text-center mb-4">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto transition shadow-lg hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  🎤
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="w-20 h-20 rounded-full bg-red-500/80 text-white text-3xl hover:bg-red-600 transition shadow-lg mx-auto flex items-center justify-center animate-pulse"
                >
                  ⏹
                </button>
              )}
              <p className="text-sm text-purple-300 mt-3">
                {isListening ? '🔴 Recording... Click to stop' : 'Click microphone to start speaking'}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 mb-4 min-h-24 border border-white/10">
              <p className="text-xs text-purple-400 mb-1">Your answer:</p>
              <p className="text-white text-sm">
                {answers[currentQuestion] || <span className="text-purple-400 italic">Your speech will appear here...</span>}
              </p>
            </div>

            {answers[currentQuestion] && (
              <button
                onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: '' }))}
                className="text-sm text-red-400 hover:text-red-300 mb-4 block transition"
              >
                Clear answer
              </button>
            )}

            <button
              onClick={handleEvaluate}
              disabled={loadingEval || !answers[currentQuestion]}
              className="w-full mt-2 px-5 py-3 rounded-2xl text-white text-sm font-semibold transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              {loadingEval ? 'Evaluating...' : 'Evaluate This Answer'}
            </button>

            {evaluations[currentQuestion] && (
              <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                <p className="text-green-300 font-bold">Score: {evaluations[currentQuestion].score}/100</p>
                <p className="text-purple-200 text-sm mt-1">{evaluations[currentQuestion].feedback}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => { stopListening(); if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1) }}
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition disabled:opacity-40 border border-white/20"
              >
                ← Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={() => { stopListening(); setStep('result') }}
                  className="px-6 py-3 rounded-2xl bg-green-500/80 text-white font-semibold hover:bg-green-600 transition"
                >
                  Finish Interview
                </button>
              ) : (
                <button
                  onClick={() => { stopListening(); setCurrentQuestion(prev => prev + 1) }}
                  className="px-6 py-3 rounded-2xl text-white font-semibold transition"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3 — Result
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={bgStyle}>
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg text-center border border-white/20">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-white">Voice Interview Complete!</h2>
        <p className="text-purple-300 mt-2">{selectedCategory} Interview</p>

        <div className="mt-6 bg-white/10 rounded-2xl p-6 border border-white/20">
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {totalScore()}/100
          </p>
          <p className="text-purple-300 mt-2">
            Evaluated: {Object.keys(evaluations).length} / {questions.length} answers
          </p>
        </div>

        <div className="mt-6 space-y-3 text-left">
          {questions.map((q, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-sm font-semibold text-white">Q{i + 1}: {q.slice(0, 60)}...</p>
              {evaluations[i] ? (
                <>
                  <p className="text-sm text-blue-300 font-bold mt-1">Score: {evaluations[i].score}/100</p>
                  <p className="text-xs text-purple-300 mt-1">{evaluations[i].feedback}</p>
                </>
              ) : (
                <p className="text-xs text-purple-400 mt-1">Not evaluated</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => { setStep('select'); setCurrentQuestion(0); setAnswers({}); setEvaluations({}) }}
            className="w-full py-3 rounded-2xl text-white font-semibold transition"
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition border border-white/20"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}