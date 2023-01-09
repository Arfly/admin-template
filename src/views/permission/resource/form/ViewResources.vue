<template>
  <p class="main-title">{{ `资源详情 - ${formObj.name}` }}</p>
  <el-form
    ref="form"
    :model="formObj"
    label-width="120px"
    size="mini"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="资源名称">{{ formObj.name }}</el-form-item>
        <el-form-item label="父级资源">
          {{ formObj.parentName || '无父级资源' }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="资源编码">{{ formObj.code }}</el-form-item>
        <el-form-item label="资源层级">{{ formObj.level }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="归属系统">
          {{ formObj.relationSystemName }}
        </el-form-item>
        <el-form-item label="资源类型">
          {{ RESOURCES_TYPE[formObj.resourceType] }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="状态">
      <p :style="{ color: `${formObj.status ? '#1177EE' : '#FA5555'}` }">
        {{ formObj.status ? '启用' : '停用' }}
      </p>
    </el-form-item>
    <el-divider />
    <el-form-item label="备注">{{ formObj.remark }}</el-form-item>
    <el-divider />
    <el-form-item
      label="关联后端资源"
      prop="relation"
      style="padding-left: 15px; padding-right: 15px"
    >
      <el-table
        :data="formObj.relBackendResourceList"
        max-height="300px"
      >
        <el-table-column
          label="资源名称"
          align="center"
          prop="backendResourceName"
        />
        <el-table-column
          label="所属系统"
          align="center"
          prop="relationSystemName"
        />
        <el-table-column
          label="资源编码"
          align="center"
          prop="backendResourceCode"
        />
        <el-table-column
          label="资源路径"
          align="center"
          prop="link"
        />
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { RESOURCES_TYPE } from '@/hooks/useConfig'
import { SUCCESS_CODE, resourceDetail, ResDetailData } from '@/api'
const props = defineProps<{
  visible: boolean
  rowObj: { resourceId: string }
}>()

const formObj = ref<ResDetailData>({
  resourceId: '-',
  systemId: '',
  name: '-',
  code: '-',
  remark: '-',
  relationSystemName: '-',
  resourceType: null,
  parentName: '-',
  parentId: null,
  level: null,
  status: null,
  relBackendResourceList: []
})

const resourceList = ref([])
watch(
  () => props.rowObj,
  async val => {
    const { code, data } = await resourceDetail(val.resourceId)
    if (code === SUCCESS_CODE) {
      formObj.value = Object.assign(formObj.value, data)
      resourceList.value = data.relBackendResourceList
    }
  },
  { deep: true, immediate: true }
)
</script>
<style lang="less" scoped>
:deep(.mark .el-form-item__label:before) {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
  margin-top: 2px;
}
.main-title {
  font-size: 18px;
  color: #333333;
  font-weight: 600;
  margin-left: 20px;
  margin-bottom: 32px;
}
:deep(.el-table th.el-table__cell) {
  background: #f0f2f5;
  font-size: 16px;
  color: #333333;
  font-weight: 600;
}
</style>
