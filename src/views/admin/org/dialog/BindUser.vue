<template>
  <Main center>
    <template #content>
      <el-form
        class="custom-form"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="组织名称">
          <el-input
            v-model="form.name"
            :title="form.name"
            disabled
          />
        </el-form-item>

        <el-form-item label="上级组织">
          <el-input
            v-model="form.parentName"
            disabled
          />
        </el-form-item>

        <el-form-item label="组织类型">
          <el-input
            :value="UNIT_TYPE[form.unitTypeCode]"
            disabled
          />
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="binding-panel-container">
        <div class="sub-title">关联用户</div>
        <BindingPanel>
          <template #title>需要关联的用户</template>
          <template #label> 可以选择需要开通的资源（可多选），保存即生效 </template>
          <template #content>
            <UserTableWithSearch
              ref="userTableRef"
              :bind-user-ids="bindUserIds"
              :selected="multipleSelection"
              @selection-change="handleSelectionChange"
              @remove-select="onRemoveSelect"
            />
          </template>
        </BindingPanel>

        <BindingPanel>
          <template #title>已选择的用户</template>
          <template #label> 展示已选择的用户，可以取消关联，保存即生效 </template>
          <template #content>
            <BindUserTable
              :data="selectedUser"
              @delete="onRemove"
            />
          </template>
        </BindingPanel>
      </div>
    </template>
    <template #footer>
      <el-button
        type="primary"
        @click="onSubmit"
      >
        确认
      </el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </Main>
</template>

<script setup lang="ts">
import {
  getOrgDetail,
  getRelationUserByOrg,
  OrgBindUserItem,
  relateUser,
  SUCCESS_CODE,
  UserListItem,
  UnitTypeCode
} from '@/api'
import { ElMessage, FormRules } from 'element-plus'
import { onMounted, ref } from 'vue'
import UserTableWithSearch from '@/views/components/table/UserTableWithSearch.vue'
import BindUserTable from '../../../components/table/BindUserTable.vue'
import { UNIT_TYPE } from '@/hooks/useConfig'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const rules = ref<FormRules>()
const multipleSelection = ref<UserListItem[]>([])
const selectedUser = ref<OrgBindUserItem[]>([])
const bindUserIds = ref<string[]>([])
const userTableRef = ref<InstanceType<typeof UserTableWithSearch>>()

const route = useRoute()

const form = ref({
  name: '',
  parentName: '',
  unitTypeCode: null as UnitTypeCode
})
const store = useStore()

const id = route.query.id as string

async function getBoundUser() {
  const { code, data } = await getRelationUserByOrg(id)
  if (code === SUCCESS_CODE) {
    selectedUser.value = data
    bindUserIds.value = selectedUser.value.map(item => item.id)
  }
}

onMounted(async () => {
  const orgDetail = await getOrgDetail(id)
  if (orgDetail.code === SUCCESS_CODE) {
    form.value = {
      name: orgDetail.data.name,
      parentName: orgDetail.data.parentName,
      unitTypeCode: orgDetail.data.unitTypeCode
    }
  }

  getBoundUser()
})

function onRemove(index: number, user: OrgBindUserItem) {
  selectedUser.value.splice(index, 1)
  userTableRef.value.setChecked(user.id, false)
  bindUserIds.value = selectedUser.value.map(item => item.id)
  const _index = multipleSelection.value.findIndex(item => item.id === user.id)

  if (_index !== -1) {
    multipleSelection.value.splice(_index, 1)
  }
}

async function onSubmit() {
  const { code } = await relateUser({
    organizationId: id,
    userIds: [...selectedUser.value.map(item => item.id), ...multipleSelection.value.map(item => item.id)]
  })

  if (code === SUCCESS_CODE) {
    ElMessage.success('成功关联用户')
    multipleSelection.value = []
    getBoundUser()
  }
}

const handleSelectionChange = (selected: UserListItem[]) => {
  selected.forEach((user: UserListItem) => {
    if (user && multipleSelection.value.findIndex(item => item.id === user.id) === -1) {
      multipleSelection.value.push({
        ...user
      })
    }
  })
}

function onRemoveSelect(index: number) {
  multipleSelection.value.splice(index, 1)
}

const close = () => {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
</script>

<style scoped lang="less">
:deep(.el-table) {
  td.el-table__cell {
    border: none;
  }

  .el-table__inner-wrapper::before {
    height: 0;
  }
}
</style>
