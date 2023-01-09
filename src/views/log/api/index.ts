import { BASE_URL, ResDataWithPageInfo } from '@/api'
import { postByAxios } from '@/api/baseApi'

interface OperationRequestParams {
  moduleId: string
  operateTypeCode: string
  startTime: string
  endTime: string
  operateUserName: string
  operateTarget: string
  pageSize: number
  pageNum: number
}

export interface OperationLogListItem {
  id: string
  moduleName: string
  operateType: string
  operateUserName: string
  operateTarget: string
  operateContent: string
  systemId: string
  systemName: string
  createTime: string
  moduleId: string
  operateCategory: string
  operateCategoryCode: string
  operateTime: string
  operateTypeCode: string
  systemCode: string
}
export function getOperationLog(data: OperationRequestParams) {
  return postByAxios<ResDataWithPageInfo<OperationLogListItem>>(`${BASE_URL}/uc/operation-log-list`, data)
}

// 系统日志查询
interface GetSystemParams {
  startTime: string
  endTime: string
  level?: string
  logger?: string
  thread?: string
  info?: string
  pageSize: string
  pageNum: string
}
export interface SysLogListItem {
  ip: string
  logTime: string
  level: string
  thread: string
  logger: string
  info: string
}
export function getSystemList(data: GetSystemParams) {
  return postByAxios<ResDataWithPageInfo<SysLogListItem[]>>(`${BASE_URL}/uc/system-log-list`, data)
}
