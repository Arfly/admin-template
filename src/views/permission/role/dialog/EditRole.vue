<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        class="form"
        :model="formObj"
        label-width="100px"
        :rules="formRules"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="formObj.roleName"
            placeholder="请输入..."
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          label="归属系统"
          prop="systemId"
        >
          <el-select
            v-model="formObj.systemId"
            :disabled="true"
            style="width: 100%"
            placeholder="请选择所属系统"
          >
            <el-option
              v-for="item in systemData"
              :key="item.systemId"
              :label="item.name"
              :value="item.systemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input
            v-model="formObj.roleCode"
            placeholder="系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>

        <el-form-item
          class="w-100"
          label="备注"
          prop="desc"
        >
          <Remark v-model="formObj.desc" />
        </el-form-item>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="submitUser"
        >
          确 定
        </el-button>
        <el-button @click="dialogClosed">取 消</el-button>
      </span>
    </template>
  </Main>
</template>
<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllSystem, SUCCESS_CODE, getRoleDetail, roleEdit, RoleDetail } from '@/api'
import { useStoreHook } from '@/hooks/useStore'
import Remark from '@/components/common/Remark.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
const route = useRoute()
const store = useStore()
const id = route.query.id as string
const { systemId } = useStoreHook()
const formRef = ref(null)
const systemData = ref([])
const editVisible = ref(false)
const DEFAULT_FORM = {
  createBy: '',
  desc: '',
  id: '',
  lastUpdateBy: '',
  roleCode: '',
  roleName: '',
  status: null,
  systemId: systemId.value
}
const formObj = ref<RoleDetail>(DEFAULT_FORM)
onMounted(() => {
  if (id) {
    getRoleDetail(id).then(res => {
      formObj.value = res.data
    })
  }
  nextTick(async () => {
    const { code, data } = await getAllSystem()
    if (code === SUCCESS_CODE) {
      systemData.value = data
    }
  })
})
const dialogClosed = () => {
  // formRef.value.resetFields()
  editVisible.value = false
  formObj.value = DEFAULT_FORM
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
const formRules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleType: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
  systemId: [{ required: true, message: '请选择归属系统', trigger: 'blur' }]
})

const submitUser = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const { roleName, desc, systemId, id } = formObj.value
    const { code } = await roleEdit({ id, roleName, desc, systemId })

    if (code === SUCCESS_CODE) {
      // eslint-disable-next-line new-cap
      ElMessage({
        type: 'success',
        message: '修改角色信息成功！'
      })
    }
  })
}
</script>
<style lang="less" scoped>
.form {
  row-gap: 24px;
}
</style>
