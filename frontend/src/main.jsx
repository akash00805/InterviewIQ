import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { setupAxios } from './services/api'

const token = localStorage.getItem('token')
if (token) {
  setupAxios(token)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
