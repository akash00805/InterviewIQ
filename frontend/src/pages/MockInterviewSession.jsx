import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { aiAPI, userAPI } from '../services/api'
import { useAuth } from '../hooks/useAuth'

const categoryNames = {
  dsa: 'DSA', dbms: 'DBMS', os: 'OS', cn: 'CN', oop: 'OOP', hr: 'HR'
}

export default function MockInterviewSession() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [evaluations, setEvaluations] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [loadingEval, setLoadingEval] = useState(false)
  const [error, setError] = useState('')
  const [resume, setResume] = useState('')

  const categoryName = categoryNames[category?.toLowerCase()] || category

  useEffect(() => {
    if (!categoryNames[category?.toLowerCase()]) {
      navigate('/mock-interview')
      return
    }
    const savedResume = localStorage.getItem('userResume') || ''
    setResume(savedResume)
    generateQuestions(savedResume)
  }, [category])

  const generateQuestions = async (resumeText) => {
    setLoadingQuestions(true)
    setError('')
    try {
      const categoryPrompts = {
        dsa: 'Generate 5 Data Structures and Algorithms interview questions covering arrays, linked lists, trees, graphs, sorting, searching and time complexity.',
        dbms: 'Generate 5 Database Management System interview questions covering normalization, SQL, ACID properties, indexing, joins, transactions and NoSQL.',
        os: 'Generate 5 Operating System interview questions covering processes, threads, deadlock, memory management, scheduling algorithms and virtual memory.',
        cn: 'Generate 5 Computer Networks interview questions covering OSI model, TCP/IP, DNS, HTTP, routing protocols, subnetting and network security.',
        oop: 'Generate 5 Object Oriented Programming interview questions covering inheritance, polymorphism, encapsulation, abstraction, design patterns and SOLID principles.',
        hr: 'Generate 5 HR behavioral interview questions covering teamwork, leadership, conflict resolution, strengths, weaknesses and career goals.'
      }

      const categoryPrompt = categoryPrompts[category?.toLowerCase()] ||
        `Generate 5 ${categoryName} interview questions.`

      const fullPrompt = resumeText
        ? `${categoryPrompt} Also consider this candidate background: ${resumeText.slice(0, 300)}`
        : categoryPrompt

      const response = await aiAPI.generateQuestions({
        resumeText: fullPrompt,
        company: categoryName,
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

  const handleEvaluateCurrent = async () => {
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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

const handleSubmit = async () => {
  const scores = Object.values(evaluations).map(e => e.score || 0)
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  const questionDetails = questions.map((q, i) => ({
    question: q,
    answer: answers[i] || '',
    score: evaluations[i]?.score || 0,
    feedback: evaluations[i]?.feedback || 'Not evaluated'
  }))

  try {
    await userAPI.saveInterviewResult({
      category: categoryName,
      score: avgScore,
      questions: questionDetails
    })
  } catch (err) {
    console.error('Failed to save result:', err)
  }
  setSubmitted(true)
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
          <p className="text-slate-600 font-medium">Generating {categoryName} questions with AI...</p>
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
          <p className="text-slate-500 mt-2">{categoryName} Mock Interview</p>

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
              onClick={() => { setSubmitted(false); setCurrentQuestion(0); setAnswers({}); setEvaluations({}); generateQuestions(resume) }}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Retry with New Questions
            </button>
            <button
              onClick={() => navigate('/mock-interview')}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-full font-semibold hover:bg-slate-200 transition"
            >
              Try Another Category
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
          onClick={() => navigate('/mock-interview')}
          className="text-blue-600 hover:underline text-sm mb-6 block"
        >
          ← Back to Categories
        </button>

        <div className="bg-white rounded-3xl shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">{categoryName} Interview</h2>
            <span className="text-sm text-slate-500">{currentQuestion + 1} / {questions.length}</span>
          </div>

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
            onClick={handleEvaluateCurrent}
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
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Finish Interview
              </button>
            ) : (
              <button
                onClick={handleNext}
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