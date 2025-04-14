import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapse: JSON.parse(localStorage.getItem('isCollapse')) || false,
    selectedBucket: JSON.parse(sessionStorage.getItem('selectedBucket')) || null
  },
  mutations: {
    updateIsCollapse(state, isCollapse) {
      state.isCollapse = isCollapse
      localStorage.setItem('isCollapse', JSON.stringify(isCollapse))
    },
    updateSelectedBucket(state, bucket) {
      state.selectedBucket = bucket
      sessionStorage.setItem('selectedBucket', JSON.stringify(bucket))
    }
  },
  getters: {
    getIsCollapse(state) {
      return state.isCollapse
    },
    getSelectedBucket(state) {
      return state.selectedBucket
    }
  }
})
