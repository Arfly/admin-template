import { getByAxios } from './baseApi'
import { BaseResData, BASE_URL } from './constant'
import { SystemListItem } from './system'

const PUBLIC_BASIC_URL = `${BASE_URL}/public`

// 获取当前用户信息
interface UserInfo {
  id: string
  name: string
  uniformId: string
  userCode: string
  mobile: string
  admin: boolean
  systemId: string
  systemCode: string
  loginType: string
}
export function getUserInfo() {
  return getByAxios<BaseResData<UserInfo>>(`${PUBLIC_BASIC_URL}/userinfo`)
}

// 获取当前用户前端资源列表
export function permissions(systemCode: string) {
  return getByAxios<BaseResData<string[]>>(`${PUBLIC_BASIC_URL}/user-html-resources`, {
    systemCode
  })
}

// 查询全部系统
export function getAllSystem() {
  return getByAxios<BaseResData<SystemListItem[]>>(`${PUBLIC_BASIC_URL}/all-system`)
}
