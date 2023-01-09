/* eslint-disable no-undef */
import EllipsisTextVue from '@/views/log/components/EllipsisText.vue'
import { mount } from '@vue/test-utils'

test('EllipsisText.vue', () => {
  const wrapper = mount(EllipsisTextVue)
  expect(wrapper.text()).toContain('1111')
})
