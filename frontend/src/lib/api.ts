import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
}

// Tutors API
export const tutorsApi = {
  search: (params: any) => api.get('/tutors/search', { params }),
  getById: (id: string) => api.get(`/tutors/${id}`),
  getSubjects: () => api.get('/tutors/subjects'),
  getCategories: () => api.get('/tutors/categories'),
}

// Bookings API
export const bookingsApi = {
  create: (data: any) => api.post('/bookings', data),
  getAll: (params?: any) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  cancel: (id: string, data: any) => api.put(`/bookings/${id}/cancel`, data),
  confirm: (id: string) => api.put(`/bookings/${id}/confirm`),
  complete: (id: string) => api.put(`/bookings/${id}/complete`),
}

// Payments API
export const paymentsApi = {
  create: (data: any) => api.post('/payments', data),
  getById: (id: string) => api.get(`/payments/${id}`),
  getByOrderId: (orderId: string) => api.get(`/payments/order/${orderId}`),
  requestRefund: (id: string, data: any) => api.post(`/payments/${id}/refund`, data),
}

// Reviews API
export const reviewsApi = {
  create: (data: any) => api.post('/reviews', data),
  getMyReviews: (params?: any) => api.get('/reviews/my-reviews', { params }),
  getTutorReviews: (tutorId: string, params?: any) => 
    api.get(`/reviews/tutor/${tutorId}`, { params }),
  getById: (id: string) => api.get(`/reviews/${id}`),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
}

// Chat API
export const chatApi = {
  createConversation: (data: any) => api.post('/chat/conversations', data),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: string, params?: any) => 
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (data: any) => api.post('/chat/messages', data),
  markAsRead: (conversationId: string) => 
    api.post(`/chat/conversations/${conversationId}/read`),
  deleteMessage: (id: string) => api.delete(`/chat/messages/${id}`),
}

export default api
