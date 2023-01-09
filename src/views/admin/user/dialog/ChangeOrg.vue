<template>
  <Main center>
    <template #title> 批量调整组织 </template>
    <template #content>
      <div class="main">
        <BindingPanel class="left">
          <template #title> 已选择的用户 </template>
          <template #label>展示已选择的用户，可以取消关联，保存即生效</template>
          <template #content>
            <el-table
              :border="false"
              :data="users"
              :show-header="false"
              height="600"
            >
              <el-table-column
                label="用户名"
                prop="name"
                align="left"
              />
              <el-table-column
                label="操作"
                width="60"
              >
                <template #default="scope">
                  <el-button
                    class="color-danger"
                    type="text"
                    @click="users.splice(scope.$index, 1)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </BindingPanel>

        <BindingPanel>
          <template #title>需要调整的组织</template>
          <template #label>请选择需要调整的内设机构（不可多选），保存即生效</template>
          <template #content>
            <SearchInput
              v-model="searchKey"
              class="w-100"
              @search="onSearch"
              @clear="syncTreeData"
            />
            <el-tree
              ref="treeRef"
              :check-strictly="true"
              class="tree"
              default-expand-all
              show-checkbox
              :data="treeData"
              node-key="id"
              :filter-node-method="filterNode"
              @check-change="onCheckChange"
            >
              <template #default="{ data }"> {{ data.name }} </template>
            </el-tree>
          </template>
        </BindingPanel>
      </div>
    </template>
    <template #footer>
      <el-button
        type="primary"
        @click="onSubmit()"
      >
        确认
      </el-button>
      <el-button @click="closeCurTab()">取消</el-button>
    </template>
  </Main>
</template>

<script setup lang="tsx">
import { Fragment, onMounted, ref } from 'vue'
import { bindUsersToOrg, DefaultOrgTreeItem, getDefaultOrgTree, SUCCESS_CODE, UserListItem } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchInput from '@/components/input/SearchInput.vue'
import { useStore } from '@/store'
import NoticeImg from '@/assets/icons/notice.png'
import { closeCurTab } from '@/hooks/tabs'

const store = useStore()
const tab = store.state.tabs.activeTab
const selectedUser = (tab.data as UserListItem[]) ?? []
const users = ref([])
const searchKey = ref('')
const targetId = ref('')
const treeData = ref<DefaultOrgTreeItem[]>([])
const treeRef = ref()

async function syncTreeData() {
  const { code, data } = await getDefaultOrgTree(1)
  if (code === SUCCESS_CODE) {
    treeData.value = data
  }
}

onMounted(() => {
  users.value = [...selectedUser]
  searchKey.value = ''
  syncTreeData()
})

function onSubmit() {
  if (users.value.length === 0) {
    return ElMessage.info('没有选择用户，无法进行操作')
  }

  if (!targetId.value) {
    return ElMessage.info('请选择组织')
  }

  ElMessageBox.confirm(
    () => (
      <Fragment>
        <div class="notice-dialog">
          <img src={NoticeImg} />
          <span>调整组织后原先的组织将会被替代，是否确认调整？</span>
        </div>
      </Fragment>
    ),
    {
      showClose: false,
      closeOnClickModal: false
    }
  ).then(async () => {
    const { code } = await bindUsersToOrg({
      ids: users.value.map(item => item.id),
      orgId: targetId.value
    })

    if (code === SUCCESS_CODE) {
      ElMessage.success('成功批量调整组织')
    }
  })
}

function onSearch() {
  treeRef.value?.filter(searchKey.value)
}

const filterNode = (value: string, data: DefaultOrgTreeItem) => {
  if (!value) return true
  return data.name.includes(value)
}

function onCheckChange(node: DefaultOrgTreeItem, checked: boolean) {
  if (checked) {
    treeRef.value.setCheckedKeys([node.id])
    targetId.value = node.id
  }
}
</script>

<style scoped lang="less">
.main {
  display: flex;
  flex-direction: row;
  .left {
    margin-right: 48px;
    :deep(.el-table) {
      td.el-table__cell {
        border: none;
      }
      .el-table__inner-wrapper::before {
        height: 0;
      }
    }
  }
}

.tree {
  margin-top: 12px;
  height: 555px;
  overflow: auto;
}

.color-danger {
  color: var(--el-color-danger);
}
.color-danger:hover {
  color: var(--el-color-danger);
}
</style>

<style lang="less">
.notice-dialog {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
  span {
    font-size: 18px;
    color: #333;
    line-height: 26px;
    font-weight: 600;
  }
}
</style>
