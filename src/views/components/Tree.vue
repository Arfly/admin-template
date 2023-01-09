<template>
  <div class="tree-container">
    <SearchInput
      v-model="searchKeyWord"
      @search="handleSearch"
      @clear="handleClear"
    />
    <el-tree
      v-show="state === STATE.TREE"
      ref="treeRef"
      :default-expanded-keys="defaultExpandIDs"
      node-key="id"
      :expand-on-click-node="false"
      :data="treeData"
      @node-click="onNodeClick"
    >
      <template #default="{ data }">
        <div
          class="customer-tree-node"
          @mouseenter="treeHover = data.id"
          @mouseleave="treeHover = ''"
        >
          <span
            class="tree-label"
            :title="data.name"
          >
            {{ data.name }}
          </span>
          <template v-if="props.options && props.options.length > 0">
            <span
              v-show="treeHover === data.id"
              class="opts"
            >
              <span
                v-show="props.options.includes('add')"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.ADD, data)"
              >
                <img src="@/assets/icons/icon-add-circle.png" />
              </span>
              <span
                v-show="props.options.includes('view') && data.level != 1"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.VIEW, data)"
              >
                <img src="@/assets/icons/icon-serarch.png" />
              </span>
              <span
                v-show="props.options.includes('edit')"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.EDIT, data)"
              >
                <img src="@/assets/icons/icon-edit.png" />
              </span>
            </span>
          </template>
        </div>
      </template>
    </el-tree>
    <div
      v-show="state === STATE.SEARCH"
      class="result-container"
    >
      <div
        v-if="result.length === 0"
        class="no-data"
      >
        暂无数据
      </div>
      <div
        v-for="item in result"
        :key="item.id"
        class="result-item"
        @click="onNodeClick(item)"
        @mouseenter="treeHover = item.id"
        @mouseleave="treeHover = ''"
      >
        <div class="name">
          <span>{{ item.name }}</span>
          <template v-if="props.options && props.options.length > 0">
            <span v-show="treeHover === item.id">
              <span
                v-show="props.options.includes('add')"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.ADD, item)"
              >
                <img src="@/assets/icons/icon-add-circle.png" />
              </span>
              <span
                v-show="props.options.includes('view')"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.VIEW, item)"
              >
                <img src="@/assets/icons/icon-serarch.png" />
              </span>
              <span
                v-show="props.options.includes('edit')"
                class="opt-btn"
                @click.stop="onOperation(OPERATIONS.EDIT, item)"
              >
                <img src="@/assets/icons/icon-edit.png" />
              </span>
            </span>
          </template>
        </div>
        <div
          v-if="item.unitTypeCode === '11'"
          class="parent"
        >
          {{ `${item.parentName}/${item.name}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import SearchInput from '@/components/input/SearchInput.vue'
import { DefaultOrgTreeItem, getDefaultOrgTree, SUCCESS_CODE } from '@/api'
import { getTreeDeep, walkTreeForParentName } from '@/common/utils'

const searchKeyWord = ref('')
const treeData = ref<DefaultOrgTreeItem[]>([])
const treeRef = ref()
const result = ref<DefaultOrgTreeItem[]>([])
const treeHover = ref('')

const OPERATIONS = {
  ADD: 'add',
  VIEW: 'view',
  EDIT: 'edit'
}

const STATE = {
  SEARCH: 0,
  TREE: 1
}
const state = ref(STATE.TREE)

const treeDeep = computed(() => {
  if (treeData.value && treeData.value[0]) {
    return getTreeDeep(treeData.value[0])
  }

  return null
})

async function requestOrgDefaultTree() {
  const { code, data } = await getDefaultOrgTree()
  if (code === SUCCESS_CODE) {
    treeData.value = data
    walkTreeForParentName(treeData.value[0])
    buildTree(treeData.value[0])
    emit('loaded', treeData.value[0] ? treeData.value[0].id : '')
  }
}

const emit = defineEmits(['nodeClick', 'loaded', 'operation', 'noData'])

onMounted(() => {
  requestOrgDefaultTree()
})

const defaultExpandIDs = computed(() => {
  const result: string[] = []
  function walkTree(treeNode: DefaultOrgTreeItem) {
    if (!treeNode.parentTreeNode) {
      result.push(treeNode.id)
    }

    if (treeNode.children && treeNode.children.length > 0) {
      treeNode.children.forEach(item => {
        walkTree(item)
      })
    }
  }
  treeData.value[0] ? walkTree(treeData.value[0]) : null
  return result
})

function handleSearch() {
  if (searchKeyWord.value) {
    result.value = searchTreeNodeByName(searchKeyWord.value)
    state.value = STATE.SEARCH

    if (result.value.length === 0) {
      emit('noData')
      emit('nodeClick', null)
    }
  }
}

function handleClear() {
  result.value = []
  state.value = STATE.TREE
}

watch(
  searchKeyWord,
  () => {
    if (!searchKeyWord.value) {
      state.value = STATE.TREE
    }
  },
  {
    immediate: true
  }
)

watch(state, () => {
  if (state.value === STATE.TREE) {
    emit('nodeClick', treeData.value[0]?.id)
  }
})

function searchTreeNodeByName(name: string) {
  const result: DefaultOrgTreeItem[] = []

  function walkTree(treeNode: DefaultOrgTreeItem) {
    if (treeNode.name.includes(name)) {
      result.push(treeNode)
    }

    if (treeNode.children && treeNode.children.length > 0) {
      treeNode.children.forEach(item => {
        walkTree(item)
      })
    }
  }

  walkTree(treeData.value[0])

  return result
}

function onNodeClick(node) {
  emit('nodeClick', node.id)
}

defineExpose({
  loadTree: () => {
    requestOrgDefaultTree()
  },
  OPERATIONS,
  treeDeep
})

const props = defineProps<{
  options?: string[]
}>()

function onOperation(operationName: string, data: DefaultOrgTreeItem) {
  emit('operation', operationName, data)
}

function buildTree(data: DefaultOrgTreeItem) {
  if (data.children) {
    data.children.forEach(item => {
      // eslint-disable-next-line no-param-reassign
      item.parentTreeNode = data
      buildTree(item)
    })
  }
}
</script>

<style scoped lang="less">
.tree-container {
  border: 1px solid rgba(221, 221, 221, 1);
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  .el-tree {
    margin-top: 10px;
    height: calc(100% - 32px - 10px);
    overflow: auto;
  }

  .customer-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;

    .tree-label {
      max-width: 144px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    img {
      margin: 0 2px;
    }

    .opts {
      display: flex;
      .opt-btn {
        display: flex;
        align-items: center;
      }
    }
  }

  .result-container {
    height: calc(100% - 20px);
    overflow: auto;
    .result-item {
      padding: 9px 6px;
      .name {
        line-height: 22px;

        font-size: 16px;
        color: #666666;
        font-weight: 400;
        display: flex;
        justify-content: space-between;

        img {
          margin: 0 2px;
        }
      }

      .parent {
        margin-top: 4px;
        line-height: 17px;

        font-size: 12px;
        color: #999999;
        font-weight: 400;
      }
    }

    .result-item:hover {
      background: #e7f1fd;
      cursor: pointer;
    }
  }
}

.no-data {
  height: 60px;
  width: 100%;
  text-align: center;
  color: #909399;
  font-size: 14px;
  line-height: 60px;
}

:deep(.el-tree-node.is-expanded > .el-tree-node__children) {
  display: inline;
}

:deep(.el-tree-node__label) {
  flex: 1;
}
</style>
