<template>
  <div class="flex items-center justify-end p-3 border-b">
    <n-dropdown :options="options" trigger="click">
      <div class="flex items-center gap-2 cursor-pointer">
        <p class="text-base uppercase">Rayhan</p>
        <n-avatar round size="small" class="!bg-emerald-500">R</n-avatar>
      </div>
    </n-dropdown>
  </div>
</template>

<script setup>
import { h } from "vue";
import { NIcon } from "naive-ui";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

const options = [
  {
    label: "Edit Profile",
    key: "editProfile",
    icon: renderIcon(EditIcon),
  },
  {
    label: "Logout",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
];
</script>
