import * as directives from '@/directives'
import axios from '@/hooks/axios'
import { app } from '@/plugins/app'
import 'element-plus/dist/index.css'
import '@/assets/styles/main.less'
import router from './router'
import { store } from './store'
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register'
import '@/components/elIcon/index.js'
import '@/components/svgIcon/index.ts'
import '@/plugins/elementPlus'

import '@/assets/styles/global.less'
import { vLoading } from 'element-plus'

app.config.globalProperties.$axios = axios

app.use(store).use(router).mount('#service-swap-web')

// 自定义指令
Object.keys(directives).forEach(key => {
  app.directive(key, directives[key])
})

app.directive('vLoading', vLoading)
