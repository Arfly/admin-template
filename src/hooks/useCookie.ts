/**
 * @desc:   cookie操作
 * @author: liaowanquan
 * @create: 2022-04-18 14:43:07
 */

import Cookies from 'js-cookie'

const OPS = {
  expires: null,
  path: '/',
  domain: ''
}

export interface Cookie extends Record<string, string> {
  systemCode: string
  token: string
  loginType: string
  systemId: string
  userLevel: string
  username: string
}

type CookieGetReturnType<T> = T extends string ? string : Cookie

export default function useCookie() {
  // 獲取
  function getCookie<T>(key?: T) {
    return (typeof key === 'string' ? Cookies.get(key) : Cookies.get()) as CookieGetReturnType<T>
  }
  // 設置
  function setCookie(key: string, value: string, option = {}) {
    Cookies.set(key, value, { ...OPS, ...option })
  }
  // 移除
  function remove(key, option = {}) {
    return Cookies.remove(key, { ...OPS, ...option })
  }
  return {
    getCookie,
    setCookie,
    remove
  }
}
