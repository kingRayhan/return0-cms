<template>
  <n-spin :show="courseFetching">
    <div class="max-w-5xl mx-auto">
      <PageHeader title="Update Course">
        <template #right-side>
          <n-button type="primary" @click="refetch" :loading="courseFetching">
            Refetch
          </n-button>

          <n-button type="primary" @click="handleSave" :loading="isLoading">
            Save
          </n-button>
        </template>
      </PageHeader>

      <n-dynamic-input
        v-model:value="chapters"
        :on-create="onCreateChapter"
        :on-remove="onRemoveChapter"
        show-sort-button
      >
        <template #create-button-default> Add chapter </template>
        <template #default="{ value }">
          <div class="w-full p-4 rounded-md shadow-sm bg-slate-50">
            <n-form>
              <n-form-item label="Chapter title">
                <n-input v-model:value="value.title" />
              </n-form-item>

              <n-form-item label="Short description">
                <n-input v-model:value="value.description" type="textarea" />
              </n-form-item>
            </n-form>
            <LessionBuilder :lessons="value.lessons" :courseId="value._id" />
          </div>
        </template>
      </n-dynamic-input>
    </div>
  </n-spin>
</template>

<script setup>
import { ref, watch } from "vue";
import PageHeader from "@/components/page-header.vue";
import { useMutation, useQuery } from "vue-query";
import { useMessage } from "naive-ui";
import api from "@/lib/api";
import { useRoute } from "vue-router";
import LessionBuilder from "@/components/lession-builder.vue";
const route = useRoute();

const paramId = ref(route.params.id);
watch(
  () => route.params,
  (toParam, prevParams) => {
    if (toParam?.id) {
      paramId.value = toParam.id;
    }
  }
);

const remove_index = ref(null);

const chapters = ref([]);
const deleted_chapter_ids = ref([]);
const message = useMessage();

const {
  isFetching: courseFetching,
  data: loadedCourse,
  refetch,
} = useQuery(
  ["course", paramId],
  async ({ queryKey }) => {
    const { ok, data } = await api.get(`/cms/courses/${queryKey[1]}`);
    if (!ok) message.error("Failed to load course");
    return data;
  },
  { refetchOnWindowFocus: false }
);

watch(
  () => courseFetching.value,
  (fetching) => {
    if (!fetching) {
      chapters.value = loadedCourse.value.chapters;
    }
  }
);

watch(
  () => chapters.value,
  (newChapters, oldChapters) => {
    if (remove_index.value !== null) {
      const index = remove_index.value;
      const chapter = oldChapters[index];
      if (chapter?._id) {
        deleted_chapter_ids.value.push(chapter._id);
      }
      remove_index.value = null;
    }
  }
);

const onCreateChapter = () => {
  return {
    title: `Chapter ${chapters.value.length + 1}`,
    description: "",
  };
};

const onRemoveChapter = (index) => {
  //   console.log(chapters.value);
  //   if (chapters.value[index]?._id) {
  //     deleted_chapter_ids.value.push(chapters.value[index]._id);
  //   }
  remove_index.value = index;
};

const { mutateAsync, isLoading } = useMutation(async () => {
  const { ok } = await api.post(
    `/cms/courses/chapters-builder/${paramId.value}`,
    {
      data: chapters.value.map((chapter, i) => ({ ...chapter, order: i })),
      deleted_chapter_ids: deleted_chapter_ids.value,
    }
  );
  if (!ok) {
    // errors.value = originalError?.response?.data?.message;
    message.error("Failed to create chapter");
    return;
  }
  message.success("Successfully created chapter");
});

const handleSave = async () => {
  await mutateAsync();
};
</script>
