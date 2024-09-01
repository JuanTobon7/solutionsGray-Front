import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

// Configura vuex-persist para usar sessionStorage
const vuexSession = new VuexPersistence({
  storage: window.sessionStorage, // Cambia a localStorage si quieres persistencia entre sesiones
});


const store = createStore({
  state() {
    return {
      user: null,
      authInvitation: null,
      selectPerson: null,
      selectGuide: null,
    };
  },
  getters: {
    user(state) {
      return state.user;
    },
    userSession(state) {
      return state.user ? JSON.stringify(state.user) : null;
    },
    authInvitation(state) {
      return state.authInvitation;
    },
    selectPerson(state) {
      return state.selectPerson;
    },
    selectGuide(state) {
      return state.selectGuide;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    flushSession(state) {
      state.user = null;
    },
    setAuthInvitation(state, isInvitated) {
      state.authInvitation = isInvitated;
    },
    setSelectPerson(state, person) {
      state.selectPerson = person;
    },
    setSelectGuide(state, guide) {
      state.selectGuide = guide;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('flushSession');
    },
    loadInvitation({ commit }, isInvitated) {
      commit('setAuthInvitation', isInvitated);
    },
    selectPerson({ commit }, person) {
      commit('setSelectPerson', person);
    },
    selectGuide({ commit }, guide) {
      commit('setSelectGuide', guide);
    },
  },
  plugins: [vuexSession.plugin],
});

export default store;
