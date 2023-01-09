<template>
  <el-icon
    :size="size"
    :color="color"
    style="height: 100%"
  >
    <component :is="name" />
  </el-icon>
</template>

<script>
import { defineComponent } from 'vue'
import { CaretBottom, Delete, Document, FolderRemove, InfoFilled } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Icon',
  components: [Delete, InfoFilled, FolderRemove, Document, CaretBottom],
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  }
})
</script>
