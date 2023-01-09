import { ResPageData } from './common'

export interface BaseResData<T> {
  code: string
  msg?: string
  data?: T
}

export type BaseCheckResData = BaseResData<boolean>

export type ResDataWithPageInfo<ItemData> = BaseResData<ResPageData<ItemData>>

export const BASE_URL = import.meta.env.VITE_BASE_URL
