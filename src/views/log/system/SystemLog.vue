<template>
  <Main>
    <template #title>系统日志管理</template>
    <template #content>
      <TableSearchContainer>
        <template #form>
          <el-form
            ref="formRef"
            :model="queryInfo"
            label-width="0px"
            :rules="formRule"
          >
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item prop="time">
                  <TimePicker v-model="queryInfo.time" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="level">
                  <el-select
                    v-model="queryInfo.level"
                    clearable
                    filterable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    placeholder="请选择日志等级"
                    @keyup.enter.exact="getDataList"
                    @change="onChangeLevel"
                  >
                    <el-option
                      v-for="item in levelOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="thread">
                  <el-input
                    v-model="queryInfo.thread"
                    placeholder="请输入线程名称"
                    clearable
                    @keyup.enter.exact="getDataList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="logger">
                  <el-input
                    v-model="queryInfo.logger"
                    placeholder="请输入logger名称"
                    clearable
                    @keyup.enter.exact="getDataList"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="info">
                  <el-input
                    v-model="queryInfo.info"
                    placeholder="请输入内容关键词"
                    clearable
                    @keyup.enter.exact="getDataList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
        <template #opts>
          <el-button
            type="primary"
            @click="getDataList"
          >
            查询
          </el-button>
          <el-button @click="onReset">重置</el-button>
        </template>
      </TableSearchContainer>
      <el-row class="main-table">
        <TableWithPagination
          ref="sysLogTable"
          :header-cell-style="{ 'background-color': '#F1F2F6' }"
          :default-sort="{ prop: 'time', order: 'descending' }"
          :data="tableData"
          style="width: 100%"
          :columns="columns"
          @sort-change="colChange"
          @page-change="getDataList"
        />
      </el-row>
      <ViewSystemLog ref="viewSystemLogRef" />
    </template>
  </Main>
</template>

<script lang="tsx" setup>
import Main from '@/components/layout/Main.vue'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import ViewSystemLog from './dialog/ViewSystemLog.vue'
import TimePicker from '../components/TimePicker.vue'
import EllipsisText from '../components/EllipsisText.vue'

import { ref, reactive, onMounted } from 'vue'
import { FormInstance } from 'element-plus'
import { useFilter } from '@/hooks/filter'
import { SUCCESS_CODE } from '@/api'
import { getSystemList } from '../api'
import { TIME_RANGE_VALIDATOR } from '../common/validator'
import { TableColumn } from '@/components/table/table'
const formRef = ref<FormInstance>()
const { Stuff } = useFilter()
const sysLogTable = ref()
const viewSystemLogRef = ref<InstanceType<typeof ViewSystemLog>>()
const formRule = reactive(TIME_RANGE_VALIDATOR)

const levelOpts = ref([
  {
    label: '全部',
    value: null
  },
  {
    label: 'DEBUG',
    value: 'DEBUG'
  },
  {
    label: 'INFO',
    value: 'INFO'
  },
  {
    label: 'WARNING',
    value: 'WARNING'
  },
  {
    label: 'ERROR',
    value: 'ERROR'
  },
  {
    label: 'CRITICAL',
    value: 'CRITICAL'
  }
])

const queryInfo = ref({
  thread: null,
  logger: null,
  info: null,
  level: [null],
  time: [
    new Date(new Date().setHours(0, 0, 0, 0) - 3600 * 1000 * 24 * 1),
    new Date(new Date().setHours(23, 59, 59) - 3600 * 1000 * 24 * 1)
  ]
})

const tableSort = ref({
  sort: 0
})

const SORT_TYPE = {
  descending: 0,
  ascending: 1
}

const columns = ref<TableColumn[]>([
  {
    type: 'index',
    label: '序号',
    width: 80
  },
  {
    label: '请求地址',
    prop: 'ip',
    width: 160,
    customerRender: row => <span>{Stuff.value(row.ip)}</span>
  },
  {
    label: '时间',
    prop: 'logTime',
    attr: {
      sortable: 'custom',
      sortOrders: ['ascending', 'descending']
    },
    width: 180,
    customerRender: row => <span>{Stuff.value(row.logTime)}</span>
  },
  {
    label: '日志等级',
    prop: 'level',
    width: 120
  },
  {
    label: '线程名称',
    prop: 'thread',
    width: 200,
    customerRender: row => <span>{Stuff.value(row.thread)}</span>
  },
  {
    label: 'logger名称',
    prop: 'logger',
    width: 200,
    customerRender: row => <span>{Stuff.value(row.logger)}</span>
  },
  {
    label: '日志内容',
    prop: 'info',
    attr: {
      minWidth: 200,
      showOverflowTooltip: false
    },
    customerRender: row => <EllipsisText item={row} />
  },
  {
    label: '操作',
    width: 100,
    customerRender: row => (
      <el-button
        type="text"
        onClick={() => openInfo(row)}
      >
        查看
      </el-button>
    )
  }
])

const tableData = ref([])

const colChange = ({ column, order }) => {
  tableSort.value.sort = SORT_TYPE[order]
  if (column) {
    getDataList()
  }
}

const getDataList = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      const [startTime, endTime] = queryInfo.value.time || []
      const params = {
        ...sysLogTable.value.page,
        ...queryInfo.value,
        ...tableSort.value,
        startTime: startTime || null,
        endTime: endTime || null
      }
      delete params.time
      const { code, data } = await getSystemList(params)
      if (code === SUCCESS_CODE) {
        tableData.value = data.list
      }
    }
  })
}

const onChangeLevel = val => {
  if (val.includes(null)) {
    queryInfo.value.level = [null]
  }
}

const onReset = () => {
  formRef.value.resetFields()
}

const openInfo = row => {
  viewSystemLogRef.value.dialogOpen(row)
}
// 初始化数据
onMounted(() => {
  getDataList()
})
</script>

<style lang="less" scoped>
@import url('@/assets/styles/common.less');

:deep(.is-justify-space-between > .form) {
  max-width: none !important;
}

:deep(td.el-table__cell) {
  .cell {
    height: auto;
    line-height: 22px;
  }
}
</style>
