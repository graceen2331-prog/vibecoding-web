// frontend/src/services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
})

// 添加 token 到请求头
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 认证相关 API
export const authAPI = {
  sendMagicLink: (email) =>
    api.post('/api/auth/login', { email }),
  
  verifyToken: (token) =>
    api.post('/api/auth/verify', { token }),
  
  getCurrentUser: () =>
    api.get('/api/auth/me'),
}

// 课程相关 API
export const courseAPI = {
  getCourses: () =>
    api.get('/api/courses'),
  
  getCourseById: (courseId) =>
    api.get(`/api/courses/${courseId}`),
  
  markCourseComplete: (courseId) =>
    api.post(`/api/courses/${courseId}/complete`),
  
  getUserProgress: (courseId) =>
    api.get(`/api/courses/${courseId}/progress`),
}

// 成就相关 API
export const achievementAPI = {
  getAllAchievements: () =>
    api.get('/api/achievements'),
  
  getUserAchievements: () =>
    api.get('/api/achievements/user/achievements'),
  
  unlockAchievement: (achievementId) =>
    api.post(`/api/achievements/${achievementId}/unlock`),
}

// 项目分享 API
export const projectAPI = {
  shareProject: (data) =>
    api.post('/api/projects/share', data),
  
  getSharedProject: (shareToken) =>
    api.get(`/api/projects/share/${shareToken}`),
  
  getUserProjects: () =>
    api.get('/api/projects/user/projects'),
}

export default api
