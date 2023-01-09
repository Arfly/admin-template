<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        :model="formObj"
        label-width="100px"
      >
        <el-form-item
          label="岗位名称"
          prop="positionName"
        >
          <el-input
            v-model="formObj.positionName"
            disabled
          />
        </el-form-item>

        <el-form-item
          label="岗位编码"
          prop="id"
        >
          <el-input
            v-model="formObj.id"
            placeholder="系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>

        <el-divider />

        <el-form-item
          label="关联角色"
          prop="name"
        >
          <BindingPanel>
            <template #header>
              <el-row
                justify="space-between"
                class="main--dealt"
              >
                <p>需要关联的角色</p>
              </el-row>
            </template>
            <p style="color: #9f9f9f">可以选择需要开通的角色（可多选），保存即生效</p>
            <SearchInput
              v-model="keyword"
              @search="onSearch"
            />
            <el-table
              ref="roleDataTableRef"
              v-loading="loading"
              v-loadmore="loadMore"
              :border="false"
              :empty-text="'请输入角色名进行搜索'"
              :data="roleData"
              style="width: 100%; height: 280px"
              max-height="500"
              @selection-change="handleSelectionChange"
              @select="handleTableItemSelect"
            >
              <el-table-column
                type="selection"
                width="50"
                :selectable="checkSelectable"
              />
              <el-table-column
                label="角色名称"
                prop="roleName"
              />
              <el-table-column
                label="详情"
                width="60"
              >
                <template #default="scope">
                  <el-popover
                    placement="right"
                    :width="300"
                    trigger="click"
                    @hide="tableAction = -1"
                  >
                    <template #reference>
                      <svgIcon
                        name="ques"
                        :color="tableAction === scope.$index ? '#409EFF' : '#C3C3C3'"
                        size="16"
                        style="margin-left: 12px"
                        @click="getResourceByRoleId(scope.row.id)"
                      />
                    </template>
                    <p style="margin-bottom: 12px; font-size: 16px; color: #333333; font-weight: bold">资源列表</p>
                    <p class="belong-sys">
                      所属系统：{{ sysName }}
                      <span class="danger-color">系统</span>
                    </p>
                    <el-divider
                      direction="horizontal"
                      content-position="left"
                    />
                    <div class="user-resources">
                      <el-tree
                        ref="treeRef"
                        :data="resourceTree"
                        node-key="id"
                        :props="{ children: 'childrenList', label: 'name' }"
                        default-expand-all
                        check-on-click-node
                        icon-class=" "
                      >
                        <template #default="{ node }">
                          <span class="custom-tree-node">
                            <span>{{ node.label }}</span>
                          </span>
                        </template>
                      </el-tree>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <template #append>
                <p
                  v-show="!moreData && !!roleData.length"
                  class="no-more-data"
                >
                  无更多数据
                </p>
              </template>
            </el-table>
          </BindingPanel>
          <el-row
            justify="space-between"
            class="ques-title"
          >
            <svgIcon
              name="ques"
              color="#C3C3C3"
              size="16"
            />
            <p>鼠标点击，即可查看该角色下所有资源</p>
          </el-row>
          <BindingPanel>
            <template #header>
              <el-row
                justify="space-between"
                class="main--dealt"
              >
                <p>已选择的角色</p>
              </el-row>
            </template>
            <p style="color: #9f9f9f">展示已选择的角色，可以取消关联，保存即生效</p>
            <el-table
              :border="false"
              :data="boundRoleData"
              style="width: 100%; height: 330px"
              max-height="500"
            >
              <el-table-column
                type="index"
                width="60"
              />
              <el-table-column
                label="角色名称"
                prop="roleName"
              />
              <el-table-column
                label="操作"
                width="60"
              >
                <template #default="scope">
                  <icon
                    color="#ed5565"
                    style="cursor: pointer"
                    :name="Delete"
                    @click="deleteResource(scope.$index, scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </BindingPanel>
        </el-form-item>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="bindRoleToPost"
        >
          确 定
        </el-button>
        <el-button @click="dialogClosed">取 消</el-button>
      </span>
    </template>
  </Main>
</template>
<script setup lang="ts">
import {
  getPostBoundRole,
  getResourceSystemByRoleID,
  getRoleByRoleName,
  PostBindRoleItem,
  postDetail,
  postRole,
  resourceByRoleId,
  RoleListItem,
  SUCCESS_CODE
} from '@/api'
import SearchInput from '@/components/input/SearchInput.vue'
import { useLoadMore } from '@/hooks/tableLoadMore'
import { useStore } from '@/store'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const sysName = ref('')

const route = useRoute()
const id = route.query.id as string
const store = useStore()

const { pageNum, pageSize, loadMore, loading, moreData } = useLoadMore(getRolesData)

