import { RouteLocationNormalizedLoaded, RouteRecordName } from 'vue-router'
import { ActionContext } from 'vuex'
import { State } from '..'
import uniqid from 'uniqid'

export interface Route extends Partial<RouteLocationNormalizedLoaded> {
  title?: string
  name: RouteRecordName
  id?: string
  data?: string | boolean | number | object | []
}
export interface RouteState {
  tabs: Route[]
  activeTab: Route
  loading: number
}
const state: RouteState = {
  tabs: [],
  activeTab: null,
  loading: 0
}

const mutations = {
  removeTab(state: RouteState, tabRoute: Route) {
    if (state.tabs.length > 1) {
      const index = state.tabs.findIndex(route => route.name === tabRoute.name)
      if (index != -1) {
        state.tabs.splice(index, 1)
      }
      // 删除当前打开的页面
      if (tabRoute.id && state.activeTab.id === tabRoute.id) {
        // eslint-disable-next-line no-param-reassign
        state.activeTab = state.tabs[state.tabs.length - 1]
      }
    }
  },

  setActive(state: RouteState, targetRoute: Route) {
    const index = state.tabs.findIndex(route => route.path === targetRoute.path)

    if (index === -1) {
      state.tabs.push({
        ...targetRoute,
        id: uniqid()
      })
    }

    // eslint-disable-next-line no-param-reassign
    state.activeTab = index === -1 ? state.tabs[state.tabs.length - 1] : targetRoute
  },

  setLoad(state: RouteState, status: boolean) {
    // eslint-disable-next-line no-param-reassign
    if (status) {
      // eslint-disable-next-line no-param-reassign
      state.loading += 1
    } else {
      // eslint-disable-next-line no-param-reassign
      state.loading -= 1
    }

    // eslint-disable-next-line no-param-reassign
    state.loading = Math.max(0, state.loading)
  }
}

const getters = {
  tabs(state: RouteState) {
    return [...state.tabs]
  },

  activeTab(state: RouteState) {
    return state.activeTab
  }
}

const actions = {
  removeTab(context: ActionContext<RouteState, State>, payload: Route) {
    context.commit('removeTab', payload)
  },

  setActiveTab(context: ActionContext<RouteState, State>, payload: Route) {
    context.commit('setActive', payload)
  },

  load(context: ActionContext<RouteState, State>, payload: boolean) {
    context.commit('setLoad', payload)
  },

  closeCurTab(context: ActionContext<RouteState, State>) {
    context.commit('removeTab', context.state.activeTab)
  }
}

export type TabAction = typeof actions

export default {
  state,
  mutations,
  actions,
  getters
}
