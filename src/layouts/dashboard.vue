<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        class="min-h-screen"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          accordion
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout class="bg-slate-50">
        <Navbar />
        <div class="p-8">
          <router-view />
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>
<script setup>
import { ref, h } from "vue";

import { NIcon } from "naive-ui";
import Navbar from "@/components/navbar.vue";
import { RouterLink } from "vue-router";
import { adminRoutes } from "@/routes";
const collapsed = ref(false);

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = adminRoutes.map((route) => {
  const { name, meta, children } = route;
  const { menuIcon, menuLabel } = meta;

  return {
    key: name,
    label: children
      ? menuLabel
      : () => h(RouterLink, { to: { name } }, { default: () => menuLabel }),
    icon: renderIcon(menuIcon),
    children: children
      ? children
          .filter((menu) => !menu?.meta?.hiddenFromMenu)
          .map((child) => {
            return {
              key: child.name,
              label: () =>
                h(
                  RouterLink,
                  { to: { name: child.name } },
                  { default: () => child?.meta?.menuLabel }
                ),
            };
          })
      : undefined,
  };
});
</script>
