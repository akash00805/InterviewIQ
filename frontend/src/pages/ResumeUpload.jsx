import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseResumePdf } from '../services/resumeParser'

export default function ResumeUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
    setError('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError('')

    try {
      let text = ''

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const response = await parseResumePdf(file)
        text = response.text
      } else {
        text = await file.text()
      }

      if (!text.trim()) {
        setError('Could not extract text. Please try a different file.')
        setLoading(false)
        return
      }

      localStorage.setItem('userResume', text)
      setMessage('Resume uploaded! AI will use it for mock interviews.')
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Failed: ${err.message || err.response?.data?.error || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition"
          >
            ← Back to Dashboard
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                📄
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Resume Upload</h2>
                <p className="text-purple-300 text-sm">Power your interviews with AI</p>
              </div>
            </div>
            <p className="text-purple-300 text-sm">
              Upload your resume PDF to get personalized AI-powered interview questions.
            </p>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-2xl">
              ✅ {message}
              <button
                onClick={() => navigate('/mock-interview')}
                className="block mt-2 text-blue-300 hover:text-white text-sm transition"
              >
                Go to Mock Interview →
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-purple-400 transition cursor-pointer">
              <div className="text-5xl mb-3">📄</div>
              <p className="text-white font-medium mb-3">Upload your resume</p>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileChange}
                className="w-full text-purple-300 text-sm"
              />
              <p className="text-xs text-purple-400 mt-3">Supported: PDF, TXT, MD</p>
              <p className="text-xs text-purple-400 mt-1">
                Tip: For PDFs, we extract text automatically.
              </p>
            </div>

            {/* Selected File */}
            {file && (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📎</span>
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-purple-400 text-xs mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-white transition disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
            >
              {loading ? 'Reading resume...' : 'Upload Resume →'}
            </button>
          </form>

          {/* Already saved notice */}
          {localStorage.getItem('userResume') && !message && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-center">
              <p className="text-blue-300 text-sm font-medium">✅ Resume already saved!</p>
              <button
                onClick={() => navigate('/mock-interview')}
                className="text-purple-300 hover:text-white text-sm mt-1 transition"
              >
                Go to Mock Interview →
              </button>
            </div>
          )}
        </div>

        {/* Tips below card */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-lg mb-1">🎯</p>
            <p className="text-purple-300 text-xs">Personalized questions</p>
          </div>
          <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-lg mb-1">🤖</p>
            <p className="text-purple-300 text-xs">AI-powered analysis</p>
          </div>
          <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-lg mb-1">📊</p>
            <p className="text-purple-300 text-xs">Instant feedback</p>
          </div>
        </div>
      </div>
    </div>
  )
}