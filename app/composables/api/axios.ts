import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

// `baseURL` is set at runtime by `plugins/api.ts` from
// runtimeConfig.public.apiBase (NUXT_PUBLIC_API_BASE in .env).

// --- Public instance ----------------------------------------------------
// For endpoints that do NOT require authentication (e.g. location lookups).
export const publicApi: AxiosInstance = axios.create({
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

// --- Authenticated instance --------------------------------------------
// Attaches the Bearer token and transparently refreshes it on a 401.
export const authApi: AxiosInstance = axios.create({
  timeout: 10000,
  withCredentials: true, // send the refresh-token cookie
  headers: { Accept: 'application/json' },
})

authApi.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// De-dupe concurrent refreshes so a burst of 401s triggers a single call.
let refreshing: Promise<string> | null = null

function refreshAccessToken(): Promise<string> {
  refreshing ??= publicApi
    .post<{ token: string }>('/refresh', {}, { withCredentials: true })
    .then((res) => {
      useAuthStore().setToken(res.data.token)
      return res.data.token
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      try {
        const token = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${token}`
        return authApi(original)
      } catch (refreshError) {
        useAuthStore().clear()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
