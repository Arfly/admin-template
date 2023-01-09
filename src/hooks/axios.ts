/* eslint-disable no-param-reassign */
/**
 * https://github.com/axios/axios
 * @desc:   网络请求封装
 * @author: ducongni<10721>
 * @create: 2022-06-29 10:50:00
 */

import axios, { AxiosRequestConfig } from 'axios'
import router from '@/router'
import { useStore } from '@/store'
import useCookie from '@/hooks/useCookie'
import { TokenTimer } from '@/common/token-timer'
import { needLoadingStatus } from './axios.config'
// token 时钟
const tokenTimer = new TokenTimer()

const { getCookie, remove } = useCookie()

const store = useStore()
interface Config extends AxiosRequestConfig {
  crossDomain: boolean
}
// 创建axios实例
const http = axios.create({
  // 允许携带cookie
  withCredentials: false,
  crossDomain: true
} as Config)

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 判断是否存在token 如果有的话，则每个http header加上token
    const cookie = getCookie()
    if (cookie.token) {
      config.headers.Authorization = cookie.token
    }
    if (config.method === 'get') {
      config.params = config.data
      delete config.data
    }

    // 请求本地资源时拦截
    if (config.url.startsWith('/jsons/')) {
      config.url = import.meta.env.VUE_APP_PUBLIC_PATH + config.url.substring(1)
    } else {
      config.url = `/api-proxy${config.url}`
    }

    if (cookie.username) {
      tokenTimer.log(cookie.username)
    }

    if (needLoadingStatus(config.url) && store) {
      store.dispatch('load', true)
    }

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
http.interceptors.response.use(
  // 请求成功
  res => {
    if (store && needLoadingStatus(res.config.url)) {
      store.dispatch('load', false)
    }
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res)
  },

  // 请求失败
  error => {
    if (store) {
      store.dispatch('load', false)
    }

    const { response } = error

    if (response) {
      errorHandler(response)
      return Promise.reject(response)
    }
    // 处理断网的状态
    if (window.navigator.onLine) {
      return Promise.reject(error)
    }
  }
)

// 错误处理
const errorHandler = response => {
  const code = response.status
  if (code === 401) {
    store.dispatch('clearUser')
    router.replace('/login')
    sessionStorage.clear()
    remove('token')
    localStorage.clear()
  }
}

export default http
