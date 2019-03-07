/**
 * @module config/nuxt
 * @description 全局nuxt配置文件
 */

const pkg = require('./package')

const buildEnv = process.env.BUILD_ENV
// 是否构建测试环境
const isBuildDev = process.env.BUILD_ENV === 'dev'
// 是否开发阶段
const isDev = process.env.NODE_ENV === 'development'
// const isBuildProd = process.env.BUILD_ENV === 'prod'
// const isBuildRelease = process.env.BUILD_ENV === 'release'
/**
 *  版本号末尾递增
 */
pkg.project.version.nextDev = (function(v = pkg.project.version.dev) {
  if (v === '') {
    return '1.0.0'
  }
  const vSplit = v.split('.')
  vSplit[vSplit.length - 1] = Number(vSplit[vSplit.length - 1]) + 1
  return vSplit.join('.')
})()

/**
 * @enum
 * @description
 * * 用于系统配置
 * * 比如
 * * 单页面，多页面模式选择
 * * 页面head设定
 * * 全局css加载
 */
const SYSTEM_CONFIG = {
  /**
   * 设置单页面或普通模式
   * spa / universal
   */
  mode: pkg.project.mode,
  /**
   * 设置head，meta
   * [https://zh.nuxtjs.org/api/configuration-head](https://zh.nuxtjs.org/api/configuration-head)
   */
  head: {
    title: '傻逼',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#fff' }
  /**
   * 全局css导入
   * [https://zh.nuxtjs.org/api/configuration-css](https://zh.nuxtjs.org/api/configuration-css)
   */
  // css: ['element-ui/lib/theme-chalk/index.css']
}
/**
 * @enum
 * @description
 * #### 全局的环境常量设置
 * * 注意：通过WebpackDefinePlugin在编译时配置的全局常量（非NODE_ENV常量）
 * [https://zh.nuxtjs.org/api/configuration-env](https://zh.nuxtjs.org/api/configuration-env)
 */
const ENV = {
  /**
   * axios 配置的baseURL
   */
  // API_URL: apiBaseURL[process.env.PRO_STAGE] || apiBaseURL['mock']
}
/**
 * #### vue的插件管理
 * [https://zh.nuxtjs.org/api/configuration-plugins](https://zh.nuxtjs.org/api/configuration-plugins)
 */
const VUE_PLUGINS = [
  '@/plugins/api',
  '@/plugins/directive',
  '@/plugins/filter',
  // '@/plugins/element-ui'
]
/**
 * #### nuxt的模块管理
 * [https://zh.nuxtjs.org/api/configuration-modules](https://zh.nuxtjs.org/api/configuration-modules)
 */
const NUXT_MODULES = isBuildDev
  ? [
      '@nuxtjs/axios',
      '../ftp-nuxt-module/index',
      '../version-nuxt-module/index'
    ]
  : ['@nuxtjs/axios']
/**
 * @enum
 * @description
 * #### nuxt 模块的配置文件
 */
const NUXT_MODULES_OPTIONS = {
  axios: {
    baseURL: pkg.project.apiBaseUrl[buildEnv],
    proxy: isDev
  },
  proxy: isDev
    ? {
        '/api/': pkg.project.apiBaseUrl[buildEnv]
      }
    : {}
}
/**
 * @enum
 * @description
 * #### 于webpack有关的配置
 */
const WEBPACK_CONFIG = {
  /**
   * 设置打包路径
   */
  generate: {
    dir: isBuildDev
      ? `dist/${pkg.project.outputDir[buildEnv]}/${pkg.project.dirName}/${
          pkg.project.version.nextDev
        }`
      : `dist/${pkg.project.outputDir[buildEnv]}/`
    // subFolders: false
  },
  /**
   * 设置html文件路径名
   */
  htmlPath: 'html',
  /**
   * 设置资源文件路径名
   */
  assetsPath: isBuildDev
    ? ''
    : `assets/${pkg.project.dirName}/${pkg.project.version[buildEnv]}`,
  /**
   * 设置（线上/测试）cdn路径
   */
  publicPath: isBuildDev
    ? `${pkg.project.cdn[buildEnv]}/${pkg.project.dirName}/${
        pkg.project.version.nextDev
      }`
    : `${pkg.project.cdn[buildEnv]}/${pkg.project.dirName}/${
        pkg.project.version[buildEnv]
      }`,
  /**
   * 扩展webpack配置
   * @param {*} config webpack配置对象
   * @param {*} ctx 上下文
   */
  extend(config, ctx) {
    // Run ESLint on save
    if (ctx.isDev && ctx.isClient) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }
  },
  /**
   * 配置babel
   */
  babel: {
    plugins: ['syntax-dynamic-import', 'lodash']
  },
  /**
   * 配置webpack插件
   */
  plugins: [],
  extractCSS: true
}

module.exports = {
  router: {
    mode: 'hash'
  },
  /**
   * 读取package.json的项目信息
   */
  project: pkg.project,
  /**
   * 构建模式
   */
  mode: SYSTEM_CONFIG.mode,
  /**
   * html头信息
   */
  head: SYSTEM_CONFIG.head,
  /**
   * 加载时loading的颜色
   */
  loading: SYSTEM_CONFIG.loading,
  /**
   * 全局加载的css
   */
  css: SYSTEM_CONFIG.css,
  /**
   * 环境变量
   */
  env: ENV,
  /**
   * vue插件注册
   */
  plugins: VUE_PLUGINS,
  /**
   * nuxt模块注册
   */
  modules: NUXT_MODULES,
  /**
   * nuxt模块配置
   */
  axios: NUXT_MODULES_OPTIONS.axios,
  /**
   * 构建配置
   */
  build: isDev ? {} : WEBPACK_CONFIG,

  generate: WEBPACK_CONFIG.generate
}
