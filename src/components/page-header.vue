<template>
  <n-page-header class="mb-4">
    <template #title> {{ title }} </template>
    <template #extra>
      <n-space>
        <slot name="right-side" />
      </n-space>
    </template>
  </n-page-header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
