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
              <el-col
                :span="12"
                style="width: 320px"
              >
                <el-input
                  v-model="queryInfo.roleName"
                  clearable
                  placeholder="请输入角色名称..."
                  @clear="getRoleList"
                />
              </el-col>
              <el-col :span="12">
                <el-select
                  v-model="queryInfo.systemId"
                  :disabled="!isSuperUser"
                  style="width: 100%"
                  placeholder="请选择所属系统"
                >
                  <el-option
                    v-for="item in systemData"
                    :key="item.systemId"
                    :label="item.name"
                    :value="item.systemId"
                  />
                </el-select>
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
              @click="activeTab('CreateRole')"
            >
              <img src="@/assets/icons/icon-add-circle.png" /> 新增角色
            </el-button>
          </template>
          <template #table>
            <TableWithPagination
              ref="tableRef"
              :data="roleData"
              :columns="columns"
              @page-change="getRoleList"
            />
          </template>
        </TableWithOpts>
      </template>
    </Main>
  </div>
</template>

<script lang="tsx" setup>
import { getAllSystem, requestRoleList, RoleListItem, roleSwitch, SUCCESS_CODE } from '@/api'
import Main from '@/components/layout/Main.vue'
import { TableColumn } from '@/components/table/table'
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import TableWithOpts from '@/components/table/TableWithOpts.vue'
import TableWithPagination from '@/components/table/TableWithPagination.vue'
import { ElMessage } from 'element-plus'
import { Fragment, onMounted, ref } from 'vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { useStoreHook } from '@/hooks/useStore'
import { activeTab } from '@/hooks/tabs'

const { isSuperUser, systemId } = useStoreHook()
const columns = ref<TableColumn[]>([
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '角色名称',
    prop: 'roleName',
    width: 150
  },
  {
    label: '所属系统',
    prop: 'systemName',
    width: 150
  },
  {
    label: '角色编码',
    prop: 'roleCode',
    width: 210
  },
  {
    label: '备注',
    prop: 'desc'
  },
  {
    label: '状态',
    width: 100,
    customerRender: row => (
      <el-switch
        v-model={row.status}
        width="60px"
        size="large"
        activeValue={1}
        inactiveValue={0}
        inlinePrompt
        style="--el-switch-on-color: #1177ee; --el-switch-off-color: #dddddd"
        activeText="启用"
        inactiveText="停用"
        onChange={() => switchStatus(row)}
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
            activeTab('ViewRole', {
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
            activeTab('EditRole', {
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
            activeTab('BindRes', {
              id: row.id
            })
          }
        >
          关联资源
        </el-button>
      </Fragment>
    )
  }
])
const tableRef = ref()

const systemData = ref([])
const roleData = ref<RoleListItem[]>([])
const queryInfo = ref({
  roleName: '',
  systemId: systemId.value
})

async function getRoleList() {
  const { code, data } = await requestRoleList({
    ...tableRef.value.page,
    ...queryInfo.value
  })

  if (code === SUCCESS_CODE) {
    tableRef.value.total = data.total
    roleData.value = data.list
  }
}

function getSystemOption() {
  getAllSystem().then(res => {
    if (res.code === SUCCESS_CODE) {
      systemData.value = res.data
    }
  })
}
function resetSearch() {
  queryInfo.value = {
    roleName: '',
    systemId: systemId.value
  }
  tableRef.value.resetPage()
  getRoleList()
}

async function switchStatus(row) {
  const { code } = await roleSwitch({
    roleId: row.id,
    targetStatus: row.status
  })
  if (code === SUCCESS_CODE) {
    ElMessage.success(`角色已成功${row.status ? '启用' : '停用'}`)
  }
}

function search() {
  tableRef.value.resetPage()
  getRoleList()
}

onMounted(() => {
  getRoleList()
  getSystemOption()
})
</script>
