import { computed } from 'vue'
import { useStore } from '@/store'

export function useStoreHook() {
  const store = useStore()
  const userLevel = computed(() => store.getters.getUserLevel)

  const isSuperUser = computed(() => store.getters.getUserLevel === 'super')

  const systemId = computed(() => store.getters.getSystemId)

  return {
    userLevel,
    isSuperUser,
    systemId
  }
}
