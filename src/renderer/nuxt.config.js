/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */
module.exports = {
  mode: 'spa',
  head: {
    title: 'NSMultiTools',
    meta: [{ charset: 'utf-8' }],
    link: [
      {
        rel: 'stylesheet',
        href: '@/assets/font/Montserrat-Regular.ttf'
      }
    ]
  },
  loading: '@/components/loading.vue',
  plugins: [{ ssr: true, src: '@/plugins/icons.js' }],
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@bazzite/nuxt-optimized-images',
    '@nuxtjs/markdownit',
    'nuxt-client-init-module'
    /*[
      'nuxt-i18n', {
        locales: [
          {
            code: 'en',
            file: 'en-US.js'
          },
          {
            code: 'fr',
            file: 'fr-FR.js'
          }
        ],
        lazy: true,
        langDir: 'lang/',
        strategy: 'prefix_except_default',
        defaultLocale: 'en'
      }
    ]*/
  ],
  edImages: {
    optimizeImages: true
  },
  markdownit: {
    injected: true
  }
}
