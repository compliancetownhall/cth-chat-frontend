import { createRouter, createWebHistory } from "vue-router";
import Chat from "../views/Chat";
import Home from "../views/Home";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
