import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export async function parseResumePdf(file) {
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('resume', file)

  const response = await api.post('/parse-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  // backend returns { text }
  return response.data
}


