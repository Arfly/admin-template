<template>
  <el-input
    v-model="keyWord"
    clearable
    placeholder="搜索..."
    @input="emit('update:modelValue', keyWord)"
    @keyup.enter.stop="emit('search', keyWord)"
    @clear="emit('clear')"
  >
    <template #suffix>
      <svgIcon
        name="search"
        @click="emit('search', keyWord)"
      />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const keyWord = ref('')

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

watch(
  () => props.modelValue,
  () => {
    keyWord.value = props.modelValue
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style scoped></style>
