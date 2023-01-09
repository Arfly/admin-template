import { refreshToken } from '@/api'

interface Scope extends Window {
  setTimeGap?: (time: number) => void
}
/**
 * token刷新时钟，在30分钟内存在请求时，发送token延长请求；
 * 使用localStorage支持多个用户登录系统的情况
 */
export class TokenTimer {
  private store: Storage
  private timeGap: number
  private timer: number
  private logTime: number
  private scope: Scope

  constructor(timeGap = 30 * 60 * 1000) {
    this.store = localStorage
    this.logTime = null
    this.timeGap = timeGap
    this.scope = window ? window : null
    this.scope.setTimeGap = this.setTimeGap.bind(this)
  }

  /**
   *
   * @param userName
   */
  log(userName: string) {
    this.logTime = new Date().getTime()
    if (!this.timer) {
      this.store.setItem(userName, `${this.logTime}`)
      refreshToken()
      console.log('Refresh Token')
      this.timer = setTimeout(() => {
        const refreshTime = this.store.getItem(userName)
        if (this.logTime >= parseInt(refreshTime)) {
          this.store.setItem(userName, `${this.logTime}`)
        }
        this.timer = null
      }, this.timeGap)
    }
  }
  /**
   *
   * @param timeGap 时间秒
   */
  setTimeGap(timeGap: number) {
    console.log('set time gap', timeGap)
    this.timeGap = timeGap * 1000
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
}
