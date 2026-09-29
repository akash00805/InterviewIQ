import axios from 'axios'

const API_URL = '/api'

const apiClient = axios.create({
  baseURL: API_URL,
})

// Auto attach token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (token, data) => apiClient.post(`/auth/reset-password/${token}`, data),
  logout: () => apiClient.post('/auth/logout')
}

export const userAPI = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.put('/users/me', data),
  saveInterviewResult: (data) => apiClient.post('/users/interview-result', data),
  getInterviewResult: (index) => apiClient.get(`/users/interview-result/${index}`),
  uploadPhoto: (formData) => apiClient.post('/users/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const aiAPI = {
  generateQuestions: (data) => apiClient.post('/ai/generate-questions', data),
  evaluateAnswer: (data) => apiClient.post('/ai/evaluate-answer', data)
}

export const setupAxios = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete apiClient.defaults.headers.common.Authorization
    localStorage.removeItem('token')
  }
}