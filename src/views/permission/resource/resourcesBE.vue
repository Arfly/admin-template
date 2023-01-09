<template>
  <div>
    <Main>
      <template #aside>
        <el-select
          v-model="systemId"
          placeholder="请选择系统"
          class="mb-10 w-100"
          @change="getResourceList"
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
            @clear="getResourceList"
          />
          <div style="overflow-y: auto; height: calc(100% - 32px - 10px)">
            <el-tree
              v-show="searchArr.length === 0"
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
                      class="tree-node-label"
                      :title="node.label"
                    >
                      {{ node.label }}
                      <span
                        v-if="data.resourceId === '0'"
                        style="color: #fa5555"
                      >
                        系统
                      </span>
                    </span>
                    <span
                      v-if="data.resourceId === '0'"
                      class="tree-opt"
                    >
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="openComponentOnAdd(AfterEditResources, node)"
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
                      @click.stop="openComponent(AfterViewResources, node)"
                    >
                      <template #icon>
                        <img src="@/assets/icons/icon-serarch.png" />
                      </template>
                    </el-button>
                    <el-button
                      text
                      class="opt-icon"
                      @click.stop="openComponent(AfterEditResources, node)"
                    >
                      <template #icon>
                        <img src="@/assets/icons/icon-edit.png" />
                      </template>
                    </el-button>
                  </span>
                </span>
              </template>
            </el-tree>
            <div v-show="searchArr.length > 0">
              <el-tree
                :data="searchArr"
                node-key="resourceId"
                :props="{ label: 'name', id: 'resourceId' }"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="treeLaborByNode"
              >
                <template #default="{ node, data }">
                  <span
                    class="custom-tree-node"
                    @mouseenter="treeHover = data.resourceId"
                    @mouseleave="treeHover = ''"
                  >
                    <span class="item-label-wrapper">
                      <span :title="node.label">
                        {{ node.label }}
                        <span
                          v-if="data.resourceId === '0'"
                          style="color: #fa5555"
                        >
                          系统
                        </span>
                      </span>
                    </span>
                    <span
                      v-show="treeHover === data.resourceId"
                      class="tree-opt"
                    >
                      <!-- <el-button
                        text
                        class="opt-icon"
                        @click.stop="openComponentOnAdd(AfterEditResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-add-circle.png" />
                        </template>
                      </el-button> -->
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="openComponent(AfterViewResources, node)"
                      >
                        <template #icon>
                          <img src="@/assets/icons/icon-serarch.png" />
                        </template>
                      </el-button>
                      <el-button
                        text
                        class="opt-icon"
                        @click.stop="openComponent(AfterEditResources, node)"
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
import { BackendListItem, getAllSystem, getBackendResourceList, SUCCESS_CODE, SystemListItem } from '@/api'
import { nextTick, ref, watch } from 'vue'
import { useStoreHook } from '@/hooks/useStore'
// ----- 搜索 ------
import Main from '@/components/layout/Main.vue'
import { ElMessage } from 'element-plus'
import SearchInput from '../../../components/input/SearchInput.vue'
import AfterEditResources from './form/EditBackEndResources.vue'
import AfterViewResources from './form/ViewBackEndResources.vue'
const searchKeyWord = ref('')
const laborComponent = ref()
const laborComponentData = ref({})

const store = useStoreHook()
const systemId = ref(store.systemId.value)

// ------左侧树-----
const treeRef = ref(null)
const treeData = ref<
  {
    resourceId: string
    name: string
    childrenList: BackendListItem[]
    parentId: string
    status: number
  }[]
>([])
const treeHover = ref('0')
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
    getResourceList()
  }
}
const editSuccess = () => {
  laborComponent.value = null
  getResourceList()
}
const getResourceList = async () => {
  state.value = STATE.TREE
  if (systemId.value) {
    treeData.value = []
    searchArr.value = []
    searchKeyWord.value = ''
    const { code, data } = await getBackendResourceList({
      name: searchKeyWord.value,
      systemId: systemId.value
    })
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

      if (treeData.value[0].childrenList.length > 0) {
        laborComponentData.value = {
          resourceId: treeData.value[0].childrenList[0].resourceId
        }
        laborComponent.value = AfterViewResources
      } else {
        laborComponent.value = null
        laborComponentData.value = null
      }
    }
  }
}

const searchArr = ref<BackendListItem[]>([])
const filterNode = (val, data: BackendListItem) => {
  if (!searchKeyWord.value) return true
  const kill = data.name.indexOf(searchKeyWord.value) !== -1
  if (kill) {
    searchArr.value.push(data)
  }
  return true
}
const openComponentOnAdd = (component, node) => {
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
const openComponent = (component, node) => {
  laborComponentData.value = { resourceId: node.data.resourceId }
  laborComponent.value = component
}
const handleSearch = () => {
  state.value = STATE.SEARCH
  nextTick(() => {
    searchArr.value = []
    treeRef.value.filter()
  })
}
const treeLaborByNode = node => {
  if (node.resourceId === '0') return false
  laborComponentData.value = { resourceId: node.resourceId }
  laborComponent.value = AfterViewResources
}

watch(
  searchKeyWord,
  () => {
    if (!searchKeyWord.value) {
      state.value = STATE.TREE
      searchArr.value = []
    }
  },
  {
    immediate: true
  }
)

// --------初始化--------
getSystemList()
</script>

<style scoped lang="less">
.opt-icon {
  margin-left: 5px;
  padding: 0;
  height: 19px;
}
.tree-container {
  border: 1px solid rgba(221, 221, 221, 1);
  height: calc(100% - 32px - 10px);
  padding: 12px;
  box-sizing: border-box;
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
.tree-node-label {
  max-width: 140px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  line-height: 22px;
}

:deep(.el-tree-node.is-expanded > .el-tree-node__children) {
  display: inline;
}

:deep(.el-tree-node__label) {
  flex: 1;
}
.item-label-wrapper {
  display: flex;
  align-items: center;
}
</style>
