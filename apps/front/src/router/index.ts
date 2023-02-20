import { createRouter, createWebHashHistory } from "vue-router";
import AdminView from "@/views/AdminView.vue";
import DisplayView from "@/views/DisplayView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:id?",
      name: "home",
      component: HomeView,
    },
    {
      path: "/admin/:id?",
      name: "admin",
      component: AdminView,
    },
    {
      path: "/display/:id?",
      name: "display",
      component: DisplayView,
    },
  ],
});

export default router;
