<template>
  <SearchInput
    v-model="searchKeyWord"
    @search="onSearch"
    @clear="onClear"
  />
  <div>
    <el-tree
      ref="treeRef"
      :check-strictly="true"
      class="tree"
      :style="{ height: `${props.height}px` }"
      :expand-on-click-node="true"
      :data="treeData"
      :default-expand-all="true"
      :filter-node-method="filterNode"
      node-key="id"
      show-checkbox
      @check-change="onCheckChange"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <span
            class="tree-label"
            :title="data.name"
          >
            {{ data.name }}
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { DefaultOrgTreeItem, getDefaultOrgTree, SUCCESS_CODE } from '@/api'
import { walkTreeForParentName } from '@/common/utils'
import SearchInput from '@/components/input/SearchInput.vue'
import { ElTree } from 'element-plus'
import { onMounted, ref, watch, nextTick } from 'vue'

const searchKeyWord = ref('')
const treeData = ref<DefaultOrgTreeItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

const emit = defineEmits(['checkChange', 'load'])

const props = withDefaults(
  defineProps<{
    selected?: string[]
    height?: number
  }>(),
  {
    selected: () => [],
    height: 370
  }
)

onMounted(async () => {
  const { data, code } = await getDefaultOrgTree(1)
  if (code === SUCCESS_CODE) {
    treeData.value = data.map(item => ({
      ...item,
      selected: false
    }))

    walkTreeForParentName(treeData.value[0])

    nextTick(() => {
      emit('load')
    })
  }
})

function onSearch() {
  treeRef.value?.filter(searchKeyWord.value)
}

watch(
  searchKeyWord,
  () => {
    if (!searchKeyWord.value) {
      onSearch()
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.selected,
  () => {
    nextTick(() => {
      treeRef.value?.setCheckedKeys(props.selected)
    })
  },
  {
    immediate: true,
    deep: true
  }
)
function onClear() {
  treeRef.value?.filter(searchKeyWord.value)
}
function onCheckChange(data: DefaultOrgTreeItem, checked: boolean) {
  emit('checkChange', data, checked)
}

const filterNode = (value: string, data: DefaultOrgTreeItem) => {
  if (!value) return true
  return data.name.includes(value)
}

function setChecked(id: string, checked: boolean) {
  treeRef.value.setChecked(id, checked, false)
}

function setCheckedKeys(ids: string[], checked: boolean) {
  ids.forEach(id => {
    setChecked(id, checked)
  })
}

function clearChecked(ids: string[]) {
  ids.forEach(id => {
    setChecked(id, false)
  })
}

defineExpose({
  clearChecked,
  setCheckedKeys
})
</script>

<style scoped lang="less">
.tree {
  overflow: auto;
}

.el-input {
  width: 100%;
}

:deep(.el-tree-node.is-expanded > .el-tree-node__children) {
  display: inline;
}
</style>
