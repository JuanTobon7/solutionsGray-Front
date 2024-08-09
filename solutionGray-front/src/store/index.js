import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      user: null
    };
  },
  getters: {
    user(state) {
      return state.user;
    },
    userSession(state) {
      return state.user ? JSON.stringify(state.user) : null;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    flushSession(state) {
      state.user = null;
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('flushSession');
    }
  }
});

export default store;
