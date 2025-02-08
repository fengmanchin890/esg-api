import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "element-plus/dist/index.css";
import ElementUI from "element-plus";
import ryEditTable from "ry-edit-table";
import "ry-edit-table/dist/style.css";
import router from "./router";

createApp(App)
  .use(ElementUI)
  .use(ryEditTable)
  .use(router)
  .mount("#app");
  