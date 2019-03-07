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
