<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
  <VueQueryDevTools />
</template>

<script setup>
import { VueQueryDevTools } from "vue-query/devtools";
</script>
