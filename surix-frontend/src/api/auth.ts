import { apiFetch } from './client'

type AuthResponse = {
  token: string
  id: number
  username: string
  roles: string[]
}

export const authApi = {
  login: async (username: string, password: string) => {
    return apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  register: async (username: string, password: string) => {
    return apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
}