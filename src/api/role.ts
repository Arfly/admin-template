import { postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL, ResDataWithPageInfo } from './constant'
import { Status, TargetStatus } from './types'

/**
 * @Description: 角色api
 * @Author: zengqingkai
 * @create: 2022-08-23 11:20:00
 */

const ROLE_BASE_URL = `${BASE_URL}/uc/role-`

// 角色列表
export interface RoleListItem {
  roleName: string
  status: Status
  id: string
  desc: string
  systemId: string
  systemName: string
}

export function requestRoleList(data: { roleName: string; systemId: number; pageSize: number; pageNum: number }) {
  return postByAxios<
    BaseResData<{
      total: number
      pageSize: number
      list: RoleListItem[]
    }>
  >(`${ROLE_BASE_URL}list`, data)
}

export function getRoleByRoleName(data: { roleName: string; pageSize: number; pageNum: number }) {
  return postByAxios<ResDataWithPageInfo<RoleListItem>>(`${ROLE_BASE_URL}search`, data)
}

// 角色详情
export interface RoleDetail {
  createBy: string
  desc: string
  id: string
  lastUpdateBy: string
  roleCode: string
  roleName: string
  status: Status
  systemId: string
}
export function getRoleDetail(roleId: string) {
  return postByAxios<BaseResData<RoleDetail>>(`${ROLE_BASE_URL}detail`, {
    roleId
  })
}
// 新增角色
export function roleAdd(data: { roleName: string; systemId: string; desc?: string }) {
  return postByAxios<BaseCheckResData>(`${ROLE_BASE_URL}expansion`, data)
}

// 编辑角色
export function roleEdit(data: { id: string; roleName: string; desc: string; systemId: string }) {
  return postByAxios<BaseCheckResData>(`${ROLE_BASE_URL}confirmation`, data)
}

// 角色开关
export function roleSwitch(data: { roleId: number; targetStatus: TargetStatus }) {
  return postByAxios<BaseCheckResData>(`${ROLE_BASE_URL}status-modification`, data)
}

// 角色关联资源
export function roleResource(data: { roleId: string; resourceIds: string[] }) {
  return postByAxios<BaseCheckResData>(`${ROLE_BASE_URL}relation-resource`, data)
}

export function getRoleListByPostId(positionId: string) {
  return postByAxios<BaseResData<RoleListItem[]>>(`${ROLE_BASE_URL}list-position`, {
    positionId
  })
}
