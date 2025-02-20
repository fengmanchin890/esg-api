// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    locale: localStorage.getItem('locale') || 'en',
  },
  mutations: {
    setLocale(state, newLocale) {
      state.locale = newLocale;
      localStorage.setItem('locale', newLocale);
    },
  },
  actions: {
    changeLocale({ commit }, newLocale) {
      commit('setLocale', newLocale);
    },
  },
  getters: {
    currentLocale: (state) => state.locale,
  },
});

export default store;
