import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

//Configura vuex-persist para usar sessionStorage
const vuexSession = new VuexPersistence({
  storage: window.sessionStorage, // Cambia a localStorage si quieres persistencia entre sesiones
  reducer: (state) => {
    const { tempEmail, ...persistedState } = state;  // Excluir tempEmail
    return persistedState;
  }
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
      tempEmail: null,  // Estado temporal para el email de los invitados
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
    },
    tempEmail(state) {
      return state.tempEmail;  // Agrega un getter para acceder al estado temporal
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
      state.tempEmail = null;  // Limpiar el estado temporal al cerrar la sesión
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
    },
    setTempEmail(state, email) {
      state.tempEmail = email;  // Mutación para establecer el email temporal
    },
    flushTempEmail(state) {
      state.tempEmail = null;  // Mutación para limpiar el email temporal
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
    },
    setTempEmail({ commit }, email) {
      commit('setTempEmail', email);  // Acción para establecer el email temporal
    },
    flushTempEmail({ commit }) {
      commit('flushTempEmail');  // Acción para limpiar el email temporal
    }
  },
  plugins: [vuexSession.plugin],  // Este plugin no afecta a `tempEmail`
});

export default store;