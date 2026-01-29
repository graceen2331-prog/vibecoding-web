// frontend/src/store/useAuthStore.js
import { create } from 'zustand'
import { authAPI } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // 设置用户
  setUser: (user) => set({ user }),

  // 设置 token
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },

  // 发送 Magic Link
  sendMagicLink: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.sendMagicLink(email)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message
      set({ isLoading: false, error: errorMsg })
      throw error
    }
  },

  // 验证 Token
  verifyToken: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authAPI.verifyToken(token)
      const { token: jwtToken, user } = response.data

      set({
        token: jwtToken,
        user,
        isLoading: false,
      })

      localStorage.setItem('token', jwtToken)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message
      set({ isLoading: false, error: errorMsg })
      throw error
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      error: null,
    })
  },

  // 获取当前用户
  fetchCurrentUser: async () => {
    try {
      const response = await authAPI.getCurrentUser()
      set({ user: response.data })
      return response.data
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      set({ user: null, token: null })
      localStorage.removeItem('token')
      throw error
    }
  },
}))
