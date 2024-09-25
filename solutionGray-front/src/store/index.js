import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

//Configura vuex-persist para usar sessionStorage
const vuexSession = new VuexPersistence({
  storage: window.sessionStorage, // Cambia a localStorage si quieres persistencia entre sesiones
})


const store = createStore({
  state() {
    return {
      user: null,
      authInvitation: null,
      selectPerson: null,
      selectGuide: null,
      worshipService: null,
      assignedServices: [],
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
    assignedServices(state) {
      return state.assignedServices;
    },
    worshipService(state) {
      return state.worshipService;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    flushSession(state) {
      state.user = null;
      state.authInvitation = null;
      state.selectPerson = null;
      state.selectGuide = null;
      state.worshipService = null;
      state.assignedServices = [];
    },
    setAuthInvitation(state, isInvitated) {
      state.authInvitation = isInvitated;
    },
    setSelectPerson(state, person) {
      state.selectPerson = person;
    },
    flushSelectPerson(state) {
      state.selectPerson = null;
    },
    setSelectGuide(state, guide) {
      state.selectGuide = guide;
    },
    flushSelectGuide(state) {
      state.selectGuide = null;
    },
    setAssignedServices(state, services) {
      state.assignedServices = services;
    },
    flushAssignedServices(state) {
      state.assignedServices = [];
    },
    setWorshipService(state, service) {
      state.worshipService = service;
    },
    flushWorshipService(state) {
      state.worshipService = null;
    }
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
    addAssignedServices({ commit }, services) {
      commit('setAssignedServices', services);
    },
    flushAssignedServices({ commit }) {
      commit('flushAssignedServices');
    },
    flushSelectPerson({ commit }) {
      commit('flushSelectPerson');
    },
    flushSelectGuide({ commit }) {
      commit('flushSelectGuide');
    },
    addWorshipService({ commit }, service) {
      commit('setWorshipService', service);
    },
    flushWorshipService({ commit }) {
      commit('flushWorshipService');
    },
    updateAssingServices({ commit }, services) {
      commit('setAssignedServices', services);
    }
  },
  plugins: [vuexSession.plugin],
});

export default store;
