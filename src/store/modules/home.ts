/* eslint-disable no-param-reassign */
import useCookie from '@/hooks/useCookie'
const { getCookie } = useCookie()

export const homeState = {
  users: {
    username: '',
    systemId: '',
    loginType: ''
  },
  routers: []
}

const getters = {
  getUserName: () => {
    const cookie = getCookie()
    return cookie.username
  },
  getUserLevel: () => {
    const cookie = getCookie()
    return cookie.userLevel
  },
  getSystemId: () => {
    const cookie = getCookie()
    return cookie.systemId
  },
  routers: state => state.routers,
  getRouters: state => (!state.users ? '' : state.routers)
}

const mutations = {
  // 清除用户信息
  CLEAR_USER: state => {
    state.users = null
    state.routers = []
  },
  // 存储用户信息
  SET_USER: (state, payload) => {
    state.users = payload
  },
  // 存储路由菜单
  SET_ROUTES: (state, payload) => {
    state.routers = payload
  }
}

const actions = {
  clearUser({ commit }) {
    commit('CLEAR_USER')
  },
  setRouters({ commit }, payload) {
    commit('SET_ROUTES', payload)
  },
  setUser({ commit }, payload) {
    commit('SET_USER', payload)
  }
}

export type HomeAction = typeof actions

export default {
  state: homeState,
  getters,
  mutations,
  actions
}
