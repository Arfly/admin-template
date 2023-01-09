<template>
  <div>
    <Main>
      <template #aside>
        <Tree
          ref="treeRef"
          :options="['add', 'view']"
          @operation="handleTreeOperation"
          @node-click="onTreeNodeClick"
          @loaded="onTreeDataLoaded"
          @no-data="onSearchNoData"
        />
      </template>

      <template #content>
        <ContentPart>
          <template #search>
            <TableSearchContainer>
              <template #form>
                <div class="from-search">
                  <el-select
                    v-model="queryInfo.unitTypeCode"
                    class="item"
                    style="width: 100%"
                    placeholder="请选择组织类型"
                    clearable
                  >
                    <el-option
                      v-for="item in UNIT_TYPE_LIST.concat([{ key: 1, value: '全部' }])"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>

                  <el-select
                    v-model="queryInfo.level"
                    class="item"
                    style="width: 100%"
                    placeholder="请输入组织层级"
                    clearable
                  >
                    <el-option
                      v-for="item in LEVELS"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>

                  <el-select
                    v-model="queryInfo.source"
                    class="item"
                    style="width: 100%"
                    placeholder="请选择组织来源"
                    clearable
                  >
                    <el-option
                      v-for="item in USER_SOURCE_LIST.filter(item => item.key != SOURCE_TYPE['来源2'])"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </div>
              </template>
              <template #opts>
                <el-button
                  :icon="Search"
                  type="primary"
                  @click="onSearch"
                >
                  查询
                </el-button>
                <el-button
                  :icon="RefreshLeft"
                  @click="reset"
                >
                  重置
                </el-button>
              </template>
            </TableSearchContainer>
          </template>
          <template #table>
            <el-row class="main-table">
              <TableWithPagination
                ref="tableRef"
                :data="tableData"
                :columns="columns"
                @page-change="getTableList"
              />
            </el-row>
          </template>
        </ContentPart>
      </template>
    </Main>
  </div>
</template>

<script lang="tsx" setup>
import { changeOrgStatus, DefaultOrgTreeItem, deleteOrg, getOrgList, OrgListItem, SUCCESS_CODE } from '@/api'
import { getTreeParentPath } from '@/common/utils'
import ContentPart from '@/components/layout/ContentPart.vue'
import Main from '@/components/layout/Main.vue'
import { TableColumn } from '@/components/table/table'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { useFilter } from '@/hooks/filter'
import { UNIT_TYPE, UNIT_TYPE_LIST, SOURCE_TYPE, USER_SOURCE_LIST } from '@/hooks/useConfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, Fragment, ref, watch } from 'vue'
import Tree from '../../components/Tree.vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { activeTab } from '@/hooks/tabs'
const { Stuff } = useFilter()

