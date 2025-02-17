import { createApp } from "vue";
import App from "./App.vue";
import "element-plus/dist/index.css";
import ElementUI from "element-plus";
import ryEditTable from "ry-edit-table";
import "ry-edit-table/dist/style.css";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/es/style"; 

createApp(App)
  .use(Antd)
  .use(ElementUI)
  .use(ryEditTable)
  .use(router)
  .mount("#app");
