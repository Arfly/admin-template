<template>
  <el-input
    v-model="val"
    class="textarea"
    type="textarea"
    :row="4"
    show-word-limit
    maxlength="200"
    clearable
    :input-style="{
      height: '80px'
    }"
    resize="none"
    placeholder="请输入..."
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['change', 'update:modelValue'])

const val = ref(props.modelValue)

watch(
  () => props.modelValue,
  () => {
    val.value = props.modelValue
  },
  {
    immediate: true,
    deep: true
  }
)

function onChange() {
  emit('update:modelValue', val.value)
  emit('change', val.value)
}
</script>

<style scoped>
.textarea {
  /* min-height: 72px; */
  max-width: 636px;
}
</style>
