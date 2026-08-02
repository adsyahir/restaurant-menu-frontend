// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      // Laravel API base (Herd). Override with NUXT_PUBLIC_API_BASE in .env.
      apiBase: 'http://restaurant-menu-backend.test',
    },
  },

  css: ['~/assets/css/tailwind.css'],

  modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],

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
