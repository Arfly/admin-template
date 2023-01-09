import { computed } from 'vue'

export function useFilter() {
  return {
    Stuff: computed(() => (value: string | number) => value || '-'),
    Major: computed(() => majorCode => {
      let label = ''
      switch (majorCode) {
        case 1:
          label = '是'
          break
        case 0:
          label = '否'
          break
        default:
          label = '其他'
      }
      return label
    }),
    Gender: computed(() => genderCode => {
      let label = ''
      switch (genderCode) {
        case 1:
          label = '男'
          break
        case 2:
          label = '女'
          break
        default:
          label = '其他'
      }
      return label
    }),
    ProtectPhone: computed(
      // eslint-disable-next-line no-confusing-arrow
      () => phoneNumber => phoneNumber ? phoneNumber.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2') : ''
    )
  }
}
