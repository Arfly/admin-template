<template>
  <p class="main-title">
    {{ !!props.rowObj.laborType ? '新增资源' : `编辑资源 - ${formObj.name}` }}
  </p>
  <!--内容主体区域-->
  <el-form
    ref="formRef"
    :model="formObj"
    :rules="formRules"
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
          label="资源路径"
          prop="link"
        >
          <el-input
            v-model="formObj.link"
            placeholder="请输入..."
            maxlength="50"
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
            placeholder="系统自动生成"
            maxlength="40"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
          style="max-width: 180px"
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
          <Tip :content="RESOURCE_TOOLTIP.BE_ACTIVE" />
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
import {
  BackendResourceDetail,
  createBackendResource,
  getAllSystem,
  getBackendResourceDetail,
  ResourcePropData,
  SUCCESS_CODE,
  updateBackendResource
} from '@/api'
import Remark from '@/components/common/Remark.vue'
import { useStoreHook } from '@/hooks/useStore'
import { RESOURCE_TOOLTIP } from '@/text'
import Tip from '@/views/components/panel/Tip.vue'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import SearchAssociation from '../dialog/SearchAssociation.vue'

const props = defineProps<{
  rowObj: Partial<ResourcePropData>
}>()

const emit = defineEmits(['editSuccess', 'close'])

const DEFAULT: BackendResourceDetail = {
  resourceId: '',
  systemId: '',
  name: '',
  code: '',
  remark: '',
  relationSystemName: '',
  link: '',
  status: null,
  relPageResourceList: []
}

const formRef = ref(null)
const treeData = ref([{ resourceId: 0, name: '无父级资源' }])
const systemData = ref([])
const { systemId } = useStoreHook()
const formObj = ref<BackendResourceDetail>(Object.assign({ ...DEFAULT }, { systemId: systemId.value }))
const resourceList = ref([])
const visible = ref(false)

function resetForm() {
  formObj.value = Object.assign({ ...DEFAULT }, { systemId: systemId.value })
}
const getResourceDetail = async id => {
  const { code, data } = await getBackendResourceDetail(id)

  if (code === SUCCESS_CODE) {
    formObj.value = data
    resourceList.value = data.relPageResourceList
  }
}

const formRules = ref({
  name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
  link: [{ required: true, message: '请输入资源路径', trigger: 'blur' }],
  systemId: [{ required: true, message: '请选择归属系统', trigger: 'blur' }]
})
const onSubmit = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let res

    const formObjParams = formObj.value
    const params = {
      name: formObjParams.name,
      code: formObjParams.code,
      remark: formObjParams.remark,
      link: formObjParams.link,
      status: formObjParams.status
    }
    if (props.rowObj.laborType) {
      res = await createBackendResource(Object.assign(params, { systemId: formObjParams.systemId }))
    } else {
      delete params.code
      res = await updateBackendResource(Object.assign(params, { resourceId: formObjParams.resourceId }))
    }
    if (res.code === SUCCESS_CODE) {
      // eslint-disable-next-line new-cap
      ElMessage({
        type: 'success',
        message: props.rowObj.resourceId ? '修改资源信息成功！' : '资源已成功创建'
      })
      emit('editSuccess')
    }
  })
}

const closeForm = () => {
  resetForm()
  if (props.rowObj.laborType) {
    formObj.value = Object.assign(formObj.value, props.rowObj)
  } else {
    getResourceDetail(props.rowObj.resourceId)
  }

  emit('close')
}
const callData = tableData => {
  const row = formObj.value.relPageResourceList.find(item => item.backendResourceId === tableData.backendResourceId)
  if (row) {
    ElMessage.warning('请不要重复关联')
    return
  }
  formObj.value.relPageResourceList.push(tableData)
  ElMessage.success('数据已成功添加,保存后生效')
}

const getSystemList = async () => {
  const { code, data } = await getAllSystem()
  if (code === SUCCESS_CODE) {
    systemData.value = data
  }
}
watch(
  () => props.rowObj,
  val => {
    if (val) {
      resetForm()
      getSystemList()
      if (val.laborType) {
        formObj.value = Object.assign(formObj.value, props.rowObj)
        treeData.value = [{ resourceId: 0, name: '无父级资源' }]
      } else {
        getResourceDetail(val.resourceId)
      }
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
