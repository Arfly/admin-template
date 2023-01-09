<template>
  <el-tooltip :content="props.content">
    <icon
      :class="`icon ${props.customClass ?? ''}`"
      :name="InfoFilled"
    />
  </el-tooltip>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
const props = defineProps<{ content: string; customClass?: string }>()
</script>

<style scoped>
.icon {
  position: relative;
  left: 0;
  margin-left: 5px;
  color: #999;
}
</style>
