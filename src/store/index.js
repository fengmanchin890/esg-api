// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    // Ngôn ngữ mặc định là "vi"
    locale: 'vi'
  },
  mutations: {
    setLocale(state, newLocale) {
      state.locale = newLocale;
    }
  },
  actions: {
    changeLocale({ commit }, newLocale) {
      commit('setLocale', newLocale);
    }
  },
  getters: {
    currentLocale: state => state.locale
  }
});

export default store;
