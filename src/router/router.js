import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/pages/home.vue"), // 首页使用懒加载
  },
  {
    path: "/material-center",
    component: () => import("@/pages/HomePage.vue"),
  },
  {
    path: "/authorization",
    component: () => import("@/pages/toAuthorization.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/administratorcheck",
    component: () => import("@/pages/AdministratorCheck.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/userdetail",
    component: () => import("@/pages/userDetail.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/videos",
    component: () => import("@/pages/Videos.vue"),
  },
  {
    path: "/AIchat",
    component: () => import("@/pages/AIChat.vue"),
  },
  {
    path: "/test",
    component: () => import("@/components/dialogInfo.vue"),
  },
  {
    path: "/toolsDownload",
    component: () => import("@/pages/toolsDownload.vue")
  }

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const phoneLocal = localStorage.getItem("phone");
  if (requiresAuth && phoneLocal == null) {
    next("/");
  } else {
    next();
  }
});

export default router;
