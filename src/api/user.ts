/**
 * @desc:   用户模块api
 * @author: zengqingkai
 * @create: 2022-08-23 10:03:00
 */

import { getByAxios, postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL, ResDataWithPageInfo } from './constant'
import { Brief, CredentialsType, Gender, Source, Status, TimeLimit } from './types'
const USER_BASIC_URL = `${BASE_URL}/user`

// 用户列表
interface UserListReq {
  keyword?: string
  status?: Status
  source?: Source
  organizationId?: string
  pageNum: number
  pageSize: number
  orgRelDisable?: number // 是否是组织失效用户，0-否，1-是
}

interface OrdinaryUserEditableData {
  realName: string
  gender: Gender
  email: string
  remark: string
  credentialsType: CredentialsType
  credentialsCode: string
}

export interface UserListItem {
  id: string
  mobile: string
  name: string
  organizationName: string
  parentOrganizationName: string
  realName: string
  source: Source
  status: Status
  userCode: string
}

export function getUserList(data: UserListReq) {
  return postByAxios<ResDataWithPageInfo<UserListItem>>(`${USER_BASIC_URL}/list`, data)
}

// 关联组织
export function bindOrg(data: {
  userId: string
  orgList: {
    id: string
    major: number
  }[]
}) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/bind-org`, data)
}

// 检查用户手机号是否已存在
export function checkPhoneExist(data: { userId?: string; mobile: string }) {
  return postByAxios<BaseCheckResData>(`${BASE_URL}/user/check-mobile`, { ...data })
}

// 用户批量调整组织
export function bindUsersToOrg(data: { orgId: string; ids: string[] }) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/batch-bind-org`, data)
}

// 用户新增
export interface NewUserData extends OrdinaryUserEditableData {
  organizationId: string
  pwd: string
  uniformId?: string
  mobile: string
  name: string
}
export function createUser(data: NewUserData) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/save`, data)
}

// 管理员-用户编辑
export interface EditUserParamsForSuper extends OrdinaryUserEditableData {
  id: string
  uniformId: string // 省同步ID
  mobile: string
  name: string
}
export function editUserForSuper(data: EditUserParamsForSuper) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/edit`, data)
}

// 普通用户-用户编辑
export function editSelfUser(data: OrdinaryUserEditableData) {
  return postByAxios<BaseCheckResData>(`${BASE_URL}/public/user-modification`, data)
}

// 检查省认证ID是否重复
export function checkUniformIdExist(data: { uniformId: string; userId?: string }) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/check-uniform-id`, {
    ...data
  })
}

// 获取用户已关联组织
export interface UserRelationOrgItem {
  organizationId: string
  organizationName: string
  parentOrganizationName: string
  major: number
  organizationSource: number
}
export function getRelationOrgByUser(userId: string) {
  return postByAxios<BaseResData<UserRelationOrgItem[]>>(`${USER_BASIC_URL}/organization/existed`, {
    userId
  })
}

// 用户列表-分页
export function searchUser(data: {
  keyword?: string
  status?: Status
  source?: Source
  pageSize: number
  pageNum: number
}) {
  return postByAxios<ResDataWithPageInfo<UserListItem>>(`${USER_BASIC_URL}/search`, data)
}
// 用户详情
export interface UserDetail extends EditUserParamsForSuper {
  source: Source
  status: Status
  userCode: string
}
export function getUserDetail(userId: string) {
  return postByAxios<BaseResData<UserDetail>>(`${USER_BASIC_URL}/detail`, {
    userId
  })
}

// 用户启停用 : 要启用 或 要停用
export function userSwitch(data: { userId: string; status: boolean }) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/user-switch`, data)
}
// 获取用户已关联岗位
export interface UserBindPostItem {
  positionId: string
  id: string
  positionName: string
  positionCode?: string
  brief: Brief
  expireTime: string
  timeLimit: TimeLimit
}
export function userPostList(userId: string) {
  return postByAxios<BaseResData<UserBindPostItem[]>>(`${USER_BASIC_URL}/position/existed`, {
    userId
  })
}
// 获取用户已关联角色
export function userRoleList(data: { userId: string }) {
  return postByAxios<
    BaseResData<{
      roleId?: number
      roleName?: string
    }>
  >(`${USER_BASIC_URL}/role/existed`, data)
}

// 修改用户密码
export function modifyUserPwd(data: { pwd: string; newPwd: string }) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/modify-pwd`, data)
}
// 重置用户密码
export function resetPwd(data: { userId: string; pwd: string }) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/reset-pwd`, data)
}

// 关联岗位
export function bindPosition(data: {
  userId: string
  positionList: {
    id: string
    brief: Brief
    timeLimit: TimeLimit
  }[]
}) {
  return postByAxios<BaseCheckResData>(`${USER_BASIC_URL}/bind-position`, data)
}

// 检查用户名是否已存在
export function checkNameExist(data: { name: string; userId?: string }) {
  return postByAxios<BaseCheckResData>(`${BASE_URL}/user/check-name`, { ...data })
}

// 延长token使用时间
export function refreshToken() {
  return getByAxios(`${BASE_URL}/public/token-refresh`)
}
