// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },
  modules: ['@sidebase/nuxt-auth', '@nuxt/ui', '@sidebase/nuxt-session', '@sidebase/nuxt-pdf', '@pinia/nuxt'],
  typescript: {
    shim: false
  }
})
