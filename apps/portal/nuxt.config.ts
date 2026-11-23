export default defineNuxtConfig({
  extends: ['@sebit-nova/grid'],
  compatibilityDate: '2026-11-14',
  devtools: { enabled: false },
  css: ['~/assets/css/site.css'],
  runtimeConfig: {
    nova: {
      publicUrl: '',
      gatewayUrl: '',
      gatewayServiceKey: '',
      gatewayTimeoutMs: 10000,
      showcasePath: '',
      nexusPath: '',
      hubTokenSecret: '',
      hubIssuer: '',
      hubAudience: '',
      allowLocalHttp: false,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'NOVA | 업무 화면의 공통 언어',
      meta: [
        { name: 'description', content: '업무 화면의 공통 언어, NOVA. 화면을 만드는 UX, 데이터를 보여주는 Chart, 정보를 다루는 Grid를 만나보세요.' },
        { name: 'color-scheme', content: 'dark light' },
      ],
      link: [
        { rel: 'icon', href: 'data:,' },
        { rel: 'stylesheet', href: '/design/assets/fonts.css' },
      ],
    },
  },
  nitro: { preset: 'node-server' },
  routeRules: { '/api/**': { headers: { 'cache-control': 'no-store' } } },
})
