module.exports = {
  mode: 'hash',
  /**
   * 自定义插件
   */
  plugins: [],
  /**
   * babel 配置
   */
  babel: {
    plugins: []
  },
  /**
   * proxy配置
   */
  proxy: {},
  /**
   * 是否开启proxy
   */
  proxyEnable: false,
  /**
   * 设置head，meta
   * [https://zh.nuxtjs.org/api/configuration-head](https://zh.nuxtjs.org/api/configuration-head)
   */
  head: {
    title: ''
  },
  loading: {
    color: '#3B8070'
  },
  /**
   * 全局css导入
   * @example
   * css: ['@/assets/web.scss']
   * [https://zh.nuxtjs.org/api/configuration-css](https://zh.nuxtjs.org/api/configuration-css)
   */
  css: []
}
