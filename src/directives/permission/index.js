/**
 * @Description:自定义权限指令
 * @Author: zengqingkai
 * @Date: 2022/8/29
 */
import { useStore } from '@/store'

export const permission = {
  mounted(el, binding) {
    const { value } = binding
    // const hasPermission = checkPermission(value, binding.instance.$options.name)
    const roles = useStore().getters.getRouters
    const hasPermission = roles.some(role => value.includes(role.meta?.code))
    if (!hasPermission) {
      // eslint-disable-next-line no-param-reassign
      el.style.display = 'none'
    }
  }
}

export const checkPermission = value => {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useStore().getters.getRouters
    const permissionRoles = value
    const hasPermission = roles.some(role => permissionRoles.includes(role))
    return hasPermission
  }

  console.error('权限只支持 v-permission=["add","edit","delete"]')
  return false
}
