import routeAPI from './router'

export const state = () => ({
  discount: [],
  calendar: []
})

export const getters = {
  discount: (state) => state.discount,
  calendar: (state) => state.calendar,
}

export const mutations = {
  setDiscount(state, data) {
    state.discount = data
  },
  setCalendar(state, data) {
    state.calendar = data
  },
}

export const actions = {
  async loadDataDiscount({ state, commit, dispatch }) {
    try {
      const url = routeAPI.service.discount;
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$get(url, config);
      commit('setDiscount', res.payload)
      return res
    } catch (error) {
      const res =  { status: false, message: error.response.data || error.message }
      return res
    }
  },

  async loadDataCalendar({ state, commit, dispatch }) {
    try {
      const url = routeAPI.service.calendar;
      let config = { headers: { Authorization: this.$auth.getToken('local') } }
      const res = await this.$axios.$get(url, config);
      commit('setCalendar', res.payload)
      return res
    } catch (error) {
      const res =  { status: false, message: error.response.data || error.message }
      return res
    }
  },
  
}