const tableRef = ref<InstanceType<typeof TableWithPagination>>()
const columns = ref<TableColumn[]>([
  {
    label: '序号',
    type: 'index',
    width: 60
  },
  {
    label: '组织代码',
    prop: 'code'
  },
  {
    label: '组织名称',
    prop: 'name'
  },
  {
    label: '组织类型',
    customerRender: (row: OrgListItem) => <span>{Stuff.value(UNIT_TYPE[row.unitTypeCode])}</span>
  },
  {
    label: '上级组织',
    prop: 'parentName'
  },
  {
    label: '组织层级',
    prop: 'level'
  },
  {
    label: '组织来源',
    customerRender: row => <span>{Stuff.value(SOURCE_TYPE[row.source])}</span>
  },
  {
    label: '备注',
    prop: 'description'
  },
  {
    label: '状态',
    customerRender: row => (
      <el-switch
        v-model={row.active}
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
    width: 200,
    customerRender: row => (
      <Fragment>
        <el-button
          link
          type="primary"
          onClick={() =>
            activeTab('BindUser', {
              id: row.id
            })
          }
        >
          关联用户
        </el-button>
        {row.source === SOURCE_TYPE['内部新增'] ? (
          <Fragment>
            <el-button
              link
              type="primary"
              onClick={() =>
                activeTab('EditOrg', {
                  id: row.id
                })
              }
            >
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              onClick={() => onDelete(row)}
            >
              删除
            </el-button>
          </Fragment>
        ) : null}
      </Fragment>
    )
  }
])

const LEVELS = computed(() => {
  const arr = []
  if (treeRef.value) {
    arr.push({
      key: 0,
      value: '全部'
    })
    for (let i = 0; i < treeRef.value.treeDeep; i++) {
      arr.push({
        key: i + 1,
        value: `${i + 1}`
      })
    }
  }
  return arr
})

const organizationId = ref('')
const treeRef = ref()

const queryInfo = ref({
  level: null,
  unitTypeCode: null,
  source: null
})
const tableData = ref<OrgListItem[]>([])

function reset() {
  queryInfo.value = {
    level: null,
    unitTypeCode: null,
    source: null
  }
  tableRef.value.resetPage()
  getTableList()
}

async function getTableList() {
  const { code, data } = await getOrgList({
    ...tableRef.value.page,
    id: organizationId.value,
    level: queryInfo.value.level === 0 ? null : queryInfo.value.level,
    unitTypeCode: queryInfo.value.unitTypeCode === 1 ? null : queryInfo.value.unitTypeCode,
    source: queryInfo.value.source === 3 ? null : queryInfo.value.source
  })

  if (code === SUCCESS_CODE) {
    tableData.value = data.list
    tableRef.value.total = data.total
  }
}

function onDelete(org) {
  ElMessageBox.confirm('是否确认删除该组织?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { code } = await deleteOrg(org.id)
    if (code === SUCCESS_CODE) {
      organizationId.value = ''
      tableRef.value.resetPage()
      treeRef.value.loadTree()
      ElMessage.success('成功删除组织')
    }
  })
}

function onSearch() {
  tableRef.value.resetPage()
  getTableList()
}

function userStateChanged(row: OrgListItem) {
  const target = row.active

  changeOrgStatus({
    id: row.id,
    targetStatus: target
  })
    .then(res => {
      if (res.code === SUCCESS_CODE) {
        // eslint-disable-next-line no-param-reassign
        row.active = target
        // eslint-disable-next-line new-cap
        ElMessage({
          type: 'success',
          message: `组织已成功${row.active ? '启用' : '停用'}`
        })
      } else {
        console.log(row.active)
        // eslint-disable-next-line no-param-reassign
        row.active = row.active === 0 ? 1 : 0
      }
    })
    .catch(() => {
      // eslint-disable-next-line no-param-reassign
      row.active = row.active === 0 ? 1 : 0
    })
}

watch(
  organizationId,
  () => {
    if (organizationId.value) {
      tableRef.value.resetPage()
      getTableList()
    }
  },
  { immediate: true }
)

function handleTreeOperation(operationName: string, data: DefaultOrgTreeItem) {
  switch (operationName) {
    case treeRef.value.OPERATIONS.ADD: {
      const { ids, path } = getTreeParentPath(data)

      activeTab('CreateOrg', {
        name: data.name,
        parentIds: ids,
        orgDisplayPath: path,
        level: `${data.level}`,
        id: data.id
      })
      break
    }
    case treeRef.value.OPERATIONS.VIEW:
      activeTab('ViewOrg', {
        id: data.id
      })
      break
    default:
      return
  }
}
function onTreeNodeClick(orgId: string) {
  organizationId.value = orgId
}

function onTreeDataLoaded(orgId: string) {
  organizationId.value = orgId
}

function onSearchNoData() {
  tableRef.value.resetPage()
  tableData.value = []
  tableRef.value.total = 0
}
</script>

<style scoped lang="less">
.main-table {
  height: 100%;
}
</style>
