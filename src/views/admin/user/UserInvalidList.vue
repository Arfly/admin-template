<template>
  <TabsContent
    :show-header="false"
    :type="'div'"
  >
    <template #content>
      <TableSearch
        @reset="reset"
        @search="onSearch"
      />
      <TableWithOpts>
        <template #opts>
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
            @reload="reload"
            @page-change="handlePageChange"
            @selection-change="handleSelectionChange"
          />
        </template>
      </TableWithOpts>
    </template>
  </TabsContent>
</template>

<script setup lang="ts">
import { getUserList, SUCCESS_CODE, UserListItem } from '@/api'
import TabsContent from '@/components/layout/TabsContent.vue'
import TableWithOpts from '@/components/table/TableWithOpts.vue'
import { activeTab, CustomQuery } from '@/hooks/tabs'
import { ElMessage } from 'element-plus'
import { ComputedRef, inject, ref, watch } from 'vue'
import TableSearch from './form/TableSearch.vue'
import UserTable from './table/UserTable.vue'

const userTab = inject<ComputedRef<number>>('userTab')
const queryInfo = ref({ keyword: '', status: '', source: '' })
const tableRef = ref()
const organizationId = ref('')
const tableData = ref<UserListItem[]>([])
const selectedUser = ref<UserListItem[]>([])

async function getTableData() {
  const { code, data } = await getUserList({
    ...tableRef.value.getPage(),
    ...queryInfo.value,
    organizationId: organizationId.value,
    orgRelDisable: 1
  })

  if (code === SUCCESS_CODE) {
    tableData.value = data.list
    tableRef.value.setTotal(data.total)
  }
}

function onSearch(queryParams) {
  queryInfo.value = queryParams
  tableRef.value.resetPage()
  getTableData()
}

function reset(queryParams) {
  queryInfo.value = queryParams
  tableRef.value.resetPage()
  getTableData()
}

function handleSelectionChange(selection) {
  selectedUser.value = selection
}

function reload() {
  tableRef.value.resetPage()
  getTableData()
}

function handlePageChange() {
  getTableData()
}
watch(
  () => userTab,
  () => {
    if (userTab.value === 1) {
      getTableData()
    }
  },
  {
    deep: true
  }
)

const changeOrgByGroup = () => {
  if (selectedUser.value.length > 0) {
    activeTab('ChangeOrg', {
      data: [...selectedUser.value]
    } as CustomQuery)
  } else {
    ElMessage.info('请选择用户')
  }
}
</script>
