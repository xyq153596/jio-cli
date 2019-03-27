module.exports = {
  mode: 'hash',
  /**
   * 自定义插件
   */
  plugins: ['@/plugins/elementUI'],
  babel: {
    plugins: [

    ]
  },
  proxy: {

  },
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
   * [https://zh.nuxtjs.org/api/configuration-css](https://zh.nuxtjs.org/api/configuration-css)
   */
  css: []
}
