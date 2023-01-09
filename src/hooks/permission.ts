/* eslint-disable no-param-reassign */
import { RouteRecordRaw } from 'vue-router'

/* 处理权限 */
export const hasPermission = (route, role) => {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  }
  return true /* 默认不设权限 */
}

export const filterAsyncRouter = (routerMap, roles) => {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(route, roles)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function filterByPermission(routers) {
  for (let i = 0; i < routers.length; i++) {
    if (!routers[i].meta.permission) {
      routers.splice(i, 1)
      if (routers[i]?.children) filterByPermission(routers[i].children)
      i--
    } else {
      if (routers[i].children) filterByPermission(routers[i].children)
    }
  }
}

/**
 * 根据权限匹配路由
 * @param {array} permission 权限列表（菜单列表）
 * @param {array} asyncRouter 异步路由对象
 */
export function routerMatch(permission, asyncRouter: RouteRecordRaw[]) {
  return new Promise(resolve => {
    const routers = []
    // 创建路由
    function createRouter(permission) {
      // 根据路径匹配到的router对象添加到routers中即可
      permission.forEach(item => {
        // 循环异步路由，将符合权限列表的路由加入到routers中
        asyncRouter.forEach((router: RouteRecordRaw) => {
          if (router.meta.code === item) {
            router.meta.permission = item || '*'
            routers.push(router)
          } else {
            router.children &&
              router.children.forEach((childRouter: RouteRecordRaw) => {
                if (childRouter.meta.code === item) {
                  childRouter.meta.permission = item || '*'
                }
              })
          }
        })
        if (item.children && item.children.length) {
          createRouter(item.children)
        }
      })
    }
    createRouter(permission)
    filterByPermission(routers)
    resolve([routers])
  })
}

/**
 * 获取首次进入页面时，显示的页面路由
 * @param data 原始route数组
 * @return 前端route对象
 */
export function setFormatRouter(data) {
  const formatRouter = arr => {
    let obj
    for (let index = 0; index < arr.length; index++) {
      const ele = arr[index]
      if (ele instanceof Array) {
        obj = formatRouter(ele)
        break
      }
      if (ele.children && ele.children.length > 0) {
        obj = formatRouter(ele.children)
        break
      } else if (ele.path) {
        obj = ele
        break
      }
    }

    return obj
  }

  return formatRouter(data)
}
