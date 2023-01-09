import RouteView from '@/components/RouteView.vue'
import { PERMISSIONS } from '@/config/permission'
import { RouteRecordRaw } from 'vue-router'

const layoutMap: RouteRecordRaw[] = [
  {
    path: 'panel',
    meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
    children: [
      {
        path: 'user',
        meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
        children: [
          {
            path: 'create',
            name: 'CreateUser',
            meta: {
              title: '新增用户',
              code: PERMISSIONS.USER_CENTRE,
              permission: PERMISSIONS.USER_CENTRE,
              keepAlive: true
            },
            component: () => import('@/views/admin/user/dialog/NewUser.vue')
          },
          {
            path: 'edit',
            name: 'EditUser',
            meta: { title: '编辑用户', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/user/dialog/EditUser.vue')
          },
          {
            path: 'view',
            name: 'ViewUser',
            meta: { title: '查看用户详情', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/user/dialog/ViewUser.vue')
          },
          {
            path: 'change',
            name: 'ChangeOrg',
            meta: { title: '批量调整组织', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/user/dialog/ChangeOrg.vue')
          },
          {
            path: 'post',
            name: 'BindPost',
            meta: { title: '用户关联岗位', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/user/dialog/BindPost.vue')
          },
          {
            path: 'org',
            name: 'BindOrg',
            meta: { title: '关联组织', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/user/dialog/BindOrg.vue')
          }
        ]
      },
      {
        path: 'org',
        meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
        children: [
          {
            path: 'create',
            name: 'CreateOrg',
            meta: { title: '新增组织', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/org/dialog/NewOrg.vue')
          },
          {
            path: 'edit',
            name: 'EditOrg',
            meta: { title: '编辑组织', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/org/dialog/EditOrg.vue')
          },
          {
            path: 'view',
            name: 'ViewOrg',
            meta: { title: '查看组织详情', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/org/dialog/ViewOrg.vue')
          },
          {
            path: 'user',
            name: 'BindUser',
            meta: { title: '关联用户', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/admin/org/dialog/BindUser.vue')
          }
        ]
      },
      {
        path: 'role',
        meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
        children: [
          {
            path: 'create',
            name: 'CreateRole',
            meta: { title: '新增角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/role/dialog/NewRole.vue')
          },
          {
            path: 'edit',
            name: 'EditRole',
            meta: { title: '编辑角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/role/dialog/EditRole.vue')
          },
          {
            path: 'resource',
            name: 'BindRes',
            meta: { title: '关联资源', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/role/dialog/BindResourcesToRole.vue')
          },
          {
            path: 'view',
            name: 'ViewRole',
            meta: { title: '查看角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/role/dialog/ViewRole.vue')
          }
        ]
      },
      {
        path: 'post',
        meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
        children: [
          {
            path: 'create',
            name: 'CreatePost',
            meta: { title: '新增角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/post/dialog/NewPost.vue')
          },
          {
            path: 'edit',
            name: 'EditPost',
            meta: { title: '编辑角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/post/dialog/EditPost.vue')
          },
          {
            path: 'role',
            name: 'BindRoleToPost',
            meta: { title: '关联角色', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/post/dialog/BindRoleToPost.vue')
          },
          {
            path: 'user',
            name: 'BindUserToPost',
            meta: { title: '关联用户', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/post/dialog/BindUserToPost.vue')
          },
          {
            path: 'view',
            name: 'ViewPost',
            meta: { title: '查看岗位', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/post/dialog/EditPost.vue')
          }
        ]
      },
      {
        path: 'sys',
        meta: { code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
        children: [
          {
            path: 'create',
            name: 'CreateSys',
            meta: { title: '新增系统', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/system/dialog/NewSystem.vue')
          },
          {
            path: 'edit',
            name: 'EditPost',
            meta: { title: '编辑系统', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/system/dialog/EditSystem.vue')
          },
          {
            path: 'view',
            name: 'ViewPost',
            meta: { title: '查看系统', code: PERMISSIONS.USER_CENTRE, permission: PERMISSIONS.USER_CENTRE },
            component: () => import('@/views/permission/system/dialog/ViewSystem.vue')
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    name: 'Admin',
    meta: { title: '用户中心', icon: 'user', code: PERMISSIONS.USER_CENTRE },
    component: RouteView,
    children: [
      {
        path: 'user',
        name: 'AdminUser',
        meta: { title: '用户管理', code: PERMISSIONS.USER },
        component: () => import('@/views/admin/user/User.vue'),
        children: []
      },
      {
        path: 'organization',
        name: 'AdminOrg',
        meta: { title: '组织管理', code: PERMISSIONS.ORGANIZATION },
        component: () => import('@/views/admin/org/Organization.vue')
      }
    ]
  },
  {
    path: 'permission',
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'authority',
      code: PERMISSIONS.PERMISSION
    },
    component: RouteView,
    children: [
      {
        path: 'resources_fe',
        name: 'ResourcesFE',
        meta: {
          title: '前端资源管理',
          code: PERMISSIONS.RESOURCES_FRONTEND,
          name: 'ResourcesFE'
        },
        component: () => import('@/views/permission/resource/resourcesFE.vue')
      },
      {
        path: 'resources_be',
        name: 'ResourcesBE',
        meta: {
          title: '后端资源管理',
          code: PERMISSIONS.RESOURCES_BACKEND,
          name: 'ResourcesBE'
        },
        component: () => import('@/views/permission/resource/resourcesBE.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: { title: '角色管理', code: PERMISSIONS.ROLE },
        component: () => import('@/views/permission/role/role.vue')
      },
      {
        path: 'post',
        name: 'Post',
        meta: { title: '岗位管理', code: PERMISSIONS.POST },
        component: () => import('@/views/permission/post/post.vue')
      },
      {
        path: 'system',
        name: 'System',
        meta: { title: '系统管理', code: PERMISSIONS.SYSTEM },
        component: () => import('@/views/permission/system/system.vue')
      }
    ]
  }
]

type CustomerRouteRaw = RouteRecordRaw & {
  hidden: boolean
}
const lastRouterMap: CustomerRouteRaw[] = [
  /*  {
    path: '/',
    hidden: true,
    redirect: { name: 'AdminUser' }
  }, */
  {
    path: 'user',
    name: 'User',
    hidden: true /* 不在侧边导航展示 */,
    meta: { title: '个人中心' },
    component: () => import('@/views/common/Person.vue')
  },
  {
    path: 'error',
    name: 'NotFound',
    hidden: true,
    meta: { title: '404' },
    component: () => import('@/components/NotFound.vue')
  },
  {
    path: 'purview',
    name: 'NotPurview',
    hidden: true,
    meta: { title: '403' },
    component: () => import('@/components/NotPurview.vue')
  },
  {
    path: '/:w+',
    hidden: true,
    redirect: { name: 'NotFound' }
  }
]

// 默认不需要权限的页面
const constantRouterMap: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/login/Login.vue')
  }
]

const logRouterMap: RouteRecordRaw[] = [
  {
    path: 'log',
    name: 'Log',
    meta: { title: '日志管理', icon: 'log' },
    component: RouteView,
    children: [
      // {
      //   path: 'system',
      //   name: 'SystemLog',
      //   meta: { title: '系统日志管理' },
      //   component: () => import('@/views/log/system/SystemLog.vue')
      // },
      {
        path: 'operation',
        name: 'OperationLog',
        meta: { title: '操作日志管理' },
        component: () => import('@/views/log/operation/OperationLog.vue')
      }
    ]
  }
]

export { constantRouterMap, lastRouterMap, layoutMap, logRouterMap }
