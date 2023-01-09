import { createStore, DispatchOptions, Store as BaseStore } from 'vuex'
import { HomeAction, homeState } from './modules/home'
import { RouteState, TabAction } from './modules/tabs'

export interface State {
  home: typeof homeState
  tabs: RouteState
}

// 自动引入
const modules = {}
const requireStore = import.meta.glob('./modules/*.ts', { eager: true })

for (const key in requireStore) {
  modules[key.replace(/(\.\/modules\/|\.ts)/g, '')] = requireStore[key].default
}
export const store = createStore<State>({
  modules
})

type Actions = TabAction & HomeAction

type ExtendStore = Omit<BaseStore<State>, 'dispatch'> & {
  dispatch<key extends keyof Actions, p extends Parameters<Actions[key]>[1]>(
    type: key,
    payload?: p,
    options?: DispatchOptions
  ): Promise<any>
}

export function useStore() {
  return store as ExtendStore
}
