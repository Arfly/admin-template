import { Directive } from 'vue'

export const loadmore: Directive = {
  mounted(el, binding) {
    const selectWrap = el.querySelector('.el-scrollbar__wrap')

    selectWrap.addEventListener('scroll', function () {
      console.log('scroll')
      const sign = 0.5
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
}
