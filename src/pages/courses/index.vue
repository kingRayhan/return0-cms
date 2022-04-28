<template>
  <page-header title="Courses">
    <template #right-side>
      <n-button @click="refetch">Refetch</n-button>
      <n-button type="primary" @click="showDrawer = true"> New </n-button>
    </template>
  </page-header>

  <n-data-table :columns="columns" :data="courses" :loading="loading_query" />
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
        <n-alert v-if="errors.length" title="Invalid Input" type="error">
          {{ errors.join("\n") }}
        </n-alert>

        <n-form-item label="Title" path="title">
          <n-input :loading="isMutateLoading" v-model:value="form.title" />
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

        <n-form-item label="Order" path="order">
          <n-input-number v-model:value="form.order" :min="0" clearable />
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

        <n-form-item label="Thumbnail" path="thumbnail">
          <n-input
            v-model:value="form.thumbnail"
            :input-props="{ type: 'url' }"
            placeholder="Thumbnail Url"
          />
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
import { h, reactive, ref } from "vue";
import { useMutation, useQuery } from "vue-query";
import { RouterLink, useRoute } from "vue-router";
import { useTitle } from "@vueuse/core";
import {
  NButton,
  NButtonGroup,
  NImage,
  NSwitch,
  NTag,
  useMessage,
} from "naive-ui";
import PageHeader from "@/components/page-header.vue";
const message = useMessage();
const { meta } = useRoute();

useTitle(meta.pageTitle);

const formRef = ref(null);
const showDrawer = ref(false);
const errors = ref([]);

// Load courses
const {
  isFetching: loading_query,
  data: courses,
  refetch,
} = useQuery("courses", async () => {
  const { ok, data } = await api.get("/courses");
  if (!ok) message.error("Failed to load courses");
  return data;
});

const columns = [
  {
    title: "Thumbnail",
    key: "thumbnail",
    width: "150px",
    render(row) {
      return h(NImage, {
        src: row.thumbnail,
        width: "100",
      });
    },
  },
  {
    title: "Name",
    key: "title",
  },
  {
    title: "Type",
    render(row) {
      return h(
        NTag,
        { type: row.type === "FREE" ? "error" : "success" },
        row.type
      );
    },
  },
  {
    title: "Published",
    render(row) {
      return h(
        NTag,
        { type: !row.isPublished ? "error" : "success" },
        row.isPublished ? "Published" : "Drafted"
      );
    },
  },
  {
    title: "Action",
    render(row) {
      return h(NButtonGroup, [
        h(
          NButton,
          { type: "info" },
          h(
            RouterLink,
            { to: { name: "courses.update", params: { id: row.id } } },
            "Course Detail"
          )
        ),
        h(
          NButton,
          { type: "success" },
          h(
            RouterLink,
            { to: { name: "courses.builder", params: { id: row.id } } },
            "Builder"
          )
        ),
        h(
          NButton,
          {
            type: "error",
            "on-click": () => {
              if (confirm("Are you sure to delete this course?")) {
                api.delete(`/courses/${row.id}`).then(({ ok }) => {
                  if (ok) {
                    refetch.value();
                    message.success("Course deleted");
                  } else {
                    message.error("Failed to delete course");
                  }
                });
              }
            },
          },
          "Delete"
        ),
      ]);
    },
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
  thumbnail: {
    trigger: "input", // input, change, blur
    validator(_, value) {
      if (!value.startsWith("http")) {
        return new Error("Thumbnail url must start with http/https");
      }
    },
  },
};

const { mutateAsync, isLoading: isMutateLoading } = useMutation(
  async (payload) => {
    const { ok, originalError } = await api.post("/courses", payload);
    if (!ok) {
      errors.value = originalError?.response?.data?.message;
      message.error("Failed to create course");
      return;
    }
    refetch.value();
    message.success("Successfully created course");
  }
);

const handleSubmit = async () => {
  await formRef.value.validate();
  await mutateAsync(form);
  refetch.value();
};
</script>
