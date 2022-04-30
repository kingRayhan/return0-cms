<template>
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-lg font-semibold">Lessons</h1>
    <n-button :loading="isLoading" @click="saveLession">Save</n-button>
  </div>

  <n-dynamic-input
    v-model:value="lessons"
    show-sort-button
    key-placeholder="Lesson"
    value-placeholder="Description"
    placeholder="Please type here"
    @create="onCreateLesson"
    @remove="onRemoveLesson"
  >
    <template #default="{ value }">
      <n-modal v-model:show="value.modal">
        <n-card class="max-w-4xl mx-10">
          <n-form size="large">
            <n-form-item label="Lesson title">
              <n-input v-model:value="value.title" />
            </n-form-item>
            <n-form-item label="Short Description">
              <n-input v-model:value="value.description" type="textarea" />
            </n-form-item>

            <n-form-item label="Published">
              <n-switch v-model:value="value.isPublished" />
            </n-form-item>

            <n-form-item label="Free preview">
              <n-switch v-model:value="value.isFreePreview" />
            </n-form-item>

            <n-form-item label="Lesson Type">
              <n-select
                v-model:value="value.type"
                :options="[
                  { label: 'Video', value: 'VIDEO' },
                  { label: 'Article', value: 'ARTICLE' },
                ]"
              />
            </n-form-item>

            <div v-if="value.type === 'VIDEO'">
              <n-form-item label="Media Source">
                <n-select
                  v-model:value="value.media_source_type"
                  :options="[
                    { label: 'Youtube', value: 'YOUTUBE' },
                    { label: 'Vimeo', value: 'VIMEO' },
                    { label: 'Jw Player', value: 'JW_PLAYER' },
                    { label: 'External Url', value: 'EXTERNAL_URL' },
                  ]"
                />
              </n-form-item>

              <h3 class="mb-2 text-lg font-semibold">Media sources</h3>
              <div class="flex flex-col gap-2">
                <n-input-group>
                  <n-input-group-label style="width: 120px">
                    Vimeo Id
                  </n-input-group-label>
                  <n-input v-model:value="value.media_sources.vimeo" />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 120px">
                    Youtube Id
                  </n-input-group-label>
                  <n-input v-model:value="value.media_sources.youtube" />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 120px">
                    jwPlayer Id
                  </n-input-group-label>
                  <n-input v-model:value="value.media_sources.jwPlayer" />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 120px">
                    externalUrl
                  </n-input-group-label>
                  <n-input v-model:value="value.media_sources.externalUrl" />
                </n-input-group>
              </div>
            </div>

            <div v-if="value.type === 'ARTICLE'">
              <n-form-item label="Article content">
                <editor v-model="value.body" />
              </n-form-item>
            </div>
          </n-form>
        </n-card>
      </n-modal>

      <div
        class="flex items-center justify-between w-full p-2 bg-white rounded-md shadow"
      >
        <p class="text-base font-semibold">{{ value.title }}</p>

        <div class="flex items-center gap-2">
          <svg
            v-if="!value.isPublished"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clip-rule="evenodd"
            />
            <path
              d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
            />
          </svg>
          <n-button @click="value.modal = true">Edit</n-button>
        </div>
      </div>
    </template>
  </n-dynamic-input>
</template>

<script setup>
import { ref, watch } from "vue";
import Editor from "./Editor.vue";
import { useMutation } from "vue-query";
import { useMessage } from "naive-ui";
import api from "@/lib/api";
const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
  lessons: {
    type: Array,
    required: true,
  },
});
const lessons = ref(props.lessons || []);
const remove_index = ref(null);
const deleted_lesson_ids = ref([]);
const message = useMessage();

const onCreateLesson = () => {
  return {
    title: "Lesson " + lessons.value.length,
    isPublished: false,
    isFreePreview: false,
    excerpt: "",
    thumbnail: "",
    type: "VIDEO",
    media_source_type: "YOUTUBE",
    media_sources: {
      vimeo: "",
      youtube: "",
      jwPlayer: "",
      externalUrl: "",
    },
    modal: false,
  };
};

watch(
  () => lessons.value,
  (_, oldLessons) => {
    if (remove_index.value !== null) {
      const index = remove_index.value;
      const lesson = oldLessons[index];
      if (lesson?._id) {
        deleted_lesson_ids.value.push(lesson._id);
      }
      remove_index.value = null;
    }
  }
);

const onRemoveLesson = (index) => {
  remove_index.value = index;
};

const { mutateAsync, isLoading } = useMutation(async () => {
  const { ok } = await api.post(
    `/cms/courses/lessons-builder/${props.courseId}`,
    {
      data: lessons.value.map((lesson, i) => ({ ...lesson, order: i })),
      deleted_lesson_ids: deleted_lesson_ids.value,
    }
  );
  if (!ok) {
    // errors.value = originalError?.response?.data?.message;
    message.error("Failed to create lesson");
    return;
  }
  message.success("Successfully created chapter");
});

const saveLession = async () => {
  await mutateAsync();
};
</script>
