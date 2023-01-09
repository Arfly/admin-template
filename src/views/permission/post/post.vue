<template>
  <div>
    <Main>
      <template #content>
        <el-tabs
          v-model="activeKey"
          class="tabs-container"
          style="font-size: 16px"
        >
          <el-tab-pane
            label="岗位管理"
            :name="TAB_STATE['VALID']"
          >
            <TabsContent type="div">
              <template #aside>
                <Tree
                  ref="treeRef"
                  @node-click="onTreeNodeClick"
                  @loaded="onTreeDataLoaded"
                />
              </template>
              <template #content>
                <TableSearchContainer>
                  <template #form>
                    <el-row
                      justify="space-between"
                      :gutter="18"
                    >
                      <el-col
                        :span="12"
                        style="width: 320px"
                      >
                        <el-input
                          v-model="queryInfo.positionName"
                          clearable
                          placeholder="请输入岗位名称..."
                        />
                      </el-col>
                    </el-row>
                  </template>
                  <template #opts>
                    <el-button
                      :icon="Search"
                      type="primary"
                      @click="search"
                    >
                      查询
                    </el-button>
                    <el-button
                      :icon="RefreshLeft"
                      @click="resetFrom"
                    >
                      重置
                    </el-button>
                  </template>
                </TableSearchContainer>
                <TableWithOpts>
                  <template
                    v-if="activeKey === TAB_STATE['VALID']"
                    #opts
                  >
                    <el-button
                      type="text"
                      @click="activeTab('CreatePost')"
                    >
                      <img src="@/assets/icons/icon-add-circle.png" />新增岗位
                    </el-button>
                  </template>
                  <template #table>
                    <TableWithPagination
                      ref="tableRef"
                      :data="postData"
                      :columns="columns"
                      @page-change="getPostList"
                    />
                  </template>
                </TableWithOpts>
              </template>
            </TabsContent>
          </el-tab-pane>
          <el-tab-pane
            class="tab"
            label="组织失效岗位"
            :name="TAB_STATE['INVALID']"
          >
            <TabsContent>
              <template #content>
                <TableSearchContainer>
                  <template #form>
                    <el-row
                      :gutter="18"
                      justify="space-between"
                    >
                      <el-col
                        :span="12"
                        style="width: 320px"
                      >
                        <el-input
                          v-model="queryInfo.positionName"
                          clearable
                          placeholder="请输入岗位名称..."
                        />
                      </el-col>
                    </el-row>
                  </template>
                  <template #opts>
                    <el-button
                      :icon="Search"
                      type="primary"
                      @click="search"
                    >
                      查询
                    </el-button>
                    <el-button
                      :icon="RefreshLeft"
                      @click="resetFrom"
                    >
                      重置
                    </el-button>
                  </template>
                </TableSearchContainer>
                <TableWithOpts>
                  <template
                    v-if="activeKey === TAB_STATE['VALID']"
                    #opts
                  >
                    <el-button
                      type="text"
                      @click="activeTab('CreatePost')"
                    >
                      <img src="@/assets/icons/icon-add-circle.png" />新增岗位
                    </el-button>
                  </template>
                  <template #table>
                    <TableWithPagination
                      ref="tableValidRef"
                      key="invalid"
                      :data="postData"
                      :columns="columns"
                      @page-change="getPostList"
                    />
                  </template>
                </TableWithOpts>
              </template>
            </TabsContent>
          </el-tab-pane>
        </el-tabs>
      </template>
    </Main>
  </div>
</template>

<script lang="tsx" setup>
import { getUnorganizedPost, postList, PostListItem, postSwitch, SUCCESS_CODE, UnOrgPostListItem } from '@/api'
import Main from '@/components/layout/Main.vue'
import TabsContent from '@/components/layout/TabsContent.vue'
import { TableColumn } from '@/components/table/table'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithOpts from '@/components/table/TableWithOpts.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { ElMessage } from 'element-plus'
import { Fragment, reactive, ref, watch, nextTick } from 'vue'
import Tree from '../../components/Tree.vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { activeTab } from '@/hooks/tabs'
enum TAB_STATE {
  VALID = 1,
  INVALID
}

