import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// import { createPinia } from "pinia";
// import piniaPluginPersist from 'pinia-plugin-persist'
// const pinia = createPinia();
createApp(App)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  // .use(pinia)
  .mount("#app");


