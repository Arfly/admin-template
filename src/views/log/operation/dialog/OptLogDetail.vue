<template>
  <el-dialog
    v-model="dialogVis"
    title="操作日志详情"
    width="70%"
    class="system-edit"
    @close="dialogClosed"
  >
    <!--内容主体区域-->
    <FlexTpl :data="basicInfoData" />
    <el-divider class="divider" />
    <FlexTpl :data="data" />
    <template #footer>
      <el-button @click="dialogClosed">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { OperationLogListItem } from '../../api'
import FlexTpl from './template/FlexTpl.vue'

const props = withDefaults(
  defineProps<{
    rowObj: OperationLogListItem
    visible: boolean
  }>(),
  {
    visible: false
  }
)

const dialogVis = ref(false)
watch(
  () => props.visible,
  () => {
    dialogVis.value = props.visible
  },
  {
    immediate: true
  }
)

const basicInfoData = ref({
  功能模块: props.rowObj.moduleName || '--',
  操作类型: props.rowObj.operateType || '--',
  操作用户: props.rowObj.operateUserName || '--',
  操作时间: props.rowObj.operateTime || '--',
  操作目标: props.rowObj.operateTarget || '--'
})

const data = ref(props.rowObj.operateContent)

const emit = defineEmits(['close'])

const dialogClosed = () => {
  emit('close')
}
</script>