const queryInfo = reactive({ positionName: '' })
const activeKey = ref(TAB_STATE.VALID)
// ------左侧树-------
const organizationId = ref('')
const treeRef = ref<InstanceType<typeof Tree>>()
const tableValidRef = ref<InstanceType<typeof TableWithPagination>>()
const tableRef = ref<InstanceType<typeof TableWithPagination>>()

const columns = ref<TableColumn[]>([
  {
    type: 'index',
    label: '序号',
    width: 60
  },
  {
    label: '岗位名称',
    width: 210,
    prop: 'positionName'
  },
  {
    label: '所属组织',
    width: 210,
    prop: 'organizationName'
  },
  {
    label: '备注',
    prop: 'desc'
  },
  {
    label: '启用状态',
    width: 100,
    customerRender: row => (
      <el-switch
        v-model={row.status}
        width="60px"
        size="large"
        active-value={1}
        inactive-value={0}
        inline-prompt
        style="--el-switch-on-color: #1177ee; --el-switch-off-color: #dddddd"
        active-text="启用"
        inactive-text="停用"
        onChange={() => userStateChanged(row)}
      />
    )
  },
  {
    label: '操作',
    width: 280,
    customerRender: row => (
      <Fragment>
        <el-button
          link
          type="primary"
          onClick={() =>
            activeTab('ViewPost', {
              id: row.id
            })
          }
        >
          查看
        </el-button>
        <el-button
          link
          type="primary"
          onClick={() =>
            activeTab('EditPost', {
              id: row.id
            })
          }
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          onClick={() =>
            activeTab('BindRoleToPost', {
              id: row.id
            })
          }
        >
          关联角色
        </el-button>
        <el-button
          link
          type="primary"
          onClick={() =>
            activeTab('BindUserToPost', {
              id: row.id
            })
          }
        >
          关联用户
        </el-button>
      </Fragment>
    )
  }
])

// ------资源列表相关------
const postData = ref<(PostListItem | UnOrgPostListItem)[]>([])
const getPostList = async () => {
  if (activeKey.value === TAB_STATE.VALID && organizationId.value) {
    const { code, data } = await postList({
      ...queryInfo,
      ...tableRef.value.page,
      organizationId: organizationId.value
    })

    if (code === SUCCESS_CODE) {
      tableRef.value.total = data.total
      postData.value = data.list
    }
  }

  if (activeKey.value === TAB_STATE.INVALID) {
    const { code, data } = await getUnorganizedPost({
      ...tableValidRef.value.page,
      ...queryInfo
    })

    if (code === SUCCESS_CODE) {
      postData.value = data.list
      tableValidRef.value.total = data.total
    }
  }
}
function resetTablePage() {
  tableRef.value.resetPage()
  tableValidRef.value.resetPage()
}

const resetFrom = () => {
  queryInfo.positionName = ''
  resetTablePage()
  getPostList()
}
// ------切换状态------
const userStateChanged = row => {
  postSwitch({ positionId: row.id, targetStatus: row.status }).then(res => {
    if (res.code === SUCCESS_CODE) {
      // eslint-disable-next-line new-cap
      ElMessage({
        type: 'success',
        message: `岗位已成功${row.status ? '启用' : '停用'}`
      })
    }
  })
}

watch(
  () => activeKey.value,
  async () => {
    nextTick(() => {
      resetFrom()
    })
  },
  {
    immediate: true
  }
)

watch(
  organizationId,
  () => {
    if (organizationId.value) {
      resetTablePage()
      getPostList()
    }
  },
  { immediate: true }
)

function onTreeNodeClick(orgId: string) {
  organizationId.value = orgId
}

function onTreeDataLoaded(orgId: string) {
  organizationId.value = orgId
}

function search() {
  resetTablePage()
  getPostList()
}
</script>

<style scoped lang="less">
.tab {
  height: calc(100vh - 320px);
}

.tabs-container {
  height: 100%;

  :deep(.el-tabs__content) {
    height: calc(100% - 40px - 24px);
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
