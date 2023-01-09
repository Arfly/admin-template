<template>
  <Main>
    <template #content>
      <TableSearchContainer>
        <template #form>
          <el-row
            class="search-container"
            :gutter="10"
          >
            <el-col :span="4">
              <el-select
                v-model="queryInfo.module"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择功能模块"
                @change="onModuleChange"
              >
                <el-option
                  v-for="item in moduleOpts"
                  :key="item.value"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="queryInfo.type"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择操作类型"
                @change="onTypeChange"
              >
                <el-option
                  v-for="item in typeOpts"
                  :key="item.value"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <TimePicker
                v-model="queryInfo.time"
                class="time-picker"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="queryInfo.user"
                class="search-input"
                placeholder="请输入用户名"
                size="normal"
                clearable
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="queryInfo.id"
                class="search-input"
                placeholder="请输入目标ID"
                size="normal"
                clearable
              />
            </el-col>
          </el-row>
        </template>
        <template #opts>
          <el-button
            type="primary"
            @click="search"
          >
            查询
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </template>
      </TableSearchContainer>
      <el-row class="main-table">
        <TableWithPagination
          ref="tableRef"
          :data="tableData"
          :columns="columns"
          @page-change="getOperationLogData"
        />
      </el-row>
    </template>
  </Main>
  <component
    :is="Component"
    v-if="visible"
    v-model:visible="visible"
    :row-obj="ComponentData"
    @close="visible = false"
  />
</template>

<script lang="tsx" setup>
import { SUCCESS_CODE } from '@/api'
import Main from '@/components/layout/Main.vue'
import { TableColumn } from '@/components/table/table'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { useDialog } from '@/hooks/dialog'
import { onMounted, reactive, ref } from 'vue'
import { getOperationLog, OperationLogListItem } from '../api'
import TimePicker from '../components/TimePicker.vue'
import { typeOpts, moduleOpts } from './constants'
import OptLogDetail from './dialog/OptLogDetail.vue'
const { Component, visible, ComponentData, openDialog } = useDialog()

const tableRef = ref<InstanceType<typeof TableWithPagination>>()
const queryInfo = reactive({
  module: [],
  type: [],
  time: [
    new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1),
    new Date(new Date().setHours(23, 59, 59) - 3600 * 1000 * 24 * 1)
  ],
  user: null,
  id: null
})

const tableData = ref<OperationLogListItem[]>([])
const columns = ref<TableColumn[]>([
  {
    type: 'index',
    label: '序号',
    width: 60
  },
  {
    label: '功能模块名称',
    prop: 'moduleName'
  },
  {
    label: '操作类型',
    prop: 'operateType'
  },
  {
    label: '操作用户',
    prop: 'operateUserName'
  },
  {
    label: '操作时间',
    prop: 'operateTime'
  },
  {
    label: '操作目标',
    prop: 'operateTarget'
  },
  {
    label: '操作',
    customerRender: (row: OperationLogListItem) => (
      <el-button
        type="text"
        onClick={() => openDialog(OptLogDetail, row)}
      >
        查看
      </el-button>
    )
  }
])

function search() {
  tableRef.value.resetPage()
  getOperationLogData()
}

function resetSearch() {
  queryInfo.module = []
  queryInfo.type = []
  queryInfo.time = [
    new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1),
    new Date(new Date().setHours(23, 59, 59) - 3600 * 1000 * 24 * 1)
  ]
  queryInfo.user = null
  queryInfo.id = null
  tableRef.value.resetPage()
  getOperationLogData()
}

async function getOperationLogData() {
  const { code, data } = await getOperationLog({
    moduleId: queryInfo.module.length === moduleOpts.length - 1 ? null : queryInfo.module.join(',') || null,
    ...tableRef.value.page,
    startTime: queryInfo.time ? queryInfo.time[0].toLocaleString() : null,
    endTime: queryInfo.time ? queryInfo.time[1].toLocaleString() : null,
    operateUserName: queryInfo.user,
    operateTypeCode: queryInfo.type.length === typeOpts.length - 1 ? null : queryInfo.type.join(',') || null,
    operateTarget: queryInfo.id
  })

  if (code === SUCCESS_CODE) {
    tableData.value = data.list
    tableRef.value.total = data.total
  }
}

onMounted(() => {
  getOperationLogData()
})

function onModuleChange(val: (string | null)[]) {
  if (val.findIndex(item => item === null) !== -1) {
    queryInfo.module = moduleOpts.filter(item => item.value !== null).map(item => item.value)
  }
}
function onTypeChange(val) {
  if (val.findIndex(item => item === null) !== -1) {
    queryInfo.type = typeOpts.filter(item => item.value !== null).map(item => item.value)
  }
}
</script>

<style scoped lang="less">
:deep(.time-picker) {
  width: calc(100% - 10px - 10px) !important;
}

:deep(.el-select .el-select-tags-wrapper.has-prefix) {
  display: flex;
  overflow: auto;
}
</style>

<style lang="less">
.form:has(.search-container) {
  max-width: 100% !important;
}
</style>
