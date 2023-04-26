import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/pages/HomePage.vue"), // 首页使用懒加载
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
