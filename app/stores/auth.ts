import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  name: string
  email: string
  [key: string]: unknown
}

/**
 * Holds the access token + current user in memory (Pinia).
 * Not persisted to localStorage — the token lives only for the session.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.token !== null,
  },

  actions: {
    setToken(token: string | null) {
      this.token = token
    },
    setUser(user: AuthUser | null) {
      this.user = user
    },
    clear() {
      this.token = null
      this.user = null
    },
  },
})
