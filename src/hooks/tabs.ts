import { UserListItem } from '@/api'
import router from '@/router'
import { useStore } from '@/store'
import { LocationQuery, RouteRecordName, RouteRecordRaw } from 'vue-router'
const store = useStore()

/**
 *
 * @param name 路由的名字或path
 * @param query 路由的查询参数
 * @description 根据路由的名字或路径设置tabs组件当前显示的标签
 * @author fei.han
 */

export type CustomQuery = LocationQuery & {
  data?: UserListItem[]
}

function treeToArr(route: RouteRecordRaw, allRoutes: RouteRecordRaw[]) {
  if (route.children && route.children.length) {
    route.children.forEach(child => treeToArr(child, allRoutes))
  } else {
    allRoutes.push(route)
  }
}
export function activeTab(name: RouteRecordName, query?: CustomQuery) {
  const routes = router.getRoutes()
  const allRoutes = []
  routes.forEach(route => treeToArr(route, allRoutes))
  const matchRoute = routes.find(route => route.name === name || route.path === name)
  if (matchRoute) {
    const route = {
      ...matchRoute,
      name
    }
    if (query) {
      store.dispatch('setActiveTab', query.data ? { ...route, data: query.data } : { ...route, query })
    } else {
      store.dispatch('setActiveTab', route)
    }
  }
}

export function closeCurTab() {
  store.dispatch('closeCurTab')
}
