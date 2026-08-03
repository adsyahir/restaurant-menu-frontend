// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      // Filled at runtime from NUXT_PUBLIC_API_BASE in .env
      apiBase: '',
    },
  },

  css: ['~/assets/css/tailwind.css'],

  modules: ['shadcn-nuxt', '@nuxtjs/color-mode', '@pinia/nuxt'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
