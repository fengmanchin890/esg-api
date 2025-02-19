import { createApp, watch } from "vue";
import App from "./App.vue";
import "element-plus/dist/index.css";
import ElementUI from "element-plus";
import ryEditTable from "ry-edit-table";
import "ry-edit-table/dist/style.css";
import router from "./router";
import store from "./store";      
import i18n from "./i18n";       

const app = createApp(App);

app.use(ElementUI)
  .use(ryEditTable)
  .use(router)
  .use(store)
  .use(i18n);

watch(
  () => store.getters.currentLocale,
  (newLocale) => {
    i18n.global.locale = newLocale;
  }
);

app.mount("#app");
