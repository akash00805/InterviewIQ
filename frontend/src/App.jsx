import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import ResumeUpload from './pages/ResumeUpload'
import MockInterview from './pages/MockInterview'
import MockInterviewSession from './pages/MockInterviewSession'
import CompanyInterview from './pages/CompanyInterview'
import CompanyInterviewSession from './pages/CompanyInterviewSession'
import VoiceInterview from './pages/VoiceInterview'
import InterviewResult from './pages/InterviewResult'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import './styles/globals.css'

function AppRoutes() {
  const { loadCurrentUser, isAuthenticated } = useAuth()

  useEffect(() => {
    loadCurrentUser()
  }, [])

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/practice"
        element={<ProtectedRoute><Practice /></ProtectedRoute>}
      />
      <Route
        path="/resume-upload"
        element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>}
      />
      <Route
        path="/mock-interview"
        element={<ProtectedRoute><MockInterview /></ProtectedRoute>}
      />
      <Route
        path="/mock-interview/:category"
        element={<ProtectedRoute><MockInterviewSession /></ProtectedRoute>}
      />
      <Route
        path="/company-interview"
        element={<ProtectedRoute><CompanyInterview /></ProtectedRoute>}
      />
      <Route
        path="/company-interview/:company"
        element={<ProtectedRoute><CompanyInterviewSession /></ProtectedRoute>}
      />
      <Route
        path="/voice-interview"
        element={<ProtectedRoute><VoiceInterview /></ProtectedRoute>}
      />
      <Route
        path="/interview-result/:index"
        element={<ProtectedRoute><InterviewResult /></ProtectedRoute>}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  )
}