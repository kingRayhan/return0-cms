import { createRouter, createWebHashHistory } from "vue-router";

import { HomeOutline, BookOutline } from "@vicons/ionicons5";

export const adminRoutes = [
  {
    path: "",
    name: "admin.index",
    meta: { menuLabel: "Home", menuIcon: HomeOutline },
    component: import("@/pages/admin/index.vue"),
  },
  {
    path: "courses",
    name: "courses.index",
    meta: { menuLabel: "Courses", menuIcon: BookOutline },
    component: () => import("@/pages/courses/index.vue"),
    // children: [
    //   {
    //     path: "",
    //     meta: { menuLabel: "Course List", menuIcon: BookOutline },
    //     component: () => import("@/pages/courses/index.vue"),
    //   },
    //   {
    //     path: "create",
    //     name: "courses.create",
    //     meta: { menuLabel: "New Course", menuIcon: BookOutline },
    //     component: () => import("@/pages/courses/index.vue"),
    //   },
    // ],
  },
];

const routes = [
  {
    path: "/",
    component: () => import("@/pages/index.vue"),
    name: "home",
    meta: { label: "Home" },
  },
  {
    path: "/admin",
    component: () => import("@/layouts/dashboard.vue"),
    meta: { auth: true },
    children: [...adminRoutes],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
