/**
 * @Description:
 * @Author: zengqingkai
 * @Date: 2022/7/27
 */
import { apiAxios } from '@/api/baseApi'
import { BASE_URL } from './constant'

// 移除用户的权限
export function removeUserPower(data) {
  return apiAxios({
    url: `${BASE_URL}/rio/user-permission/role-reduction`,
    method: 'post',
    data
  })
}
// 查询资源列表
export function getPower(data) {
  return apiAxios({
    url: `${BASE_URL}/rio/path-resource`,
    method: 'get',
    data
  })
}
// 查询资源列表
export function getRoles() {
  return apiAxios({
    url: `${BASE_URL}/rio/roles`,
    method: 'get'
  })
}

// 增加指定用户资源
export function saveUserPowerAll(data) {
  return apiAxios({
    url: `${BASE_URL}/rio/user-permission/role-confirmation`,
    method: 'post',
    data
  })
}
