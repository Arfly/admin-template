/**
 * @desc:   岗位模块api
 * @author: fei.han
 * @create: 2022-08-23 10:03:00
 */

import { postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL, ResDataWithPageInfo } from './constant'
import { Status, TargetStatus } from './types'
const POST_BASE_URL = `${BASE_URL}/uc/position-`

// 岗位列表
export interface PostListItem {
  id: string
  positionName: string
  positionCode: string
  desc: string
  lastUpdateTime: string
  lastUpdateBy: string
  status: Status
}
export function postList(data: { positionName: string; pageSize: number; pageNum: number; organizationId: string }) {
  return postByAxios<ResDataWithPageInfo<PostListItem>>(`${POST_BASE_URL}list`, data)
}
// 岗位列表-分页
export function postOption(data: { positionName: string; pageSize: number; pageNum: number }) {
  return postByAxios<ResDataWithPageInfo<PostDetailData>>(`${POST_BASE_URL}search`, data)
}
// 岗位详情
export interface PostDetailData {
  positionName: string
  desc: string
  status: Status
  createBy: string
  deleted: boolean
  department: string
  deptCode: string
  id: string
  lastUpdateBy: string
}
export function postDetail(positionId: string) {
  return postByAxios<BaseResData<PostDetailData>>(`${POST_BASE_URL}detail`, {
    positionId
  })
}
// 新增岗位
export function postAdd(data: { positionName: string; desc: string; organizationIds: string[] }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}expansion`, data)
}
// 编辑岗位
export function postEdit(data: { id: string; positionName: string; desc: string; organizationIds: string[] }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}confirmation`, data)
}
// 岗位启用停用
export function postSwitch(data: { positionId: number; targetStatus: TargetStatus }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}status-modification`, data)
}
// 关联角色
export function postRole(data: { roleIds: string[]; positionId: string }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}relation-role`, data)
}
// 查看岗位关联角色详情
export interface PostBindRoleItem {
  id: string
  roleName: string
  roleCode: string
}
export function getPostBoundRole(positionId: string) {
  return postByAxios<BaseResData<PostBindRoleItem[]>>(`${POST_BASE_URL}role-detail`, {
    positionId
  })
}
// 岗位关联用户
export function bindPostUser(data: { userIds: string[]; positionId: string }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}relation-user`, data)
}
// 查看岗位关联用户详情
export interface PostBindUserListItem {
  id: string
  realName: string
  mobile: string
}
export function postUserDetail(positionId: string) {
  return postByAxios<BaseResData<PostBindUserListItem[]>>(`${POST_BASE_URL}user-detail`, {
    positionId
  })
}

// 查看岗位已关联组织列表

export interface PostBindOrgListItem {
  id: string
  name: string
  code: string
  parentName: string
  active: number
}

export function getPostRelatedOrgList(positionId: string) {
  return postByAxios<BaseResData<PostBindOrgListItem[]>>(`${POST_BASE_URL}organization-detail`, {
    positionId
  })
}

export interface UnOrgPostListItem {
  id: number
  positionName: string
  status: Status
  desc: string
}
// 查询无组织岗位列表
interface UnOrgPostList {
  total: number
  pageSize: number
  list: UnOrgPostListItem[]
}
export function getUnorganizedPost(data: { positionName: string; pageSize: number; pageNum: number }) {
  return postByAxios<BaseResData<UnOrgPostList>>(`${POST_BASE_URL}list-unorganized`, data)
}

// 检查岗位名称是否已存在
export function checkPostNameExist(data: { positionName: string }) {
  return postByAxios<BaseCheckResData>(`${POST_BASE_URL}check-name`, data)
}
