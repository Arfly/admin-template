<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        :model="formObj"
        label-width="100px"
        style="height: auto"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="formObj.roleName"
            disabled
            :title="formObj.roleName"
          />
        </el-form-item>
        <el-form-item
          label="对应系统"
          prop="systemId"
        >
          <el-select
            v-model="formObj.systemId"
            placeholder="请选择..."
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="item in systemData"
              :key="item.systemId"
              :label="item.name"
              :value="item.systemId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="角色编码"
          prop="id"
        >
          <el-input
            v-model="formObj.roleCode"
            placeholder="系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>

        <el-divider />

        <el-form-item
          label="关联资源"
          prop="name"
          style="padding-left: 15px; padding-right: 15px"
        >
          <div class="binding-container">
            <BindingPanel>
              <template #title>
                <p>未关联的资源内容</p>
              </template>
              <template #label> 可以选择需要开通的资源（可多选），保存即生效 </template>
              <template #content>
                <SearchInput
                  v-model="keyword"
                  @search="treeSearch"
                />

                <el-tree
                  ref="treeRef"
                  show-checkbox
                  :data="activeTreeData"
                  node-key="resourceId"
                  :props="{
                    children: 'childrenList',
                    label: 'name',
                    id: 'resourceId'
                  }"
                  default-expand-all
                  check-on-click-node
                  style="width: 100%"
                  :filter-node-method="filterNode"
                  @check="checkTree"
                >
                  <template #default="{ node }">
                    <span class="custom-tree-node">
                      <span>{{ node.label }}</span>
                    </span>
                  </template>
                </el-tree>
              </template>
            </BindingPanel>

            <BindingPanel>
              <template #title>已关联的资源内容</template>
              <template #label>展示已选择的资源，可以取消关联，保存后即可获得对应资源</template>
              <template #content>
                <el-tree
                  ref="selectTreeRef"
                  :data="allTreeData"
                  :props="{
                    children: 'childrenList',
                    label: 'name',
                    id: 'resourceId'
                  }"
                  default-expand-all
                  style="width: 100%"
                  :filter-node-method="filterSelectNode"
                >
                  <template #default="{ node, data }">
                    <span
                      class="custom-tree-node"
                      style="display: flex; justify-content: space-between; width: 100%"
                    >
                      {{ node.label }}

                      <svgIcon
                        name="close"
                        style="margin-right: 5px; top: 2px; position: relative"
                        @click.stop="remove(node, data)"
                      />
                    </span>
                  </template>
                </el-tree>
              </template>
            </BindingPanel>
          </div>
        </el-form-item>
      </el-form>
    </template>

    <!--底部按钮区域-->
    <template #footer>
      <el-button
        type="primary"
        @click="submit"
      >
        确 定
      </el-button>
      <el-button @click="dialogClosed">取 消</el-button>
    </template>
  </Main>
</template>
<script lang="ts" setup>
import {
  getAllSystem,
  getBindResourceByRoleID,
  getFEResourceTreeBySysID,
  getRoleDetail,
  ResTreeNode,
  RoleDetail,
  roleResource,
  SUCCESS_CODE
} from '@/api'
import SearchInput from '@/components/input/SearchInput.vue'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useStoreHook } from '@/hooks/useStore'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

const store = useStore()
const { systemId } = useStoreHook()
const route = useRoute()
const id = route.query.id as string
const dialogClosed = () => {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}

const DEFAULT_FORM = {
  createBy: '',
  desc: '',
  id: '',
  lastUpdateBy: '',
  roleCode: '',
  roleName: '',
  status: null,
  systemId: systemId.value
}
const formObj = ref<RoleDetail>(DEFAULT_FORM)

async function getBoundResource() {
  const { data, code } = await getBindResourceByRoleID(id)
  if (code === SUCCESS_CODE) {
    searchTreeData.value = data
    data.forEach(item => {
      treeRef.value.setChecked(item, true)
    })
    selectTreeId.value = data.map(item => item.resourceId)
    selectTreeRef.value.filter()
  }
}
onMounted(() => {
  if (id) {
    getRoleDetail(id).then(res => {
      if (res.code === SUCCESS_CODE) {
        formObj.value = res.data
      }
    })
  }
  nextTick(async () => {
    getAllSystem().then(res => {
      if (res.code === SUCCESS_CODE) {
        systemData.value = res.data
      }
    })

    const rolResourceTreeWithAllRes = await getFEResourceTreeBySysID(systemId.value)
    if (rolResourceTreeWithAllRes.code === SUCCESS_CODE) {
      allTreeData.value = rolResourceTreeWithAllRes.data
    }

    const rolResourceTreeRes = await getFEResourceTreeBySysID(systemId.value, 1)
    if (rolResourceTreeRes.code === SUCCESS_CODE) {
      activeTreeData.value = rolResourceTreeRes.data
    }
    getBoundResource()
  })
})
// ------底部选择器-----
const keyword = ref('')
const treeRef = ref(null)
const selectTreeRef = ref(null)
const selectTreeId = ref([])
const systemData = ref([])
const searchTreeData = ref([])
const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}
const filterSelectNode = (value, data) => {
  if (!value && selectTreeId.value.indexOf(data.resourceId) > -1) return true
  return data.name.includes(value) && selectTreeId.value.indexOf(data.resourceId) > -1
}
const activeTreeData = ref<ResTreeNode[]>([])
const allTreeData = ref<ResTreeNode[]>([])

const treeSearch = () => {
  treeRef.value.filter(keyword.value)
}
const selectTreeSearch = () => {
  selectTreeRef.value.filter()
}
const checkTree = (value, tree) => {
  const nodes = tree.checkedNodes.filter(item => !item.children)
  selectTreeId.value = [...selectTreeId.value, ...nodes.map(item => item.resourceId)]
  selectTreeRef.value.filter()
}
const submit = () => {
  // formObj
  const resourceIds = []
  treeRef.value.getCheckedNodes(false, true).forEach(item => {
    resourceIds.push(item.resourceId)
  })

  roleResource({ resourceIds, roleId: formObj.value.id }).then(res => {
    if (res.code === SUCCESS_CODE) {
      // eslint-disable-next-line new-cap
      ElMessage({ type: 'success', message: '权限已成功变更' })
      // emit('editSuccess')
      getBoundResource()
    }
  })
}

const getRemoveArr = (arr, data) => {
  const children = data.childrenList
  if (children) {
    children.forEach(item => {
      if (item.childrenList && item.childrenList.length > 0) {
        getRemoveArr(arr, item)
      } else {
        arr.push(item.resourceId)
      }
    })
  } else {
    arr.push(data.resourceId)
  }
  return arr
}
const remove = (node, tree) => {
  const removeArr = getRemoveArr([tree.resourceId], tree)
  const newSelect = []
  selectTreeId.value.forEach(item => {
    if (removeArr.indexOf(item) === -1) {
      newSelect.push(item)
    }
  })
  selectTreeId.value = newSelect
  removeArr.forEach(item => {
    treeRef.value.setChecked(item, false)
  })
  selectTreeSearch()
}

watch(
  keyword,
  () => {
    if (!keyword.value && treeRef.value) {
      treeRef.value.filter(keyword.value)
    }
  },
  { immediate: true }
)
</script>
<style lang="less" scoped>
.binding-container {
  display: flex;
  flex-direction: row;
}
</style>
