import { postByAxios } from '@/api/baseApi'
import { BaseCheckResData, BaseResData, BASE_URL } from './constant'

// 登录
interface LoginData {
  account: string
  pwd: string
  systemCode: string
}
export function login(data: LoginData) {
  return postByAxios<BaseResData<string | { needCaptcha: boolean }>>(`${BASE_URL}/login/direct-login`, data)
}
// 获取验证码
export function captcha(account: string) {
  return postByAxios<BaseResData<string>>(`${BASE_URL}/login/reset-captcha`, {
    account
  })
}
// 登出
export function logout() {
  return postByAxios<BaseCheckResData>(`${BASE_URL}/logout`)
}