const viewVisible = ref(false)
const dialogClosed = () => {
  viewVisible.value = false
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
const formObj = ref({
  positionName: null,
  id: null
})

onMounted(() => {
  if (id) {
    postDetail(id).then(res => {
      if (res.code === SUCCESS_CODE) {
        formObj.value = res.data
      }
    })
  }
  nextTick(() => {
    multipleSelection.value = []
    getBoundData()
  })
})

const keyword = ref('')
const lastSearchKeyWord = ref('')
const roleData = ref<RoleListItem[]>([])
const boundRoleData = ref<PostBindRoleItem[]>([])
const roleDataTableRef = ref()
const multipleSelection = ref<RoleListItem[]>([])

watch(
  keyword,
  () => {
    if (!keyword.value) {
      roleData.value = []
      moreData.value = true
      pageNum.value = 1
      lastSearchKeyWord.value = ''

      getRolesData()
    }
  },
  { immediate: true }
)

const checkSelectable = row => !boundRoleData.value?.find(item => item.id === row.id)
/**
 * 获取岗位关联的角色
 */
const getBoundData = async () => {
  const { code, data } = await getPostBoundRole(id)

  if (code === SUCCESS_CODE) {
    boundRoleData.value = data

    nextTick(() => {
      setRoleDataCheckStatus(
        boundRoleData.value.map(bound => bound.id),
        true
      )
    })
  }
}

/**
 *
 * 设置可复选的表格中数据项的选定状态
 * @param ids 需要设定选定状态的id或id数组
 * @param checked 需要设定的选定状态
 */
function setRoleDataCheckStatus(ids: string | string[], checked: boolean) {
  if (roleDataTableRef.value) {
    if (Array.isArray(ids)) {
      ids.forEach(id => {
        const index = roleData.value.find(item => item.id === id)
        roleDataTableRef.value.toggleRowSelection(index, checked)
      })
    } else {
      const index = roleData.value.find(item => item.id === ids)
      roleDataTableRef.value.toggleRowSelection(index, checked)
    }
  }
}

getRolesData()

/**
 * 获取角色数据
 */
async function getRolesData() {
  const { data, code } = await getRoleByRoleName({
    roleName: keyword.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  if (code === SUCCESS_CODE) {
    lastSearchKeyWord.value = keyword.value
    roleData.value = [...roleData.value, ...data.list]
    moreData.value = data.hasNextPage

    nextTick(() => {
      setRoleDataCheckStatus(
        [...boundRoleData.value.map(bound => bound.id), ...multipleSelection.value.map(item => item.id)],
        true
      )
    })

    if (!roleData.value.length) {
      ElMessage.info('暂无搜索结果')
    }
  }
}

function deleteResource(index, row) {
  boundRoleData.value.splice(index, 1)
  deleteFromMultipleSelection(row.id)
  setRoleDataCheckStatus(row.id, false)
}

function deleteFromMultipleSelection(id) {
  const index = multipleSelection.value.findIndex(item => item.id === id)
  if (index !== -1) {
    multipleSelection.value.splice(index, 1)
  }
}

async function bindRoleToPost() {
  const roleIds: string[] = []
  multipleSelection.value.forEach(row => {
    if (row) {
      roleIds.push(row.id)
    }
  })

  boundRoleData.value.forEach(user => {
    if (!roleIds.includes(user.id)) {
      roleIds.push(user.id)
    }
  })
  const { code } = await postRole({ positionId: id, roleIds })
  if (code === SUCCESS_CODE) {
    ElMessage.success('权限已成功变更')
    getBoundData()
  }
}

// 取消选中的项目进行剔除
function handleSelectionChange(val) {
  val.forEach(item => {
    if (item && multipleSelection.value.findIndex(sel => sel.id === item.id) === -1) {
      multipleSelection.value.push(item)
    }
  })
}

function handleTableItemSelect(selection, row) {
  if (selection.findIndex(item => item && item.id === row.id) === -1) {
    const index = multipleSelection.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      console.log(index)
      multipleSelection.value.splice(index, 1)
    }
    deleteFromMultipleSelection(row.id)
  }
}
// -----角色的资源树-------
const resourceTree = ref([])
const tableAction = ref(-1)

async function getResourceByRoleId(id) {
  const sysRes = await getResourceSystemByRoleID(id)
  if (sysRes.code === SUCCESS_CODE) {
    sysName.value = sysRes.data.systemName
  }

  const resourceRes = await resourceByRoleId(id)
  if (resourceRes.code === SUCCESS_CODE) {
    resourceTree.value = resourceRes.data
    tableAction.value = id
  }
}

function onSearch() {
  if (lastSearchKeyWord.value !== keyword.value) {
    pageNum.value = 1
    roleData.value = []
    moreData.value = true
    getRolesData()
  }
}
</script>
<style lang="less" scoped>
@import '@/assets/styles/common.less';
.el-card {
  height: auto;
}
:deep(.el-card__header) {
  font-size: 16px;
  line-height: 16px;
}
:deep(.el-card__body) {
  padding: 12px;
  p {
    min-height: 35px;
    line-height: 18px;
  }
}
.el-col-8 {
  padding-left: 15px;
  padding-right: 15px;
}

.belong-sys {
  line-height: 22px;

  font-size: 16px;
  color: #333333;
  line-height: 22px;
  font-weight: 400;
}
</style>
