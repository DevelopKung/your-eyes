import routeAPI from './router'

export const state = () => ({
  lists: []
})

export const getters = {
  lists: (state) => state.lists,
}

export const mutations = {
  setLists(state, data) {
    state.lists = data
  },
}

export const actions = {

}