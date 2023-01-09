<template>
  <p class="main-title">
    {{ !!rowObj.laborType ? '新增资源' : `编辑资源 - ${formObj.name}` }}
  </p>
  <!--内容主体区域-->
  <el-form
    ref="formRef"
    :model="formObj"
    :rules="!!rowObj.laborType ? NEW_RESOURCE_VALIDATOR : EDIT_RESOURCE_VALIDATOR"
    label-width="110px"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item
          label="资源名称"
          prop="name"
        >
          <el-input
            v-model="formObj.name"
            placeholder="请输入..."
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          label="父级资源"
          prop="parentId"
        >
          <el-select
            v-model="formObj.parentName"
            style="width: 100%"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="资源编码"
          prop="code"
        >
          <el-input
            v-model="formObj.code"
            placeholder="请输入"
            maxlength="40"
            :disabled="!rowObj.laborType"
          />
          <Tip :content="RESOURCE_TOOLTIP.CODE" />
        </el-form-item>
        <el-form-item
          label="资源层级"
          prop="level"
        >
          <el-input
            v-model="formObj.level"
            placeholder="选择父级资源后系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="归属系统"
          prop="systemId"
        >
          <el-select
            v-model="formObj.systemId"
            placeholder="请选择..."
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="item in systemData"
              :key="item.systemId"
              :label="item.name"
              :value="item.systemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="资源类型"
          prop="resourceType"
        >
          <el-select
            v-model="formObj.resourceType"
            placeholder="请选择..."
            style="width: 100%"
            :disabled="!rowObj.laborType"
          >
            <el-option
              v-for="item in RESOURCES_TYPE_LIST"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="8"
        style="max-width: 200px"
      >
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-switch
            v-model="formObj.status"
            width="60px"
            size="large"
            :active-value="1"
            :inactive-value="0"
            inline-prompt
            style="--el-switch-on-color: #1177ee; --el-switch-off-color: #dddddd"
            active-text="启用"
            inactive-text="停用"
          />
          <Tip :content="RESOURCE_TOOLTIP.ACTIVE" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="16">
        <el-form-item
          label="备注"
          prop="remarks"
          style="padding-left: 15px; padding-right: 15px"
        >
          <Remark v-model="formObj.remark" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="24">
        <el-form-item
          label="关联后端资源"
          prop="relation"
          style="padding-left: 15px; padding-right: 15px"
        >
          <div class="table-top">
            <el-button
              text
              @click.stop="visible = true"
            >
              <template #icon>
                <img
                  src="@/assets/icons/icon-add-circle.png"
                  style="margin-right: 8px"
                />
              </template>
              关联资源
            </el-button>
          </div>
          <el-table
            :data="formObj.relBackendResourceList"
            height="180px"
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
            <el-table-column
              label="操作"
              align="center"
            >
              <template #default="scope">
                <icon
                  color="#ed5565"
                  style="cursor: pointer"
                  :name="Delete"
                  @click="deleteResource(scope.$index)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="position: relative; bottom: 0; text-align: center">
      <el-col :span="24">
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确认
        </el-button>
        <el-button @click="closeForm">取消</el-button>
      </el-col>
    </el-row>
  </el-form>
  <SearchAssociation
    v-model:visible="visible"
    @edit-success="callData"
    @close="visible = false"
  />
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RESOURCES_TYPE_LIST } from '@/hooks/useConfig'
import { getAllSystem, resourceDetail, resourceAdd, resourceEdit, SUCCESS_CODE, ResDetailData } from '@/api'

import SearchAssociation from '../dialog/SearchAssociation.vue'
import Remark from '@/components/common/Remark.vue'
import Tip from '@/views/components/panel/Tip.vue'
import { RESOURCE_TOOLTIP } from '@/text'
import { NEW_RESOURCE_VALIDATOR, EDIT_RESOURCE_VALIDATOR } from '@/validator'
import { Delete } from '@element-plus/icons-vue'
import { useStoreHook } from '@/hooks/useStore'
const props = defineProps<{
  rowObj: { resourceId: string; laborType?: string; openType?: string }
}>()

