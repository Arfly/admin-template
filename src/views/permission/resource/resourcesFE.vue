<template>
  <div>
    <Main>
      <template #aside>
        <el-select
          v-model="systemId"
          placeholder="请选择系统"
          class="mb-10 w-100"
          @change="getResourceTree"
        >
          <el-option
            v-for="item in systemData"
            :key="item.systemId"
            :label="item.name"
            :value="item.systemId"
          />
        </el-select>
        <div class="tree-container">
          <SearchInput
            v-model="searchKeyWord"
            style="padding: 8px 0"
            @search="handleSearch"
            @clear="getResourceTree"
          />
          <div style="overflow-y: auto; height: calc(100% - 32px - 10px)">
            <el-tree
              v-show="state === STATE.TREE"
              ref="treeRef"
              :data="treeData"
              node-key="resourceId"
              :props="{
                children: 'childrenList',
                label: 'name',
                id: 'resourceId'
              }"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              :default-expanded-keys="['0']"
              @node-click="treeLaborByNode"
            >
              <template #default="{ node, data }">
                <span
                  class="custom-tree-node"
                  @mouseenter="treeHover = data.resourceId"
                  @mouseleave="treeHover = ''"
                >
                  <span class="label">
                    <span
                      :title="node.label"
                      class="tree-label"
                    >
                      {{ node.label }}
                    </span>
                    <span
                      v-if="!data.parentId"
                      style="color: #fa5555"
                    >
                      系统
                    </span>
                    <span
                      v-if="!data.parentId"
                      class="tree-opt"
                    >
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="treeLaborAdd(EditResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-add-circle.png" />
                        </template>
                      </el-button>
                    </span>
                  </span>

                  <span
                    v-show="data.resourceId !== '0' && treeHover === data.resourceId"
                    class="tree-opt"
                  >
                    <el-button
                      text
                      class="opt-icon"
                      @click.stop="treeLaborAdd(EditResources, node)"
                    >
                      <template #icon>
                        <img src="@/assets/icons/icon-add-circle.png" />
                      </template>
                    </el-button>
                    <el-button
                      text
                      class="opt-icon"
                      @click.stop="treeLabor(ViewResources, node)"
                    >
                      <template #icon>
                        <img src="@/assets/icons/icon-serarch.png" />
                      </template>
                    </el-button>
                    <el-button
                      text
                      class="opt-icon"
                      @click.stop="treeLabor(EditResources, node)"
                    >
                      <template #icon>
                        <img src="@/assets/icons/icon-edit.png" />
                      </template>
                    </el-button>
                  </span>
                </span>
              </template>
            </el-tree>
            <div v-show="state === STATE.SEARCH">
              <el-tree
                :data="searchArr"
                node-key="resourceId"
                :props="{
                  children: 'childrenList',
                  label: 'name',
                  id: 'resourceId'
                }"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="treeLaborByNode"
              >
                <template #default="{ node, data }">
                  <span
                    class="custom-tree-node"
                    style="line-height: 40px"
                    @mouseenter="treeHover = data.resourceId"
                    @mouseleave="treeHover = ''"
                  >
                    <span :title="data.name">{{
                      data.parentName ? `${data.parentName}-${data.name}` : data.name
                    }}</span>
                    <span
                      v-if="!data.parentId"
                      style="color: #fa5555"
                    >
                      系统
                    </span>
                    <span
                      v-show="!data.childrenList.length && treeHover === data.resourceId"
                      class="tree-opt"
                    >
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="treeLaborAdd(EditResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-add-circle.png" />
                        </template>
                      </el-button>
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="treeLabor(ViewResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-serarch.png" />
                        </template>
                      </el-button>
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="treeLabor(EditResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-edit.png" />
                        </template>
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <component
          :is="laborComponent"
          :row-obj="laborComponentData"
          @edit-success="editSuccess"
          @close="laborComponent = null"
        />
      </template>
    </Main>
  </div>
</template>

<script lang="ts" setup>
import { getAllSystem, getFEResourceTreeBySysID, ResTreeNode, SUCCESS_CODE, SystemListItem } from '@/api'
import SearchInput from '@/components/input/SearchInput.vue'
import Main from '@/components/layout/Main.vue'
import { ElMessage } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { useStoreHook } from '@/hooks/useStore'
import EditResources from './form/EditResources.vue'
import ViewResources from './form/ViewResources.vue'
const searchKeyWord = ref('')
const laborComponent = ref()
const laborComponentData = ref<
  Partial<{
    parentId: string
    parentName: string
    level: number
    type: number
    status: number
    laborType: string
    systemId: string
    relBackendResourceList: []
    resourceId: string
  }>
