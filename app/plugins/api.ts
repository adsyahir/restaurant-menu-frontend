import { authApi, publicApi } from '@/composables/api/axios'

// Set the axios baseURL at runtime from runtimeConfig.public.apiBase
// (sourced from NUXT_PUBLIC_API_BASE in .env). Runs before any page fetch.
export default defineNuxtPlugin(() => {
  const { public: { apiBase } } = useRuntimeConfig()
  const baseURL = `${apiBase}/api`

  publicApi.defaults.baseURL = baseURL
  authApi.defaults.baseURL = baseURL
})
