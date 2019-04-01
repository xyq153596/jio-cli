/**
 * this.$axios.$get() 发送get请求
 * this.$axios.$post() 发送post请求
 * this.$api 得到api接口
 */
export const state = () => ({
  say: ''
})

export const mutations = {
  sayHello(state) {
    state.say = 'hello world'
  }
}

export const actions = {
  sayHello(ctx) {
    ctx.commit('sayHello')
  }
}

/**
 * 关闭vuex严格模式
 */
export const strict = false
