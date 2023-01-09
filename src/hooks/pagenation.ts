/**
 * @author fei.han
 * @description 处理通用的分页逻辑
 * @date 2022-09-16
 */

import { ref } from 'vue'

export function usePagination(callback?: () => void) {
  const page = ref({
    pageNum: 1,
    pageSize: 10
  })

  const total = ref(0)

  function resetPage() {
    page.value = {
      pageNum: 1,
      pageSize: 10
    }
  }

  function handleSizeChange(pageSize) {
    page.value.pageSize = pageSize
    if (callback) {
      callback()
    }
  }

  function handleCurrentChange(pageNum) {
    page.value.pageNum = pageNum
    if (callback) {
      callback()
    }
  }
  return {
    total,
    page,
    resetPage,
    handleSizeChange,
    handleCurrentChange
  }
}
