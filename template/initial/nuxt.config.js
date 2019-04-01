/**
 * @module config/nuxt
 * @description 全局nuxt配置文件
 */

const path = require('path')
const pkg = require('./package')
const customConfig = require('./nuxt.comfig.custom')

/**
 * babel 插件列表
 */
const APP_BABEL_PLUGINS = ['syntax-dynamic-import', 'lodash']
/**
 * app插件列表
 */
const APP_PLUGINS = [
  '@/plugins/api',
  '@/plugins/directive',
  '@/plugins/filter',
  '@/plugins/axios'
]
/**
 * app全局样式列表
 */
const APP_CSS = []

const buildEnv = process.env.BUILD_ENV
// 是否构建测试环境
const isBuildDev = process.env.BUILD_ENV === 'dev'
// 是否开发阶段
const isDev = process.env.NODE_ENV === 'development'
// const isBuildProd = process.env.BUILD_ENV === 'prod'
// const isBuildRelease = process.env.BUILD_ENV === 'release'

if (!isDev && pkg.project.cdn[buildEnv] === '') {
  console.error(`请先在package.json中设置${buildEnv}的cdn`)
  process.exit(1)
}
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

module.exports = {
  router: {
    mode: customConfig.mode
  },
  /**
   * 读取package.json的项目信息
   */
  project: pkg.project,
  /**
   * 构建模式
   */
  mode: pkg.project.mode,
  /**
   * html头信息
   */
  head: customConfig.head,
  /**
   * 加载时loading的颜色
   */
  loading: customConfig.loading,
  /**
   * 全局加载的css
   */
  css: APP_CSS.concat(customConfig.css),
  /**
   * 环境变量
   */
  env: {},
  /**
   * #### vue的插件管理
   * [https://zh.nuxtjs.org/api/configuration-plugins](https://zh.nuxtjs.org/api/configuration-plugins)
   */
  plugins: APP_PLUGINS.concat(customConfig.plugins),
  /**
   * #### nuxt的模块管理
   * [https://zh.nuxtjs.org/api/configuration-modules](https://zh.nuxtjs.org/api/configuration-modules)
   */
  modules: isDev
    ? ['@nuxtjs/axios']
    : [
        '@nuxtjs/axios',
        'ftp-nuxt-module',
        'version-nuxt-module',
        'move-nuxt-module'
      ],
  /**
   * nuxt模块配置
   */
  axios: {
    baseURL: pkg.project.apiBaseUrl[buildEnv],
    proxy: customConfig.proxyEnable
  },
  moveModuleOptions: {
    outputDir: pkg.project.outputDir[buildEnv],
    dirName: pkg.project.dirName,
    version: pkg.project.version[buildEnv]
  },
  global: {
    buildEnv: buildEnv
  },
  proxy: customConfig.proxy,

  /**
   * 构建配置
   */
  build: (function() {
    let options = {
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
      babel: {
        plugins: APP_BABEL_PLUGINS.concat(customConfig.babel.plugins)
      },
      plugins: []
    }

    if (isDev) {
      //开发阶段
    } else {
      options.extractCSS = true
      //构建阶段
      if (isBuildDev) {
        // 构建测试阶段
        options.publicPath = `${pkg.project.cdn[buildEnv]}/${
          pkg.project.dirName
        }/${pkg.project.version.nextDev}`
      } else {
        // 构建预发/正式阶段
        options.publicPath = `${pkg.project.cdn[buildEnv]}/${
          pkg.project.dirName
        }/${pkg.project.version[buildEnv]}`
      }
    }
    return options
  })(),

  generate: {
    /**
     * 设置打包路径
     */
    dir: isBuildDev
      ? path.join(
          'dist',
          pkg.project.outputDir[buildEnv] || '',
          pkg.project.dirName,
          pkg.project.version.nextDev
        )
      : path.join(
          'dist',
          pkg.project.outputDir[buildEnv] || '',
          'assets',
          pkg.project.dirName,
          pkg.project.version[buildEnv] || ''
        )
    // subFolders: false
  }
}
