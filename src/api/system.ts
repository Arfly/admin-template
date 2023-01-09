/**
 * @desc:   登录模块api
 * @author: zengqingkai
 * @create: 2022-07-27 15:05:00
 */

import { postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL, ResDataWithPageInfo } from './constant'
import { Status, SystemCmd } from './types'

const SYS_BASE_URL = `${BASE_URL}/system`

// 系统信息列表

export interface SystemListItem {
  adminId: string
  name: string
  redirectUrl: string
  systemCode: string
  systemId: string
  adminName: string
  contactCode: string
  contractor: string
  contractorContact: string
  contractorPhone: string
  createBy: string
  createTime: string
  deleted: number
  desc: string
  id: string
  status: SystemCmd
  unitBelong: string
  unitBelongContact: string
  unitBelongContactPhone: string
  updateBy: string
  updateTime: string
}
export function systemList(data: { pageSize: number; pageNum: number; name: string }) {
  return postByAxios<ResDataWithPageInfo<SystemListItem>>(`${SYS_BASE_URL}/list`, data)
}
// 查看系统
export interface SysDetail {
  id: string
  name: string
  code: string
  contactCode: string
  adminName: string
  unitBelong: string
  unitBelongContact: string
  unitBelongContactPhone: string
  contractor: string
  contractorContact: string
  contractorPhone: string
  desc: string
  status: Status
  adminPwd?: string
  redirectUrl: string
}
export function getSystemDetail(id: string) {
  return postByAxios<BaseResData<SysDetail>>(`${SYS_BASE_URL}/detail`, { id })
}

// 新增系统
interface SysData {
  name: string
  adminName: string
  adminPwd: string
  contactCode: string
  redirectUrl: string
  unitBelong?: string
  unitBelongContact?: string
  unitBelongContactPhone?: string
  contractor?: string
  contractorContact?: string
  contractorPhone?: string
  desc?: string
}
export function systemAdd(data: SysData) {
  return postByAxios<BaseCheckResData>(`${SYS_BASE_URL}/save`, data)
}

// 编辑系统
interface SysEditData {
  id: string
  name: string
  code?: string
  contactCode: string
  adminName: string
  adminPwd?: string
  unitBelong: string
  redirectUrl: string
  unitBelongContact?: string
  unitBelongContactNum?: string
  contractor?: string
  contractorContact?: string
  contractorPhone?: string
  desc?: string
}
export function systemEdit(data: SysEditData) {
  return postByAxios<BaseCheckResData>(`${SYS_BASE_URL}/edit`, data)
}

// 系统开关
export function systemSwitch(data: { id: string; command: SystemCmd }) {
  return postByAxios<BaseCheckResData>(`${SYS_BASE_URL}/switch`, data)
}
