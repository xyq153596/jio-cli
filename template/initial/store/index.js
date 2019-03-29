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
