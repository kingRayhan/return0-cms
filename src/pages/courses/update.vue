<template>
  <n-spin :show="courseFetching">
    <div class="max-w-3xl mx-auto">
      <PageHeader title="Update Course">
        <template #right-side>
          <n-button @click="refetch">Refetch</n-button>
          <n-button
            type="primary"
            @click="handleUpdateCourse"
            :loading="isCourseMutating"
          >
            Save
          </n-button>
        </template>
      </PageHeader>

      <n-form
        ref="formRef"
        @submit.prevent="handleUpdateCourse"
        size="large"
        :disabled="courseFetching || isCourseMutating"
        :rules="rules"
        :model="course"
      >
        <n-form-item label="Title" path="title">
          <n-input v-model:value="course.title" />
        </n-form-item>

        <n-form-item label="Type" path="type">
          <n-select
            v-model:value="course.type"
            :options="[
              { label: 'Free', value: 'FREE' },
              { label: 'Paid', value: 'PAID' },
            ]"
          />
        </n-form-item>

        <n-form-item label="Order" path="order">
          <n-input-number v-model:value="course.order" :min="0" clearable />
        </n-form-item>

        <n-form-item label="Price" path="price">
          <n-input-number
            :disabled="course.type === 'FREE'"
            v-model:value="course.price"
            :min="0"
            clearable
          />
        </n-form-item>

        <n-form-item label="Offer price" path="offer_price">
          <n-input-number
            :disabled="course.type === 'FREE'"
            v-model:value="course.offer_price"
            :min="0"
            clearable
          />
        </n-form-item>

        <n-form-item label="Publish status" path="isPublished">
          <n-switch v-model:value="course.isPublished">
            <template #checked>Published</template>
            <template #unchecked>Draft</template>
          </n-switch>
        </n-form-item>

        <n-form-item label="Thumbnail" path="thumbnail">
          <n-input
            v-model:value="course.thumbnail"
            :input-props="{ type: 'url' }"
            placeholder="Thumbnail Url"
          />
        </n-form-item>

        <n-form-item label="Author Id" path="author">
          <n-input placeholder="Input Name" v-model:value="course.author" />
        </n-form-item>

        <n-form-item label="Short description" path="excerpt">
          <n-input v-model:value="course.excerpt" type="textarea" />
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            :loading="isCourseMutating"
          >
            Save
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </n-spin>
</template>
<script setup>
import PageHeader from "@/components/page-header.vue";
import api from "@/lib/api";
import { useMessage } from "naive-ui";
import { ref, watch } from "vue";
import { useMutation, useQuery } from "vue-query";
import { useRoute } from "vue-router";
const route = useRoute();
const message = useMessage();

const formRef = ref(null);
const errors = ref([]);

const paramId = ref(route.params.id);
watch(
  () => route.params,
  (toParam, prevParams) => {
    if (toParam?.id) {
      paramId.value = toParam.id;
    }
  }
);

const {
  isFetching: courseFetching,
  data: loadedCourse,
  isError,
  refetch,
} = useQuery(["course", paramId], async ({ queryKey }) => {
  const { ok, data } = await api.get(`/cms/courses/${queryKey[1]}`);
  if (!ok) message.error("Failed to load course");
  return data;
});

const course = ref({
  title: "",
  order: 0,
  price: "",
  offer_price: "",
  type: "",
  isPublished: false,
  author: "",
  excerpt: "",
  description: "",
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

      // if (value != "623f28b75592eca6e5a552d8") {
      //   return new Error("Author id is not 623f28b75592eca6e5a552d8");
      // }
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

watch(
  () => courseFetching.value,
  (fetching) => {
    if (!fetching) {
      course.value = loadedCourse.value;
      if (loadedCourse.value.author)
        course.value.author = loadedCourse.value.author.id;
    }
  }
);

const { mutateAsync, isLoading: isCourseMutating } = useMutation(
  async (payload) => {
    const { ok, originalError } = await api.patch(
      `/cms/courses/${paramId.value}`,
      payload
    );
    if (!ok) {
      errors.value = originalError?.response?.data?.message;
      message.error("Failed to create course");
      return;
    }
    message.success("Successfully created course");
  }
);

const handleUpdateCourse = async () => {
  await formRef.value.validate();
  await mutateAsync(course.value);
};
</script>
