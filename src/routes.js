import { createRouter, createWebHashHistory } from "vue-router";

import { HomeOutline, BookOutline } from "@vicons/ionicons5";

export const adminRoutes = [
  {
    path: "",
    name: "admin.index",
    meta: { menuLabel: "Home", menuIcon: HomeOutline },
    component: () => import("@/pages/admin/index.vue"),
  },
  {
    path: "courses",
    meta: {
      menuLabel: "Course Managet",
      menuIcon: BookOutline,
      pageTitle: "Course",
    },
    component: () => import("@/layouts/blank.vue"),
    children: [
      {
        name: "courses.index",
        path: "",
        component: () => import("@/pages/courses/index.vue"),
        meta: {
          menuLabel: "Course List",
          pageTitle: "Course",
        },
      },
      {
        path: "/update/:id",
        name: "courses.update",
        component: () => import("@/pages/courses/update.vue"),
        meta: {
          menuLabel: "Course List",
          pageTitle: "Course",
          hiddenFromMenu: true,
        },
      },
    ],
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
