<template>
  <TableWithPagination
    ref="tableRef"
    :data="data"
    :columns="columns"
    @selection-change="handleSelectionChange"
    @page-change="onPageChange"
  />
  <component
    :is="Component"
    v-if="visible"
    v-model:visible="visible"
    :row-obj="ComponentData"
    @close="visible = false"
    @edit-success="editSuccess"
    @submit="emit('reload')"
  />
</template>

<script setup lang="tsx">
import { SUCCESS_CODE, UserListItem, userSwitch } from '@/api'
import { TableColumn } from '@/components/table/table'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { useDialog } from '@/hooks/dialog'
import { useFilter } from '@/hooks/filter'
import { activeTab } from '@/hooks/tabs'
import { SOURCE_TYPE } from '@/hooks/useConfig'
import { ElMessage } from 'element-plus'
import { Fragment, ref } from 'vue'
import ResetPwd from '../dialog/ResetPwd.vue'
import ViewUser from '../dialog/ViewUser.vue'

const { Component, ComponentData, openDialog, visible, editSuccess } = useDialog(ViewUser, () => {
  emit('reload')
})

const { Stuff } = useFilter()
const columns = ref<TableColumn[]>([
  {
    type: 'selection',
    width: 50,
    attr: {
      align: 'center'
    }
  },
  {
    label: '序号',
    type: 'index',
    width: 56,
    attr: {
      align: 'center'
    }
  },
  {
    label: '用户名',
    prop: 'name'
  },
  {
    label: '姓名',
    prop: 'realName'
  },
  {
    label: '所属组织',
    prop: 'organizationName'
  },
  {
    label: '上级组织',
    prop: 'parentOrganizationName'
  },
  {
    label: '用户来源',
    width: 170,
    customerRender: row => <span>{Stuff.value(SOURCE_TYPE[row.source])}</span>
  },
  {
    label: '状态',
    prop: 'status',
    width: 112,
    customerRender: row => (
      <el-switch
        v-model={row.status}
        width="60px"
        size="large"
        activeValue={1}
        inactiveValue={0}
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
    width: 400,
    customerRender: row => (
      <Fragment>
        <el-button
          link
          type="primary"
          onClick={() => {
            activeTab('ViewUser', {
              id: row.id
            })
          }}
        >
          查看
        </el-button>
        {row.source === SOURCE_TYPE['内部新增'] ? (
          <el-button
            link
            type="primary"
            onClick={() => {
              activeTab('EditUser', {
                id: row.id
              })
            }}
          >
            编辑
          </el-button>
        ) : null}
        <el-button
          link
          type="primary"
          onClick={() => {
            activeTab('BindPost', {
              id: row.id,
              name: row.name,
              realName: row.realName
            })
          }}
        >
          关联岗位
        </el-button>
        {row.source === SOURCE_TYPE['内部新增'] ? (
          <el-button
            link
            type="primary"
            onClick={() => {
              activeTab('BindOrg', {
                id: row.id,
                name: row.name,
                realName: row.realName
              })
            }}
          >
            关联组织
          </el-button>
        ) : null}
        {row.source === SOURCE_TYPE['内部新增'] ? (
          <el-button
            link
            type="primary"
            onClick={() => openDialog(ResetPwd, row)}
          >
            重置密码
          </el-button>
        ) : null}
      </Fragment>
    )
  }
])

const tableRef = ref<InstanceType<typeof TableWithPagination>>()

defineProps<{
  data: UserListItem[]
}>()

const emit = defineEmits(['selection-change', 'reload', 'pageChange'])

function handleSelectionChange(selection: UserListItem[]) {
  emit('selection-change', selection)
}

const userStateChanged = async row => {
  const { code } = await userSwitch({
    userId: row.id,
    status: row.status
  })

  if (code === SUCCESS_CODE) {
    // eslint-disable-next-line new-cap
    ElMessage({
      type: 'success',
      message: `用户已成功${row.status ? '启用' : '停用'}`
    })
  }
}

function onPageChange() {
  emit('pageChange')
}

defineExpose({
  getPage: () => tableRef.value.page,
  setTotal: total => {
    tableRef.value.total = total
  },
  resetPage: () => {
    tableRef.value.resetPage()
  }
})
</script>
