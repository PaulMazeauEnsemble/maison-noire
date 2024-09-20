import glsl from 'vite-plugin-glsl'
import { domain, metas } from './seo'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: metas.title,
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        // SEO
        { hid: 'description', name: 'description', content: metas.description },
        { hid: 'og-title', property: 'og:title', content: metas.title },
        { hid: 'og-desc', property: 'og:description', content: metas.description },
        { hid: 'og-url', property: 'og:url', content: domain },
        { hid: 'og-image', property: 'og:image', content: metas.preview },
        { hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 't-url', name: 'twitter:url', content: domain },
        { hid: 't-title', name: 'twitter:title', content: metas.title },
        { hid: 't-desc', name: 'twitter:description', content: metas.description },
        { hid: 't-image', name: 'twitter:image', content: metas.preview },
      ],
      link: [
        {rel: 'apple-touch-icon', sizes: '180x180', href: `${domain}/apple-touch-icon.png`},
        {rel: 'icon', type: 'image/png', sizes: '32x32', href: `${domain}/favicon-32x32.png`},
        {rel: 'icon', type: 'image/png', sizes: '16x16', href: `${domain}/favicon-16x16.png`},
        {rel: 'manifest', href: `${domain}/site.webmanifest`},
        // {
        //   rel: 'preload',
        //   href: '/assets/fonts/beausityclassic-medium.woff2',
        //   as: 'font',
        //   type: 'font/woff2',
        //   // crossorigin: ""
        // }
      ]
    }
  },

  devServer: {
    host: '0'
  },
  devtools: { enabled: true },
  css: [
    '~/assets/scss/style.scss',
  ],
  vite: {
    plugins: [glsl({
      include: [                   // Glob pattern, or array of glob patterns to import
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
      exclude: undefined,          // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: 'glsl',    // Shader suffix when no extension is specified
      compress: false,             // Compress output shader code
      watch: true,                 // Recompile shader on change
      root: '/assets/js/webgl/shaders/'                    // Directory for root imports
    })],
    css: {
      preprocessorOptions: {
          scss: {
              additionalData: `
                @use "sass:math";
                @import "@/assets/scss/injections.scss";
              `,
          },
      },
    },
  },
  buildModules: [
    '@nuxtjs/google-analytics'
  ],
  modules: [
    "@nuxtjs/sanity",
  ],
  build: {
    transpile: ['three']
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID, // Use as fallback if no runtime config is provided
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  sanity: {
    projectId: "q6ujozhq",
    dataset: "development",
    apiVersion: "2023-10-10",
  },
  plugins: [
    { src: '~/plugins/vue-touch.js' },
    '~/plugins/parse-user-agent',

  ]
  
})
