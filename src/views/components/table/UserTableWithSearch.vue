<template>
  <SearchInput
    v-model="keyword"
    class="w-100"
    style="padding: 8px 0"
    @search="onSearch"
  />
  <el-table
    id="test"
    ref="userTableRef"
    v-loading="loading"
    v-loadmore="loadMore"
    :show-header="false"
    :empty-text="'请输入用户姓名进行搜索'"
    :data="users"
    height="380px"
    :border="false"
    @selection-change="handleSelectionChange"
    @select="onSelect"
  >
    <el-table-column
      type="selection"
      width="25"
      :selectable="checkSelectable"
    />
    <el-table-column
      type="index"
      width="50"
    />
    <el-table-column label="用户名称">
      <template #default="scope">
        {{ `${scope.row.realName} ${ProtectPhone(scope.row.mobile)}` }}
      </template>
    </el-table-column>
    <template
      v-if="!moreData"
      #append
    >
      <p class="no-more-data">无更多数据</p>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import { PostDetailData, searchUser, SUCCESS_CODE, UserListItem } from '@/api'
import SearchInput from '@/components/input/SearchInput.vue'
import { useFilter } from '@/hooks/filter'
import { useLoadMore } from '@/hooks/tableLoadMore'
import { ElMessage } from 'element-plus'
import { nextTick, ref, watch } from 'vue'

const keyword = ref('')
const lastSearchKeyWord = ref('')

const users = ref<UserListItem[]>([])
const userTableRef = ref()
const props = defineProps<{
  bindUserIds: string[]
  selected: UserListItem[]
}>()

const checkSelectable = row => !props.bindUserIds.find(id => id === row.id)
const emit = defineEmits(['selectionChange', 'removeSelect'])

const { ProtectPhone } = useFilter()

const getUserData = async () => {
  if (keyword.value) {
    const { code, data } = await searchUser({
      keyword: keyword.value,
      status: 1,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    if (code === SUCCESS_CODE) {
      lastSearchKeyWord.value = keyword.value
      users.value = [...users.value, ...data.list]
      nextTick(() => {
        props.bindUserIds.forEach(id => {
          setChecked(id, true)
        })

        props.selected.forEach(item => {
          setChecked(item.id, true)
        })
      })

      moreData.value = data.hasNextPage
      if (!data.list.length) {
        ElMessage.info('暂无搜索结果')
      }
    }
  }
}
const { pageNum, pageSize, loading, moreData, loadMore } = useLoadMore(getUserData)
watch(
  keyword,
  () => {
    if (!keyword.value) {
      users.value = []
      moreData.value = true
      pageNum.value = 1
      lastSearchKeyWord.value = ''
    }
  },
  {
    immediate: true
  }
)

function setChecked(id: string, checked: boolean) {
  console.log()
  const user = users.value.find(item => item.id === id)
  if (user) {
    userTableRef.value.toggleRowSelection(user, checked)
  }
}

const handleSelectionChange = (val: UserListItem[]) => {
  emit('selectionChange', val)
}

function onSelect(selected: PostDetailData[], row: PostDetailData) {
  const index = selected.findIndex(item => item && item.id === row.id)
  if (index === -1) {
    const _index = props.selected.findIndex(item => item.id === row.id)
    if (_index !== -1) {
      emit('removeSelect', _index)
    }
  }
}

function onSearch() {
  if (lastSearchKeyWord.value !== keyword.value) {
    pageNum.value = 1
    users.value = []
    moreData.value = true
    getUserData()
  }
}

defineExpose({
  setChecked
})
</script>

<style scoped lang="less">
:deep(.el-table__empty-text) {
  width: 55%;
}
</style>
