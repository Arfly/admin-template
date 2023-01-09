import { ref } from 'vue'

export function useLoadMore(requestFn: () => Promise<void>) {
  const pageNum = ref(1)
  const pageSize = ref(20)
  const loading = ref(false)
  const moreData = ref(true)

  return {
    pageNum,
    pageSize,
    moreData,
    loading,
    loadMore: async () => {
      if (moreData.value) {
        pageNum.value = pageNum.value + 1
        loading.value = true
        await requestFn()
        loading.value = false
      }
    }
  }
}
