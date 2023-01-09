<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        label-width="100px"
      >
        <el-form-item
          label="岗位名称"
          prop="name"
        >
          <el-input
            :value="positionName"
            disabled
          />
        </el-form-item>

        <el-form-item
          label="岗位编码"
          prop="id"
        >
          <el-input
            :value="id"
            placeholder="系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>

        <el-divider />

        <el-form-item
          label="关联用户"
          prop="name"
          style="padding-left: 15px; padding-right: 15px"
        >
          <BindingPanel>
            <template #title> 需要关联的用户 </template>
            <template #label> 可以选择需要关联的用户（可多选），保存即生效 </template>
            <template #content>
              <UserTableWithSearch
                ref="userTableRef"
                :selected="multipleSelection"
                :bind-user-ids="bindUserIds"
                @selection-change="handleSelectionChange"
                @remove-select="onRemoveSelect"
              />
            </template>
          </BindingPanel>

          <DialogCard>
            <template #title>已关联的用户</template>
            <template #label>删除已关联的用户，保存后即可取消关联</template>
            <template #content>
              <BindUserTable
                :data="userPowerData"
                @delete="deleteResource"
              />
            </template>
          </DialogCard>
        </el-form-item>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确 定
        </el-button>
        <el-button @click="dialogClosed">取 消</el-button>
      </span>
    </template>
  </Main>
</template>
<script setup lang="ts">
import { SUCCESS_CODE, bindPostUser, postUserDetail, UserListItem, PostBindUserListItem } from '@/api'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import UserTableWithSearch from '../../../components/table/UserTableWithSearch.vue'
import BindUserTable from '@/views/components/table/BindUserTable.vue'
import DialogCard from '@/views/components/card/DialogCard.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const route = useRoute()
const { id, positionName } = route.query as {
  id: string
  positionName: string
}
const store = useStore()
const userPowerData = ref<PostBindUserListItem[]>([])
const bindUserIds = ref<string[]>([])
const userTableRef = ref()
const multipleSelection = ref<UserListItem[]>([])

const getPostBoundUser = async () => {
  const { code, data } = await postUserDetail(id)

  if (code === SUCCESS_CODE) {
    userPowerData.value = data
    bindUserIds.value = userPowerData.value.map(item => item.id)
  }
}

const dialogClosed = () => {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}

onMounted(() => {
  if (id) {
    getPostBoundUser()
  }
  nextTick(() => {
    multipleSelection.value = []
  })
})

const deleteResource = (index: number, row: PostBindUserListItem) => {
  userPowerData.value.splice(index, 1)
  userTableRef.value.setChecked(row.id, false)
  const _index = multipleSelection.value.findIndex(item => item.id === row.id)
  if (_index !== -1) {
    multipleSelection.value.splice(_index, 1)
  }
  bindUserIds.value = userPowerData.value.map(item => item.id)
}
const onSubmit = async () => {
  const userIds = []
  multipleSelection.value.forEach(row => {
    if (!row) return
    userIds.push(row.id)
  })

  userPowerData.value.forEach(item => {
    userIds.push(item.id)
  })

  const { code } = await bindPostUser({ positionId: id, userIds })

  if (code === SUCCESS_CODE) {
    ElMessage.success('绑定用户已成功变更')
    getPostBoundUser()
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
</script>
