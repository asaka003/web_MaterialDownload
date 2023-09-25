import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import { createPinia } from "pinia";
// import piniaPluginPersist from 'pinia-plugin-persist'
// const pinia = createPinia();
const app = createApp(App);
app.use(router)
app.use(ElementPlus, {locale: zhCn,})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount("#app");

