import { getUserInfo, logout, permissions, SUCCESS_CODE } from '@/api'
import { cleanSystem } from '@/common/common'
import Layout from '@/components/layout/Index.vue'
import { PERMISSIONS } from '@/config/permission'
import useCookie from '@/hooks/useCookie'
import { ElMessage } from 'element-plus'
import { decode, encode } from 'js-base64'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routerMatch } from '../hooks/permission'
import { store } from '../store'
import { constantRouterMap, lastRouterMap, layoutMap, logRouterMap } from './router'

const { setCookie, getCookie } = useCookie()

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRouterMap],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const jwt = sessionStorage.getItem('jwt') || ''
  let search
  if (import.meta.env.MODE === 'development') {
    search = getLoginSearch(location.href)
  } else {
    search = getSearch(location.search)
  }
  // 如果检测到rebound是1并且有回跳地址时直接回跳
  if (search.rebound === '1') {
    const backUrl = getCookie('backurl')
    if (backUrl) {
      location.href = decodeURIComponent(backUrl.toString())
      return false
    }
  }
  setCookie('systemCode', search.systemCode || 'user-centre')
  if (to.path === '/logout') {
    if (search.systemCode && search.token) {
      setCookie('token', search.token)
      await logout()
      await store.dispatch('clearUser')
      if (search.backurl) setCookie('backurl', search.backurl)
      if (cleanSystem(search)) {
        location.href = `${location.origin}/user-centre/?systemCode=${search.systemCode}`
      }
      return false
    }
    ElMessage.error('退出必须携带token和systemCode!!!')
    return false
  }

  if (to.path === '/login') {
    jwt ? next('/') : next()
    await tokenTestimonials(search.token)
  } else {
    if (from.name === 'Login' && !jwt) {
      next(false)
      return false
    }
    if (jwt) {
      if (store.getters.routers.length === 0) {
        const token = JSON.parse(decode(jwt))

        let permissions = token.permissions
        const cookie = getCookie()
        if (import.meta.env.MODE === 'development') {
          permissions =
            cookie.userLevel === 'super' ? Object.keys(PERMISSIONS).map(key => PERMISSIONS[key]) : token.permissions
        }

        // 调用权限匹配的方法
        routerMatch(permissions, layoutMap).then(res => {
          // 将匹配出来的权限列表进行addRoutes
          const routers = [
            ...res[0],
            ...lastRouterMap,
            {
              path: '/',
              hidden: true,
              redirect: {
                name:
                  res[0].filter(item => item.name)[0]?.children[0]?.name ||
                  res[0].filter(item => item.name)[0]?.name ||
                  'NotPurview'
              }
            }
          ].concat(cookie.userLevel === 'super' ? logRouterMap : [])

          router.addRoute({
            path: '/',
            name: 'Layout',
            component: Layout,
            children: routers
          })
          store.dispatch('setRouters', routers)
          next({ ...to, replace: true })
        })
      } else {
        next()
      }
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 根据拿到的token做鉴权处理
 */
export async function tokenTestimonials(token) {
  if (token && token !== sessionStorage.getItem('token')) {
    setCookie('token', token)
    try {
      const res = await Promise.all([getUserInfo(), permissions('user-centre')])
      if (res[0].code === SUCCESS_CODE) {
        const users = {
          permissions: res[1].data,
          ...res[0].data
        }
        localStorage.setItem('accessToken', JSON.stringify({ userinfo: res[0].data }))
        sessionStorage.setItem('jwt', encode(JSON.stringify(users)))
        store.dispatch('setUser', users)
        // 跳转至其他页面
        location.href = `${location.origin}/user-centre/`
        let level = 'general'
        if (res[0].data.admin) {
          if (res[0].data.systemCode === 'user-centre') {
            level = 'super'
          } else {
            level = 'admin'
          }
        }
        setCookie('loginType', res[0].data.loginType)
        setCookie('systemId', res[0].data.systemId || '')
        setCookie('userLevel', level)
        setCookie('username', res[0].data.name || '超级管理员')
      } else {
        alert('token不合法或者失效')
      }
    } catch (err) {
      alert('接口异常,请联系管理员')
      return false
    }
  }
}

/**
 * 解析页面链接，返回链接中查询参数
 * @param href 页面链接
 */
export function getLoginSearch(href: string) {
  const searchSymbolIndex = href.indexOf('?')
  const hashSymbolIndex = href.indexOf('#')
  const str =
    hashSymbolIndex > searchSymbolIndex
      ? href.slice(searchSymbolIndex + 1, hashSymbolIndex)
      : href.slice(searchSymbolIndex + 1)
  const arr = str.split('&')
  const obj = {}
  for (let i = 0; i < arr.length; i++) {
    const newArr = arr[i].split('=')
    obj[newArr[0]] = newArr[1]
  }
  return obj as { [key: string]: string | number | boolean }
}
const getSearch = search => {
  const str = search.substr(1)
  const arr = str.split('&')
  const obj = {}
  for (let i = 0; i < arr.length; i++) {
    const newArr = arr[i].split('=')
    obj[newArr[0]] = newArr[1]
  }
  return obj
}
export default router