>()

const store = useStoreHook()
const systemId = ref(store.systemId.value)
// ------左侧树-----
const treeRef = ref(null)
const treeData = ref<ResTreeNode[]>([])
const treeHover = ref('0')

// ------分页相关-----
const systemData = ref<SystemListItem[]>([])

const STATE = {
  SEARCH: 1,
  TREE: 2
}
const state = ref(STATE.TREE)

const getSystemList = async () => {
  const { code, data } = await getAllSystem()
  if (code === SUCCESS_CODE) {
    systemData.value = data
  }
  if (systemId.value) {
    getResourceTree()
  }
}
const editSuccess = () => {
  laborComponent.value = null
  getResourceTree()
}
const getResourceTree = async () => {
  state.value = STATE.TREE
  if (systemId.value) {
    treeData.value = []
    searchArr.value = []
    searchKeyWord.value = ''
    const { code, data } = await getFEResourceTreeBySysID(systemId.value)
    if (code === SUCCESS_CODE) {
      const option = systemData.value.find(item => item.systemId === systemId.value)
      treeData.value = [
        {
          resourceId: '0',
          name: option.name,
          childrenList: data,
          parentId: '',
          status: null
        }
      ]

      walkTreeForParentName(treeData.value[0])

      if (treeData.value[0].childrenList.length > 0) {
        laborComponentData.value = {
          resourceId: treeData.value[0].childrenList[0].resourceId
        }
        laborComponent.value = ViewResources
      } else {
        laborComponent.value = null
        laborComponentData.value = null
      }
    }
  }
}

function walkTreeForParentName(tree: ResTreeNode) {
  function walk(data: ResTreeNode) {
    if (data.childrenList) {
      data.childrenList.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.parentName = data.name
        walk(item)
      })
    }
  }
  walk(tree)
}

const searchArr = ref<ResTreeNode[]>([])
const filterNode = (val, data: ResTreeNode) => {
  if (!searchKeyWord.value) return true
  const kill = data.name.indexOf(searchKeyWord.value) !== -1
  if (kill) {
    searchArr.value.push(data)
  }
  return true
}
const treeLaborAdd = (component, node) => {
  if (node.level >= 16) {
    // eslint-disable-next-line new-cap
    ElMessage({ type: 'warning', message: '最多注册15级资源' })
    return false
  }
  laborComponent.value = component
  laborComponentData.value = {
    parentId: node.data.resourceId,
    parentName: node.data.name,
    level: node.level,
    type: 1,
    status: 1,
    laborType: 'add',
    systemId: systemId.value,
    relBackendResourceList: []
  }
}
const treeLabor = (component, node) => {
  laborComponentData.value = { resourceId: node.data.resourceId }
  laborComponent.value = component
}
const treeLaborByNode = node => {
  if (node.resourceId === '0') return false
  laborComponentData.value = { resourceId: node.resourceId }
  laborComponent.value = ViewResources
}
const handleSearch = () => {
  state.value = STATE.SEARCH
  nextTick(() => {
    searchArr.value = []
    treeRef.value.filter()
  })
}

// --------初始化--------
getSystemList()

watch(
  searchKeyWord,
  () => {
    if (!searchKeyWord.value) {
      searchArr.value = []
      state.value = STATE.TREE
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="less">
.opt-icon {
  margin-left: 5px;
  padding: 0;
  height: 19px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  min-width: 100px;
  width: 100%;
  justify-content: space-between;
  .label {
    display: flex;
    align-items: center;
    .tree-label {
      max-width: 140px;
      overflow: hidden;
      display: inline-block;
      text-overflow: ellipsis;
    }
  }
  .tree-opt {
    margin-right: 5px;
  }
}
.tree-container {
  border: 1px solid rgba(221, 221, 221, 1);
  height: calc(100% - 32px - 10px);
  padding: 12px;
  box-sizing: border-box;
}

:deep(.el-tree-node.is-expanded > .el-tree-node__children) {
  display: inline;
}

:deep(.el-tree-node__label) {
  flex: 1;
}
</style>
