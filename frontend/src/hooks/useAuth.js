import { useDispatch, useSelector } from 'react-redux'
import { authAPI, setupAxios, userAPI } from '../services/api'
import {
  loginStart,
  loginSuccess,
  loginError,
  registerStart,
  registerSuccess,
  registerError,
  logout,
  setUser
} from '../redux/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const login = async (email, password) => {
    dispatch(loginStart())
    try {
      const response = await authAPI.login({ email, password })
      const token = response.data.token
      localStorage.setItem('token', token)
      setupAxios(token)
      dispatch(loginSuccess(response.data))
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      dispatch(loginError(message))
      throw error
    }
  }

  const register = async (userData) => {
    dispatch(registerStart())
    try {
      const response = await authAPI.register(userData)
      dispatch(registerSuccess(response.data.user))
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      dispatch(registerError(message))
      throw error
    }
  }

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
      return
    }

    setupAxios(token)

    try {
      const response = await userAPI.getProfile()
      dispatch(setUser(response.data))
      dispatch({ type: 'auth/loginSuccess', payload: { token, user: response.data } })
    } catch (error) {
      dispatch(logout())
    }
  }

  const refreshUser = async () => {
    try {
      const response = await userAPI.getProfile()
      dispatch(setUser(response.data))
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const handleLogout = () => {
    setupAxios(null)
    dispatch(logout())
  }

  return {
    ...auth,
    login,
    register,
    logout: handleLogout,
    loadCurrentUser,
    refreshUser
  }
}