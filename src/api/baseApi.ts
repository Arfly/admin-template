import axios from '@/hooks/axios'
import { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { SUCCESS_CODE } from './code'

export const apiAxios = <T>(obj: AxiosRequestConfig): Promise<T> =>
  new Promise((resolve, reject) => {
    axios(obj)
      .then(res => {
        const noMsg = ['direct-login']
        const str = res.config.url.slice(res.config.url.lastIndexOf('/') + 1)
        if (res.data.code !== SUCCESS_CODE && noMsg.indexOf(str) === -1) {
          // eslint-disable-next-line new-cap
          ElMessage({ type: 'error', message: res.data.msg })
        }
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })

export function postByAxios<Res>(url, data?: any) {
  return apiAxios<Res>({
    url,
    method: 'post',
    data
  })
}

export function getByAxios<Res>(url, query?: any) {
  return apiAxios<Res>({
    url,
    method: 'get',
    data: query
  })
}