const emit = defineEmits(['editSuccess', 'close'])

const DEFAULT = {
  resourceId: '',
  systemId: '',
  name: '',
  code: '',
  remark: '',
  relationSystemName: '',
  resourceType: null,
  parentName: '',
  parentId: null,
  level: null,
  status: null,
  relBackendResourceList: []
}

const formRef = ref(null)
const systemData = ref([])
const { systemId } = useStoreHook()
const formObj = ref<ResDetailData>(DEFAULT)
const visible = ref(false)

const getResourceDetail = async id => {
  const { code, data } = await resourceDetail(id)
  if (code === SUCCESS_CODE) {
    formObj.value = data
    formObj.value.parentName = data.parentName || data.relationSystemName
  }
}

const onSubmit = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let res
    const backendResourceIds = formObj.value.relBackendResourceList.map(item => item.backendResourceId)
    const params = {
      ...formObj.value,
      relBackendResourceList: null,
      backendResourceIds
    }
    if (props.rowObj.laborType) {
      if (formObj.value.level >= 16) {
        // eslint-disable-next-line new-cap
        ElMessage({ type: 'warning', message: '最多注册15级资源' })
        return false
      }
      const { resourceType, parentId, name, code, level, status, remark, backendResourceIds, systemId } = params
      res = await resourceAdd({
        type: resourceType,
        parentId,
        name,
        level,
        code,
        status,
        remark,
        backendResourceIds,
        systemId
      })
    } else {
      const { name, status, remark, backendResourceIds } = params
      res = await resourceEdit({
        name,
        resourceId: props.rowObj.resourceId,
        remark,
        status,
        backendResourceIds
      })
    }
    if (res.code === SUCCESS_CODE) {
      ElMessage.success(props.rowObj.resourceId ? '修改资源信息成功！' : '资源已成功创建')
      emit('editSuccess')
    }
  })
}

const closeForm = () => {
  if (props.rowObj.laborType) {
    formObj.value = Object.assign({ ...DEFAULT }, props.rowObj)
  } else {
    getResourceDetail(props.rowObj.resourceId)
  }

  emit('close')
}
const callData = tableData => {
  const row = formObj.value.relBackendResourceList.find(item => item.backendResourceId === tableData.backendResourceId)
  if (row) {
    ElMessage.warning('请不要重复关联')
    return
  }
  const relBackendResourceList = [...formObj.value.relBackendResourceList]
  relBackendResourceList.push(tableData)

  formObj.value = {
    ...formObj.value,
    relBackendResourceList
  }
  ElMessage.success('数据已成功添加,保存后生效')
  visible.value = false
}
const deleteResource = index => {
  formObj.value.relBackendResourceList.splice(index, 1)
}
watch(
  () => props.rowObj,
  val => {
    if (val) {
      if (val.laborType) {
        formObj.value = Object.assign({ ...DEFAULT }, { systemId: systemId.value }, props.rowObj)
      } else {
        getResourceDetail(val.resourceId)
      }
      getAllSystem().then(res => (systemData.value = res.data))
    }
  },
  { deep: true, immediate: true }
)
</script>
<style lang="less" scoped>
.el-col-8 {
  padding-left: 15px;
  padding-right: 15px;
}
.main-title {
  font-size: 18px;
  color: #333333;
  font-weight: 600;
  margin-left: 20px;
  margin-bottom: 32px;
}
.table-top {
  border: 1px solid rgba(221, 221, 221, 1);
  border-bottom: none;
  width: 100%;
  padding: 9px;
}
:deep(.el-table th.el-table__cell) {
  background: #f0f2f5;
  font-size: 16px;
  color: #333333;
  font-weight: 600;
}
</style>
