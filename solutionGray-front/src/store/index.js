import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

// Configure vuex-persist to use sessionStorage
const vuexSession = new VuexPersistence({
  storage: window.sessionStorage, // Change to localStorage for persistence across sessions
});

const store = createStore({
  state: () => ({
    user: null,
    authInvitation: null,
    selectPerson: null,
    selectGuide: null,
    worshipService: null,
    assignedServices: [],
  }),
  getters: {
    user: (state) => state.user,
    userSession: (state) => (state.user ? JSON.stringify(state.user) : null),
    authInvitation: (state) => state.authInvitation,
    selectPerson: (state) => state.selectPerson,
    selectGuide: (state) => state.selectGuide,
    assignedServices: (state) => state.assignedServices,
    worshipService: (state) => state.worshipService,
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user;
    },
    flushSession: (state) => {
      state.user = null;
    },
    setAuthInvitation: (state, isInvitated) => {
      state.authInvitation = isInvitated;
    },
    setSelectPerson: (state, person) => {
      state.selectPerson = person;
    },
    flushSelectPerson: (state) => {
      state.selectPerson = null;
    },
    setSelectGuide: (state, guide) => {
      state.selectGuide = guide;
    },
    flushSelectGuide: (state) => {
      state.selectGuide = null;
    },
    setAssignedServices: (state, services) => {
      state.assignedServices = services;
    },
    flushAssignedServices: (state) => {
      state.assignedServices = [];
    },
    setWorshipService: (state, service) => {
      state.worshipService = service;
    },
    flushWorshipService: (state) => {
      state.worshipService = null;
    }
  },
  actions: {
    login: ({ commit }, user) => {
      commit('setUser', user);
    },
    logout: ({ commit }) => {
      commit('flushSession');
    },
    loadInvitation: ({ commit }, isInvitated) => {
      commit('setAuthInvitation', isInvitated);
    },
    selectPerson: ({ commit }, person) => {
      commit('setSelectPerson', person);
    },
    selectGuide: ({ commit }, guide) => {
      commit('setSelectGuide', guide);
    },    
    addAssignedServices: ({ commit }, services) => {
      commit('setAssignedServices', services);
    },
    flushAssignedServices: ({ commit }) => {
      commit('flushAssignedServices');
    },
    flushSelectPerson: ({ commit }) => {
      commit('flushSelectPerson');
    },
    flushSelectGuide: ({ commit }) => {
      commit('flushSelectGuide');
    },
    addWorshipService: ({ commit }, service) => {
      commit('setWorshipService', service);
    },
    flushWorshipService: ({ commit }) => {
      commit('flushWorshipService');
    }
  },
  plugins: [vuexSession.plugin],
});

export default store;
