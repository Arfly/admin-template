<template>
  <Main center>
    <template #content>
      <el-form
        ref="form"
        class="form"
        :model="formObj"
        label-width="120px"
      >
        <el-form-item label="角色名称">{{ formObj.roleName }}</el-form-item>

        <el-form-item label="角色编码">{{ formObj.roleCode }}</el-form-item>

        <el-form-item label="归属系统">{{ systemName }}</el-form-item>
        <el-form-item label="备注">{{ formObj.desc }}</el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">关闭</el-button>
      </span>
    </template>
  </Main>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { getAllSystem, getRoleDetail, RoleDetail, SUCCESS_CODE, SystemListItem } from '@/api'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const store = useStore()
const route = useRoute()
const id = route.query.id as string

const system = ref<SystemListItem[]>([])

const viewVisible = ref(false)
const dialogClosed = () => {
  viewVisible.value = false
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
const formObj = ref<RoleDetail>({
  createBy: '-',
  desc: '-',
  id: '',
  lastUpdateBy: '-',
  roleCode: '-',
  roleName: '-',
  status: null,
  systemId: ''
})

const systemName = computed(() => {
  const curSys = system.value.find(sys => sys.systemId === formObj.value.systemId)
  return curSys ? curSys.name : '-'
})

onMounted(async () => {
  if (id) {
    const roleDetailRes = await getRoleDetail(id)
    if (roleDetailRes.code === SUCCESS_CODE) {
      formObj.value = roleDetailRes.data
    }

    const { code, data } = await getAllSystem()
    if (code === SUCCESS_CODE) {
      system.value = data
    }
  }
})
</script>
<style lang="less" scoped>
.invalid {
  margin-left: 12px;
  color: #fa5555;
}

.form {
  row-gap: 24px;
}
</style>
