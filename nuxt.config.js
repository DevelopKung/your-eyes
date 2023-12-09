import colors from 'vuetify/es5/util/colors'
const env = require('dotenv').config()
let url_api = process.env.NODE_ENV == 'development' ? process.env.URL_API_DEV : process.env.URL_API;
let base_url = process.env.NODE_ENV == 'development' ? '/' : process.env.GITPAGES_NAME

export default {
  publicRuntimeConfig: {
    myApp: {
      version: process.env.VERSION
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Booking',
    title: 'Booking',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600&display=swap' }
    ],
    script: [
      { src:"https://storage.googleapis.com/vrview/2.0/build/vrview.min.js" }
    ]
  },
  ssr: false,

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~plugins/vuetify.js', mode: 'client' },
    { src: '~plugins/VueNumeral.js', mode: 'client' },
    { src: '~plugins/sweetalert.js', mode: 'client' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  router: {
    base: base_url,
    middleware: ['auth']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'vue-sweetalert2/nuxt',
  ],

  sweetalert: {
    confirmButtonColor: '#41b882',
    cancelButtonColor: '#ff7674'
  },

  moment: {
    defaultTimezone: 'Asia/Bangkok'
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/logout',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            // headers: { 'Content-Type': 'multipart/form-data' },
            url: `${url_api}/auth/token`,
            method: 'post',
            propertyName: 'payload.token'
          },
          user: {
            url: `${url_api}/auth/user`,
            method: 'get',
            propertyName: 'payload.member'
          }
        }
      }
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: base_url,
    proxy: true
  },

  proxy: {
    '/api': { target: url_api, changeOrigin: true, pathRewrite: { '^/api': '/' } },
  },

  loading: {
    color: '#cccccc',
    height: '2px'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    defaultAssets: {
      font: {
        family: 'Noto Sans Thai'
      }
    },
    theme: {
      options: {
        customProperties: true,
      },
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#5582b9',
          info: '#0d47a1',
          warning: '#f9a927',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        prettify: false
      }
    },
  },

  pwa: {
    meta: {
      title: 'Your Eye',
      author: 'Me'
    },
    manifest: {
      name: 'Your Eye',
      lang: 'th',
      short_name: "Your Eye",
      description: "Booking Shop Your Eye"
    },
    icon: {
      fileName: 'icon.jpg',
      sizes: [64, 120, 144, 152, 192, 384, 512]
    }
  },

  server: {
    port: process.env.PORT || 3000
  }
}