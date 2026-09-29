import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { aiAPI, userAPI } from '../services/api'

const companyDetails = {
  google: {
    name: 'Google',
    color: 'from-blue-500 to-green-500',
    focus: 'Focus on algorithms, time complexity, system design and problem solving.',
    prompt: 'Generate 5 Google interview questions focusing on algorithms, data structures, system design, and problem solving skills that Google typically asks.'
  },
  microsoft: {
    name: 'Microsoft',
    color: 'from-blue-600 to-blue-400',
    focus: 'Focus on OOP, DSA, system design and behavioral questions.',
    prompt: 'Generate 5 Microsoft interview questions focusing on object oriented design, data structures, algorithms, and behavioral questions that Microsoft typically asks.'
  },
  amazon: {
    name: 'Amazon',
    color: 'from-orange-500 to-yellow-400',
    focus: 'Focus on Leadership Principles, DSA and system design.',
    prompt: 'Generate 5 Amazon interview questions focusing on Leadership Principles like customer obsession, ownership, and invent and simplify, along with system design questions.'
  },
  adobe: {
    name: 'Adobe',
    color: 'from-red-600 to-red-400',
    focus: 'Focus on DSA, OOP and creative problem solving.',
    prompt: 'Generate 5 Adobe interview questions focusing on data structures, object oriented programming, creative problem solving and technical fundamentals.'
  },
  flipkart: {
    name: 'Flipkart',
    color: 'from-yellow-500 to-orange-400',
    focus: 'Focus on DSA, system design and problem solving.',
    prompt: 'Generate 5 Flipkart interview questions focusing on algorithms, scalable system design, data structures and problem solving.'
  },
  infosys: {
    name: 'Infosys',
    color: 'from-green-600 to-teal-400',
    focus: 'Focus on technical fundamentals, aptitude and HR.',
    prompt: 'Generate 5 Infosys interview questions focusing on technical fundamentals, logical reasoning, and HR behavioral questions.'
  }
}

export default function CompanyInterviewSession() {
  const { company } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [evaluations, setEvaluations] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [loadingEval, setLoadingEval] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState('')

  const companyInfo = companyDetails[company?.toLowerCase()]

  useEffect(() => {
    if (!companyInfo) {
      navigate('/company-interview')
      return
    }
    generateQuestions()
  }, [company])

  const generateQuestions = async () => {
    setLoadingQuestions(true)
    setError('')
    try {
      const resume = localStorage.getItem('userResume') || ''
      const fullPrompt = resume
        ? `${companyInfo.prompt} Also consider this candidate background: ${resume.slice(0, 300)}`
        : companyInfo.prompt

      const response = await aiAPI.generateQuestions({
        resumeText: fullPrompt,
        company: companyInfo.name,
        count: 5
      })
      setQuestions(response.data.questions || [])
    } catch (err) {
      setError('Failed to generate questions. Please try again.')
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }))
  }

  const handleEvaluate = async () => {
    const answer = answers[currentQuestion]
    if (!answer?.trim()) {
      setError('Please write an answer before evaluating.')
      return
    }
    setLoadingEval(true)
    setError('')
    try {
      const response = await aiAPI.evaluateAnswer({
        question: questions[currentQuestion],
        answer
      })
      setEvaluations(prev => ({ ...prev, [currentQuestion]: response.data }))
    } catch (err) {
      setError('Failed to evaluate answer.')
    } finally {
      setLoadingEval(false)
    }
  }

  const handleFinish = async () => {
    setEvaluating(true)
    setError('')

    try {
      const newEvaluations = { ...evaluations }

      for (let i = 0; i < questions.length; i++) {
        if (!newEvaluations[i] && answers[i]?.trim()) {
          try {
            const response = await aiAPI.evaluateAnswer({
              question: questions[i],
              answer: answers[i]
            })
            newEvaluations[i] = response.data
          } catch (err) {
            newEvaluations[i] = { score: 0, feedback: 'Could not evaluate this answer.' }
          }
        }
      }

      setEvaluations(newEvaluations)

      const scores = Object.values(newEvaluations).map(e => e.score || 0)
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

      const questionDetails = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || '',
        score: newEvaluations[i]?.score || 0,
        feedback: newEvaluations[i]?.feedback || 'Not attempted'
      }))

      await userAPI.saveInterviewResult({
        category: companyInfo.name,
        score: avgScore,
        questions: questionDetails
      })
    } catch (err) {
      console.error('Failed to save result:', err)
    } finally {
      setEvaluating(false)
      setSubmitted(true)
    }
  }

  const totalScore = () => {
    const scores = Object.values(evaluations).map(e => e.score || 0)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Generating {companyInfo?.name} interview questions...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow p-8 w-full max-w-lg text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-semibold text-slate-900">Interview Complete!</h2>
          <p className="text-slate-500 mt-2">{companyInfo?.name} Interview</p>

          <div className="mt-6 bg-blue-50 rounded-2xl p-6">
            <p className="text-5xl font-bold text-blue-600">{totalScore()}/100</p>
            <p className="text-slate-600 mt-2">
              Evaluated: {Object.keys(evaluations).length} / {questions.length} answers
            </p>
          </div>

          <div className="mt-6 space-y-3 text-left">
            {questions.map((q, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-slate-700">Q{i + 1}: {q.slice(0, 60)}...</p>
                {evaluations[i] ? (
                  <>
                    <p className="text-sm text-blue-600 font-bold mt-1">Score: {evaluations[i].score}/100</p>
                    <p className="text-xs text-slate-500 mt-1">{evaluations[i].feedback}</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Not evaluated</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => { setSubmitted(false); setCurrentQuestion(0); setAnswers({}); setEvaluations({}); generateQuestions() }}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Retry with New Questions
            </button>
            <button
              onClick={() => navigate('/company-interview')}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-full font-semibold hover:bg-slate-200 transition"
            >
              Try Another Company
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-full font-semibold hover:bg-slate-200 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/company-interview')}
          className="text-blue-600 hover:underline text-sm mb-6 block"
        >
          ← Back to Companies
        </button>

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-900">{companyInfo?.name} Interview</h2>
            <span className="text-sm text-slate-500">{currentQuestion + 1} / {questions.length}</span>
          </div>
          <p className="text-sm text-slate-400 mb-6">{companyInfo?.focus}</p>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-blue-600 font-semibold mb-2">Question {currentQuestion + 1}</p>
            <p className="text-slate-800 text-lg font-medium">{questions[currentQuestion]}</p>
          </div>

          <textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            rows={6}
            placeholder="Type your answer here..."
            className="w-full border border-slate-300 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleEvaluate}
            disabled={loadingEval}
            className="mt-3 px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loadingEval ? 'Evaluating...' : 'Evaluate This Answer'}
          </button>

          {evaluations[currentQuestion] && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4">
              <p className="text-green-700 font-bold">Score: {evaluations[currentQuestion].score}/100</p>
              <p className="text-slate-600 text-sm mt-1">{evaluations[currentQuestion].feedback}</p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                disabled={evaluating}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {evaluating ? 'AI Evaluating...' : 'Finish Interview'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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