<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        {{ hi }}
      </h1>
      <h2 class="subtitle">
        My best Nuxt.js project
      </h2>

      <div class="links">
        <a
          href="http://127.0.0.1:1000"
          target="_blank">开发文档</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >GitHub</a>
      </div>

    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
/**
 * 页面组件配置
 * https://zh.nuxtjs.org/guide/views/
 */
export default {
  name: 'Index',
  /**
   * 头部设置
   * https://zh.nuxtjs.org/api/pages-head
   */
  head() {
    return {
      title: '这里设置标题'
    }
  },
  /**
   * 自定义布局文件
   * https://zh.nuxtjs.org/api/pages-layout
   */
  layout: 'default',
  /**
   * 页面加载条
   * https://zh.nuxtjs.org/api/configuration-loading/
   */
  loading: '',
  /**
   * 自定义过渡动画效果
   * https://zh.nuxtjs.org/api/pages-transition
   */
  transition: '',
  /**
   * 验证路由参数
   * https://zh.nuxtjs.org/api/pages-validate
   */
  validate({ params }) {},
  /**
   * 中间件
   * https://zh.nuxtjs.org/api/pages-middleware
   */
  middleware: '',
  components: {
    Logo
  },
  computed: {
    hi() {
      return this.$store.state.say
    }
  },
  mounted() {
    this.$store.dispatch('sayHello')
  }
}
</script>
<style lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
