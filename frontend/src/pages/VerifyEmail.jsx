import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verify = async () => {
      try {
        await authAPI.verifyEmail(token)
        setStatus('success')
        setMessage('Email verified successfully! You can now log in.')
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.error || 'Email verification failed.')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          ) : (
            <div className="h-12 w-12 mx-auto rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
              {status === 'success' ? '✓' : '!'}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Email Verification</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {status !== 'loading' && (
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  )
}
