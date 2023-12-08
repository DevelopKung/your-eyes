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
  async loadData({ state, commit, dispatch }) {
    try {
      const url = routeAPI.lists.lists;
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$get(url, config);
      commit('setLists', res.payload)
      return res
    } catch (error) {
      const res =  { status: false, message: error.response.data || error.message }
      return res
    }
  },

  async loadInfo({ state, commit, dispatch }, id) {
    try {
      const url = routeAPI.lists.info.replace('{:id}', id);
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$get(url, config);
      return res
    } catch (error) {
      const res =  { status: false, message: error.response.data || error.message }
      return res
    }
  },

  async create({ commit, dispatch }, form) {
    try {
      console.log(form);
      const url = routeAPI.lists.create;
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$post(url, form, config);
      if (res.status == true) await dispatch("loadData")
      return res
    } catch (error) {
      console.log(error);
      const res = error.response.data || error
      return res
    }
  },

  async update({ commit, dispatch }, { id, form }) {
    try {
      const url = routeAPI.lists.update.replace('{:id}', id);
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$post(url, form, config);
      if (res.status == true) await dispatch("loadData")
      return res
    } catch (error) {
      const res = error.response.data || error
      return res
    }
  },

  async delete({ commit, dispatch }, id) {
    try {
      const url = routeAPI.lists.delete.replace('{:id}', id);
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$get(url, config);
      if (res.status == true) await dispatch("loadData")
      return res
    } catch (error) {
      console.log(error);
      const res = error.response.data || { status: false, message: error }
      return res
    }
  },

}