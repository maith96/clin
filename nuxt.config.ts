// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxt/ui'
  ],
  typescript: {
    shim: false
  }
})
