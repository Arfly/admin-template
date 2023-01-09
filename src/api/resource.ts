/**
 * @desc:   资源api
 * @author: zengqingkai
 * @create: 2022-08-23 11:45:00
 */

import { getByAxios, postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL } from './constant'
import { BindTag, Status } from './types'

const RES_BASE_URL = `${BASE_URL}/uc`

// 前端资源-资源树的查询
export interface ResTreeNode {
  parentName?: string
  resourceId: string
  name: string
  parentId: string
  status: Status
  childrenList: ResTreeNode[]
}

export function getFEResourceTreeBySysID(systemId: string, status?: number) {
  return postByAxios<BaseResData<ResTreeNode[]>>(`${RES_BASE_URL}/page/resource-tree`, {
    systemId,
    status
  })
}

export function getResourceSystemByRoleID(id: string) {
  return postByAxios<
    BaseResData<{
      systemId: string
      systemName: string
    }>
  >(`${RES_BASE_URL}/page/resource-system-by-roleid`, {
    roleId: id
  })
}

export function checkFEResourceRepeat(data: {
  resourceId: string
  resourceCode?: string
  resourceName?: string
  systemId?: string
}) {
  return postByAxios<BaseCheckResData>(`${RES_BASE_URL}/page-resource/repeat-check`, data)
}

// 前端资源-新增
interface CreateFEResourceData {
  systemId: string
  name: string
  type: number
  code: string
  parentId: number
  level: number
  remark: string
  status: Status
  backendResourceIds: string[]
}
export function resourceAdd(data: CreateFEResourceData) {
  return postByAxios<BaseCheckResData>(`${RES_BASE_URL}/page/resource-creation`, data)
}

// 前端资源-编辑资源
export function resourceEdit(data: {
  resourceId: string
  name: string
  remark: string
  status: number
  backendResourceIds: string[]
}) {
  return postByAxios<BaseCheckResData>(`${RES_BASE_URL}/page/resource-modification`, data)
}

// 前端资源-根据id查询资源详情
export interface ResDetailData {
  resourceId: string
  systemId: string
  name: string
  code: string
  remark: string
  relationSystemName: string
  resourceType: number
  parentName: string
  parentId: number
  level: number
  status: Status
  relBackendResourceList: {
    pageResourceId: string
    backendResourceId: string
    backendResourceName: string
    backendResourceCode: string
    link: string
    relationSystemName: string
  }[]
}
export function resourceDetail(id: string) {
  return getByAxios<BaseResData<ResDetailData>>(`${RES_BASE_URL}/page/resource-inquiry`, {
    id
  })
}

// 前端资源-根据角色id查询出带有绑定标识的资源树
interface ResTreeWithTagNode {
  resourceId: number
  name: string
  parentId: number
  status: Status
  bindTag: BindTag
  childrenList: ResTreeWithTagNode[]
}
export function getResourceTreeByRoleId(roleId) {
  return postByAxios<BaseResData<ResTreeWithTagNode[]>>(`${RES_BASE_URL}/page/resource-tree-by-role`, {
    roleId
  })
}

// 前端资源-根据角色id查询资源树
export function resourceByRoleId(id: string) {
  return postByAxios<BaseResData<ResTreeNode[]>>(`${RES_BASE_URL}/page/resource-tree-by-roleid`, {
    roleId: id
  })
}
// 前端资源-根据角色id查询资源树(带绑定标识)
export function getBindResourceByRoleID(id: string) {
  return postByAxios<BaseResData<ResTreeNode[]>>(`${RES_BASE_URL}/page/resource-list-by-roleid`, {
    roleId: id
  })
}
// 前端资源-根据关键字查询资源树
export interface BackendResourceDetail {
  resourceId: string
  systemId: string
  name: string
  code: string
  remark: string
  relationSystemName: string
  link: string
  status: Status
  relPageResourceList: RelPageResourceListItem[]
}
export interface RelPageResourceListItem {
  backendResourceCode: string
  backendResourceId: string
  backendResourceName: string
  link: string
  pageResourceId: string
  relationSystemName: string
}
export function resourcePrecisionSearch(keyword: string) {
  return postByAxios<BaseResData<BackendResourceDetail[]>>(`${RES_BASE_URL}/backend/resource-precision-search`, {
    keyword
  })
}

// 后端资源-新增
export function createBackendResource(data: {
  name: string
  code: string
  remark: string
  link: string
  systemId: string
  status: number
}) {
  return postByAxios<BaseCheckResData>(`${RES_BASE_URL}/backend/resource-creation`, data)
}

// 后端资源-根据资源id查询详情
export function getBackendResourceDetail(id: string) {
  return getByAxios<BaseResData<BackendResourceDetail>>(`${RES_BASE_URL}/backend/resource-inquiry`, {
    id
  })
}

// 后端资源-编辑资源
export function updateBackendResource(data: {
  resourceId: string
  name: string
  remark: string
  link: string
  status: number
}) {
  return postByAxios<BaseCheckResData>(`${RES_BASE_URL}/backend/resource-modification`, data)
}

// 后端资源-资源列表
export interface BackendListItem {
  resourceId: string
  name: string
}
export function getBackendResourceList(data: { name?: string; systemId?: string }) {
  return postByAxios<BaseResData<BackendListItem[]>>(`${RES_BASE_URL}/backend/resource-list`, data)
}

export interface ResourcePropData {
  parentId: string
  parentName: string
  level: number
  type: number
  status: number
  laborType: string
  relBackendResourceList: []
  resourceId: string
}
