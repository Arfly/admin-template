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
        <el-form-item
          label="资源路径"
          :title="formObj.link"
        >
          <span class="resource-path">{{ formObj.link }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="资源编码">{{ formObj.code }}</el-form-item>
        <el-form-item label="状态">
          <p :style="{ color: `${formObj.status ? '#1177EE' : '#FA5555'}` }">
            {{ formObj.status ? '启用' : '停用' }}
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="归属系统">
          {{ formObj.relationSystemName }}
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
    <el-form-item label="备注">{{ formObj.remark }}</el-form-item>
    <el-divider />
    <el-form-item
      label="关联前端资源"
      prop="relation"
      style="padding-left: 15px; padding-right: 15px"
    >
      <el-table
        :data="formObj.relPageResourceList"
        max-height="300px"
      >
        <el-table-column
          label="资源名称"
          align="center"
          prop="name"
        />
        <el-table-column
          label="所属系统"
          align="center"
          prop="relationSystemName"
        />
        <el-table-column
          label="资源编码"
          align="center"
          prop="code"
        />
        <el-table-column
          label="父级资源"
          align="center"
          prop="parentName"
        />
        <el-table-column
          label="资源类型"
          align="center"
        >
          <template #default="scope">
            {{ Stuff(RESOURCES_TYPE[scope.row.type]) }}
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { BackendResourceDetail, getBackendResourceDetail, ResourcePropData, SUCCESS_CODE } from '@/api'
import { useFilter } from '@/hooks/filter'
import { RESOURCES_TYPE } from '@/hooks/useConfig'
import { ref, watch } from 'vue'
const { Stuff } = useFilter()

const props = defineProps<{
  rowObj: Partial<ResourcePropData>
  visible: boolean
}>()

const formObj = ref<BackendResourceDetail>({
  resourceId: '-',
  systemId: '-',
  name: '-',
  code: '-',
  remark: '-',
  relationSystemName: '-',
  link: '-',
  status: null,
  relPageResourceList: []
})
watch(
  () => props.rowObj,
  async val => {
    const { code, data } = await getBackendResourceDetail(val.resourceId)
    if (code === SUCCESS_CODE) {
      formObj.value = Object.assign(formObj.value, data)
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

.resource-path {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
