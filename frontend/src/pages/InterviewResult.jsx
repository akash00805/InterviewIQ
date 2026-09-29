import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { userAPI } from '../services/api'

export default function InterviewResult() {
  const { index } = useParams()
  const navigate = useNavigate()
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await userAPI.getInterviewResult(index)
        setInterview(response.data)
      } catch (err) {
        setError('Failed to load interview result.')
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [index])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || 'Interview not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const attempted = interview.questions?.filter(q => q.answer?.trim()).length || 0
  const evaluated = interview.questions?.filter(q => q.score > 0).length || 0

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline text-sm mb-6 block"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {interview.category} Interview
              </h2>
              <p className="text-slate-500 mt-1">
                {new Date(interview.date).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${interview.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                {interview.score}%
              </p>
              <p className="text-slate-500 text-sm">Overall Score</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{interview.questions?.length || 0}</p>
              <p className="text-sm text-slate-500">Total Questions</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{attempted}</p>
              <p className="text-sm text-slate-500">Attempted</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{evaluated}</p>
              <p className="text-sm text-slate-500">Evaluated</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {interview.questions?.map((q, i) => (
            <div key={i} className="bg-white rounded-3xl shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold text-blue-600">Question {i + 1}</p>
                {q.score > 0 && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    q.score >= 70
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {q.score}/100
                  </span>
                )}
              </div>

              <p className="text-slate-800 font-medium mb-4">{q.question}</p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-3">
                <p className="text-xs text-slate-400 mb-1">Your Answer:</p>
                <p className="text-slate-700 text-sm">
                  {q.answer?.trim() ? q.answer : <span className="italic text-slate-400">No answer provided</span>}
                </p>
              </div>

              {q.feedback && q.feedback !== 'Not evaluated' && (
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-xs text-blue-400 mb-1">AI Feedback:</p>
                  <p className="text-slate-700 text-sm">{q.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/mock-interview')}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Practice Again
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