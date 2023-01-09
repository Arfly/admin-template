<template>
  <div class="container">
    <SearchInput
      v-model="searchKeyWord"
      class="search-input"
      @search="onSearch"
      @clear="result = []"
    />
    <el-table
      ref="tableRef"
      v-loading="loading"
      v-loadmore="loadMore"
      :show-header="false"
      class="post-table"
      :border="false"
      :data="result"
      height="380px"
      @selection-change="handleSelectionChange"
      @select="onSelect"
    >
      <el-table-column
        type="selection"
        width="40"
        :selectable="checkSelectable"
      />
      <el-table-column
        label="岗位名称"
        prop="positionName"
      >
        <template #default="scope">
          <span
            :title="scope.row.positionName"
            class="overflow-ellipsis post-name"
          >
            {{ scope.row.positionName }}
          </span>
          <UserResourcePopOver :position-id="scope.row.id" />
        </template>
      </el-table-column>
      <template #append>
        <p
          v-show="!moreData && !!result.length"
          class="no-more-data"
        >
          无更多数据
        </p>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import SearchInput from '@/components/input/SearchInput.vue'
import { PostDetailData, postOption, SUCCESS_CODE, UserBindPostItem } from '@/api'
import UserResourcePopOver from '@/views/components/popover/UserResourcePopOver.vue'
import { ElMessage } from 'element-plus'
import { useLoadMore } from '@/hooks/tableLoadMore'

const searchKeyWord = ref('')
const result = ref<PostDetailData[]>([])
const tableRef = ref()
const lastSearchKeyWord = ref('')

const { pageNum, pageSize, moreData, loading, loadMore } = useLoadMore(handleSearch)

const props = defineProps<{
  selected: UserBindPostItem[] // 编辑中的关联用户
  bind: string[] // 数据库中已经绑定的用户id
}>()

const emit = defineEmits(['selectionChange', 'removeSelect'])

function checkSelectable(row: PostDetailData) {
  return !props.bind.includes(row.id)
}

async function handleSearch() {
  const { code, data } = await postOption({
    positionName: searchKeyWord.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })

  if (code === SUCCESS_CODE) {
    lastSearchKeyWord.value = searchKeyWord.value
    result.value = [...result.value, ...data.list]
    moreData.value = data.hasNextPage
    if (!result.value.length) {
      ElMessage.info('暂无搜索结果')
    }
    nextTick(() => {
      props.selected.forEach(item => {
        setTableRefSelection(item.positionId, true)
      })
    })
  }
}

function setTableRefSelection(id: string, select: boolean) {
  const target = result.value.find(item => item.id === id)
  if (target) {
    tableRef.value.toggleRowSelection(target, select)
  }
}

watch(
  props.bind,
  () => {
    props.bind.forEach(id => {
      setTableRefSelection(id, true)
    })
  },
  {
    immediate: true
  }
)

watch(
  searchKeyWord,
  () => {
    if (!searchKeyWord.value) {
      result.value = []
      moreData.value = true
      pageNum.value = 1
      lastSearchKeyWord.value = ''

      handleSearch()
    }
  },
  {
    immediate: true
  }
)

function handleSelectionChange(selection: PostDetailData[]) {
  const result = [...props.selected]

  selection.forEach(item => {
    if (item && result.findIndex(post => post.positionId === item.id) === -1) {
      result.push({
        positionId: item.id,
        positionName: item.positionName,
        positionCode: '',
        brief: 0,
        expireTime: null,
        timeLimit: null,
        id: ''
      })
    }
  })

  emit('selectionChange', result)
}

function onSelect(selected: PostDetailData[], row: PostDetailData) {
  const index = selected.findIndex(item => item && item.id === row.id)

  if (index === -1) {
    const _index = props.selected.findIndex(item => item.positionId === row.id)
    if (_index !== -1) {
      emit('removeSelect', _index)
    }
  }
}

function onSearch() {
  if (lastSearchKeyWord.value !== searchKeyWord.value) {
    pageNum.value = 1
    result.value = []
    moreData.value = true
    handleSearch()
  }
}

defineExpose({
  toggleRowSelection: setTableRefSelection
})

handleSearch()
</script>

<style scoped lang="less">
.search-input {
  width: 100% !important;
}

.post-table {
  margin-top: 10px;
  .post-name {
    display: inline-block;
    width: 200px;
    text-align: left;
  }
  :deep(.cell.el-tooltip) {
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-table__cell) {
    border: none;
  }

  :deep(.el-table__inner-wrapper::before) {
    height: 0;
  }
}
</style>
