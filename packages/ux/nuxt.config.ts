import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  icon: { serverBundle: { collections: ['ph'] } },
  ui: { fonts: false, colorMode: false },
  css: [
    fileURLToPath(new URL('../tokens/css/nova.css', import.meta.url)),
    fileURLToPath(new URL('./app/assets/css/base.css', import.meta.url)),
  ],
})
