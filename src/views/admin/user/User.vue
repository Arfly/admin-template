<template>
  <Main>
    <template #content>
      <el-tabs
        v-model="tab"
        class="tabs-container"
        tab-position="top"
      >
        <el-tab-pane
          v-for="item in TABS"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <component :is="item.component" />
        </el-tab-pane>
      </el-tabs>
    </template>
  </Main>
</template>

<script setup lang="ts">
import Main from '@/components/layout/Main.vue'
import { computed, provide, ref } from 'vue'
import UserInvalidList from './UserInvalidList.vue'
import UserList from './UserList.vue'
const TABS_KEY = {
  LIST: 0,
  DISABLED_LIST: 1
}

const TABS = [
  {
    key: TABS_KEY.LIST,
    label: '用户管理列表',
    component: UserList
  },
  {
    key: TABS_KEY.DISABLED_LIST,
    label: '组织失效人员',
    component: UserInvalidList
  }
]
const tab = ref(TABS_KEY.LIST)

provide(
  'userTab',
  computed(() => tab.value)
)
</script>

<style scoped lang="less">
@tab-margin-bottom: 24px;
@tab-height: 40px;
:deep(.el-tabs__header) {
  margin-bottom: @tab-margin-bottom;
}

.tabs-container {
  height: 100%;
  :deep(.el-tabs__content) {
    height: calc(100% - @tab-height - @tab-margin-bottom);
  }
  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
