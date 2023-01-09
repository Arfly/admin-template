/**
 * @desc:   组织管理模块api
 * @author: fei.han
 * @create: 2022-10-2
 */

import { postByAxios } from './baseApi'
import { BaseResData, BaseCheckResData, BASE_URL, ResDataWithPageInfo } from './constant'
import { Source, Status, UnitTypeCode } from './types'
const ORG_BASE_URL = `${BASE_URL}/uc`

// 删除组织
export function deleteOrg(id: string) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-delete`, {
    id
  })
}

// 平铺组织列表
export interface ListOrgData {
  pageSize: number
  pageNum: number
  unitTypeCode: UnitTypeCode
  level: number
  source: Source
  id: string
}

export interface OrgListItem {
  id: string
  name: string
  unitType: string
  parentName: string
  level: number
  source: Source
  active: number
  description: string
  unitTypeCode: UnitTypeCode
}
export function getOrgList(data?: ListOrgData) {
  return postByAxios<ResDataWithPageInfo<OrgListItem>>(`${ORG_BASE_URL}/organization-list`, data)
}

// 新增组织
interface CreateOrgData {
  name: string
  unitTypeCode: UnitTypeCode
  parentId: string
  level: number
  creditCode: string
  description: string
  unitType: string
  parentIds: string
  orgDisplayPath: string
}

export function createOrg(data: CreateOrgData) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-expansion`, data)
}

// 查看组织详情
export interface OrgDetailData {
  unitTypeCode: UnitTypeCode
  name: string
  id: string
  code: string
  parentName: string
  level: number
  unitType: string
  source: Source
  orgDisplayPath: string
  description: string
  creditCode: string
}
export function getOrgDetail(organizationId: string) {
  return postByAxios<BaseResData<OrgDetailData>>(`${ORG_BASE_URL}/organization-detail`, {
    organizationId
  })
}

// 查看组织已关联用户列表
export interface OrgBindUserItem {
  id: string
  realName: string
  mobile: string
}
export function getRelationUserByOrg(organizationId: string) {
  return postByAxios<BaseResData<OrgBindUserItem[]>>(`${ORG_BASE_URL}/organization-user-detail`, { organizationId })
}

// 根据组织名称模糊搜索组织树
interface OrgTreeNode {
  id: string
  parentId: string
  parentName: string
  parentNameNamePath: string
  children: OrgTreeNode[]
  name: string
  active: number
  level: number
  source: Source
  unitTypeCode: UnitTypeCode
}
export function searchOrgTreeByName(name: string) {
  return postByAxios<BaseResData<OrgTreeNode[]>>(`${ORG_BASE_URL}/organization-tree-search`, {
    name
  })
}

// 检查组织名称是否已存在
export function isOrgNameExist(data: { name: string; parentId: string }) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-check-name`, data)
}

// 组织关联用户
export function relateUser(data: { organizationId: string; userIds: string[] }) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-relation-user`, data)
}

// 组织启用停用
export function changeOrgStatus(data: { id: string; targetStatus: number }) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-status-modification`, data)
}

// 编辑组织
interface UpdateOrgData {
  id: string
  name: string
  unitTypeCode: UnitTypeCode
  description: string
  unitType: string
  orgDisplayPath: string
}
export function updateOrg(data: UpdateOrgData) {
  return postByAxios<BaseCheckResData>(`${ORG_BASE_URL}/organization-confirmation`, data)
}

// 默认加载组织树
export interface DefaultOrgTreeItem {
  id: string
  level: number
  name: string
  parentId: string
  parentName: string
  unitTypeCode: UnitTypeCode
  status: Status
  parentNameNamePath: string
  source: Source
  parentTreeNode?: DefaultOrgTreeItem
  children: DefaultOrgTreeItem[]
}
export function getDefaultOrgTree(status?: Status) {
  return postByAxios<BaseResData<DefaultOrgTreeItem[]>>(`${ORG_BASE_URL}/organization-tree`, {
    status
  })
}
