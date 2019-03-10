module.exports = {
  mode: 'hash',
  webpack: {
    base: {},
    dev: {},
    build: {}
  },
  babel: {},
  proxy: '/api',
  /**
   * 设置head，meta
   * [https://zh.nuxtjs.org/api/configuration-head](https://zh.nuxtjs.org/api/configuration-head)
   */
  head: {
    title: ''
  },
  loading: {},
  /**
   * 全局css导入
   * [https://zh.nuxtjs.org/api/configuration-css](https://zh.nuxtjs.org/api/configuration-css)
   */
  css: []
}
