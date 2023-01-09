<template>
  <TabsContent
    :show-header="false"
    :type="'div'"
  >
    <template #aside>
      <Tree
        ref="treeRef"
        @node-click="onTreeNodeClick"
        @loaded="onTreeDataLoaded"
      />
    </template>
    <template #content>
      <TableSearch
        @reset="onSearch"
        @search="onSearch"
      />
      <TableWithOpts>
        <template #opts>
          <el-button
            type="text"
            size="default"
            @click="createUser()"
          >
            <img src="@/assets/icons/icon-add-circle.png" />新增用户
          </el-button>
          <el-button
            type="text"
            size="default"
            @click="changeOrgByGroup()"
          >
            <img src="@/assets/icons/icon-adjustment.png" />批量调整组织
          </el-button>
        </template>
        <template #table>
          <UserTable
            ref="tableRef"
            :data="tableData"
            @page-change="getTableList()"
            @reload="load"
            @selection-change="handleSelectionChange"
          />
        </template>
      </TableWithOpts>
    </template>
  </TabsContent>
</template>

<script setup lang="tsx">
import { getUserList, SUCCESS_CODE, UserListItem } from '@/api'
import TabsContent from '@/components/layout/TabsContent.vue'
import TableWithOpts from '@/components/table/TableWithOpts.vue'
import Tree from '@/views/components/Tree.vue'
import { ComputedRef, inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TableSearch from './form/TableSearch.vue'
import UserTable from './table/UserTable.vue'
import { activeTab, CustomQuery } from '@/hooks/tabs'
import { ElMessage } from 'element-plus'

const tableRef = ref<InstanceType<typeof UserTable>>()
const tableData = ref<UserListItem[]>([])
const userTab = inject<ComputedRef<number>>('userTab')

const route = useRoute()
const organizationId = ref('')
const treeRef = ref<InstanceType<typeof Tree>>()

const queryInfo = ref({ keyword: '', status: null, source: null })
const selectedUser = ref<UserListItem[]>([])

async function getTableList() {
  const { code, data } = await getUserList({
    ...tableRef.value.getPage(),
    ...queryInfo.value,
    organizationId: organizationId.value
  })

  if (code === SUCCESS_CODE) {
    tableData.value = data.list
    tableRef.value.setTotal(data.total)
  }
}

/**
 * 组织树加载完成后触发
 * @param orgId
 */
function onTreeDataLoaded(orgId: string) {
  organizationId.value = route.query.organizationID ? (route.query.organizationID as string) : orgId
}

watch(
  organizationId,
  () => {
    tableRef.value.resetPage()
    getTableList()
  },
  { immediate: false }
)

onMounted(() => {
  if (organizationId.value) {
    tableRef.value.resetPage()
    getTableList()
  }
})

/**
 * 重新加载组织树、清空选择的组织、重新加载表格列表
 */
function load() {
  tableRef.value.resetPage()
  organizationId.value = ''
  treeRef.value.loadTree()
}

/**
 * 搜索
 * @param queryParams
 */
function onSearch(queryParams) {
  queryInfo.value = queryParams
  tableRef.value.resetPage()
  getTableList()
}

/**
 * 点击组织树上的节点
 * @param orgId
 */
function onTreeNodeClick(orgId: string) {
  organizationId.value = orgId
}

/**
 * 批量调整用户
 * @param selection 批量选择的用户
 */
function handleSelectionChange(selection: UserListItem[]) {
  selectedUser.value = selection
}

const changeOrgByGroup = () => {
  if (selectedUser.value.length > 0) {
    activeTab('ChangeOrg', {
      data: [...selectedUser.value]
    } as CustomQuery)
  } else {
    ElMessage.info('请选择用户')
  }
}

const createUser = () => {
  activeTab('CreateUser')
}

watch(
  () => userTab,
  () => {
    if (userTab.value === 0) {
      if (organizationId.value) {
        tableRef.value.resetPage()
        getTableList()
      }
    }
  },
  {
    deep: true
  }
)
</script>
