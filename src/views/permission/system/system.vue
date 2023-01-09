<template>
  <div>
    <Main>
      <template #content>
        <TableSearchContainer>
          <template #form>
            <el-row
              justify="space-between"
              :gutter="18"
              class="from--search"
            >
              <el-col>
                <el-input
                  v-model="queryInfo.name"
                  clearable
                  style="width: 300px"
                  placeholder="请输入系统名称..."
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
              @click="resetSearch"
            >
              重置
            </el-button>
          </template>
        </TableSearchContainer>

        <TableWithOpts>
          <template #opts>
            <el-button
              type="text"
              @click="openDialog(EditSystem)"
            >
              <img src="@/assets/icons/icon-add-circle.png" />新增系统
            </el-button>
          </template>

          <template #table>
            <TableWithPagination
              ref="tableRef"
              :data="systemData"
              :columns="columns"
              @page-change="getSystemList"
            />
          </template>
        </TableWithOpts>
      </template>
    </Main>
    <component
      :is="Component"
      v-if="visible"
      v-model:visible="visible"
      :row-obj="ComponentData"
      @close="visible = false"
      @edit-success="editSuccess"
    />
  </div>
</template>

<script lang="tsx" setup>
import { SUCCESS_CODE, systemList, SystemListItem, systemSwitch } from '@/api'
import Main from '@/components/layout/Main.vue'
import { TableColumn } from '@/components/table/table'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithOpts from '@/components/table/TableWithOpts.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { useDialog } from '@/hooks/dialog'
import { ElButton, ElMessage, ElSwitch } from 'element-plus'
import { Fragment, onMounted, reactive, ref } from 'vue'
import EditSystem from './dialog/EditSystem.vue'
import ViewSystem from './dialog/ViewSystem.vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
const columns = ref<TableColumn[]>([
  {
    label: '序号',
    type: 'index',
    width: 60
  },
  {
    label: '系统名称',
    prop: 'name',
    width: 300
  },
  {
    label: '系统编码',
    prop: 'contactCode',
    width: 210
  },
  {
    label: '归属单位',
    prop: 'unitBelong',
    width: 300
  },
  {
    label: '备注',
    prop: 'desc'
  },
  {
    label: '启用状态',
    width: 120,
    customerRender: row => (
      <ElSwitch
        v-model={row.status}
        width="60px"
        size="large"
        activeValue={1}
        inactiveValue={0}
        inline-prompt
        style="--el-switch-on-color: #1177ee; --el-switch-off-color: #dddddd"
        activeText="启用"
        inactiveText="停用"
        onChange={() => switchStatus(row)}
      />
    )
  },
  {
    label: '操作',
    width: 200,
    customerRender: row => (
      <Fragment>
        <ElButton
          link
          type="primary"
          onClick={() => openDialog(ViewSystem, row)}
        >
          查看
        </ElButton>
        <el-button
          link
          type="primary"
          onClick={() => openDialog(EditSystem, row)}
        >
          编辑
        </el-button>
      </Fragment>
    )
  }
])
const tableRef = ref<InstanceType<typeof TableWithPagination>>()
const queryInfo = reactive({ name: '' })
const systemData = ref<SystemListItem[]>([])

/**
 * 获取系统列表数据
 */
async function getSystemList() {
  const { code, data } = await systemList({
    ...tableRef.value.page,
    ...queryInfo
  })

  if (code === SUCCESS_CODE) {
    tableRef.value.total = data.total
    systemData.value = data.list
  }
}

const { visible, Component, ComponentData, openDialog, editSuccess } = useDialog(ViewSystem, getSystemList)

/**
 * 切换数据激活状态
 * @param row 表格数据项
 */
async function switchStatus(row: SystemListItem) {
  const { code } = await systemSwitch({ id: row.id, command: row.status })
  if (code === SUCCESS_CODE) {
    // eslint-disable-next-line new-cap
    ElMessage({
      type: 'success',
      message: `系统已成功${row.status ? '启用' : '停用'}`
    })
  }
}

/**
 * 搜索
 */
function search() {
  tableRef.value.resetPage()
  getSystemList()
}

/**
 * 重置搜索
 */
function resetSearch() {
  queryInfo.name = ''
  tableRef.value.resetPage()
  getSystemList()
}

onMounted(() => {
  getSystemList()
})
</script>
