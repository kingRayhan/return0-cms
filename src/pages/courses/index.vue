<template>
  <n-page-header class="mb-4">
    <template #title> Courses </template>
    <template #extra>
      <n-space>
        <n-button>Refetch</n-button>
        <n-button type="primary" @click="showDrawer = true">New</n-button>
      </n-space>
    </template>
  </n-page-header>

  <pre>
    {{ courses }}
  </pre>

  <n-data-table :columns="columns" :data="data" />

  <n-drawer v-model:show="showDrawer" :width="502">
    <n-drawer-content title="Create new course" closable>
      <n-form
        ref="formRef"
        :label-width="80"
        :disabled="isMutateLoading"
        size="large"
        :model="form"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <pre>
          {{ form }}
        </pre>

        <n-form-item label="Title" path="title">
          <n-input :loading="isMutateLoading" v-model:value="form.title" />
        </n-form-item>

        <n-form-item label="Order" path="order">
          <n-input-number v-model:value="form.order" :min="0" clearable />
        </n-form-item>

        <n-form-item label="Type" path="type">
          <n-select
            v-model:value="form.type"
            :options="[
              { label: 'Free', value: 'FREE' },
              { label: 'Paid', value: 'PAID' },
            ]"
          />
        </n-form-item>

        <n-form-item label="Price" path="price">
          <n-input-number
            :disabled="form.type === 'FREE'"
            v-model:value="form.price"
            :min="0"
            clearable
          />
        </n-form-item>

        <n-form-item label="Offer price" path="offer_price">
          <n-input-number
            :disabled="form.type === 'FREE'"
            v-model:value="form.offer_price"
            :min="0"
            clearable
          />
        </n-form-item>

        <n-form-item label="Publish status" path="isPublished">
          <n-switch v-model:value="form.isPublished">
            <template #checked>Published</template>
            <template #unchecked>Draft</template>
          </n-switch>
        </n-form-item>

        <n-form-item label="Author Id" path="author">
          <n-input
            placeholder="Input Name"
            :loading="isMutateLoading"
            v-model:value="form.author"
          />
        </n-form-item>

        <n-form-item>
          <n-button attr-type="submit" :loading="isMutateLoading">
            Submit
          </n-button>
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import api from "@/lib/api";
import { reactive, ref } from "vue";
import { useQuery, useMutation } from "vue-query";

const formRef = ref(null);
const showDrawer = ref(false);

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Thumbnail",
    key: "thumbnail",
  },
  {
    title: "Actions",
    key: "actions",
  },
];
const data = [
  {
    name: "Course 1",
    thumbnail: "https://via.placeholder.com/150",
    actions: [
      {
        label: "Edit",
        icon: "edit",
        color: "primary",
      },
      {
        label: "Delete",
        icon: "delete",
        color: "danger",
      },
    ],
  },
  {
    name: "Course 2",
    thumbnail: "https://via.placeholder.com/150",
    actions: [
      {
        label: "Edit",
        icon: "edit",
        color: "primary",
      },
      {
        label: "Delete",
        icon: "delete",
        color: "danger",
      },
    ],
  },
  {
    name: "Course 3",
    thumbnail: "https://via.placeholder.com/150",
    actions: [
      {
        label: "Edit",
        icon: "edit",
        color: "primary",
      },
      {
        label: "Delete",
        icon: "delete",
        color: "danger",
      },
    ],
  },
];

const form = reactive({
  title: "",
  order: 0,
  price: 0,
  offer_price: 0,
  type: "FREE",
  isPublished: false,
  thumbnail: "",
  author: "623f28b75592eca6e5a552d8",
});

const rules = {
  title: {
    required: true,
    message: "Please input the name of the course",
    trigger: "input", // input, change, blur
  },
  author: {
    trigger: "input", // input, change, blur
    required: true,
    validator(rule, value) {
      if (!value) return new Error("Please input the author of the course");

      if (value != "623f28b75592eca6e5a552d8") {
        return new Error("Author id is not 623f28b75592eca6e5a552d8");
      }
    },
  },
};

const { mutateAsync, isLoading: isMutateLoading } = useMutation((data) =>
  api.post("/courses", data)
);
const handleSubmit = async () => {
  await formRef.value.validate();
  await mutateAsync(form);
};
</script>
