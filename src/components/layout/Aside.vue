<template>
  <el-aside :class="`aside-menu ${isCollapse ? 'collapse' : ''}`">
    <el-menu
      background-color="#ffffff"
      active-text-color="#1177EE"
      unique-opened
      :default-active="route.path"
      :collapse="isCollapse"
      @select="selectMenu"
    >
      <template
        v-for="item in routers.filter(router => router.name)"
        :key="item.name"
      >
        <template v-if="!item['hidden']">
          <el-sub-menu
            v-if="item.children && item.children.length"
            :index="concatPath(item.path)"
          >
            <template #title>
              <svgIcon
                :name="item.meta.icon"
                :color="
                  active.indexOf(concatPath(item.path)) === -1 ? COLORS.ICON_DEFAULT_COLOR : COLORS.ICON_ACTIVE_COLOR
                "
                size="20"
                style="margin-right: 8px"
              />
              <span>{{ item.meta.title }}</span>
            </template>
            <template
              v-for="sub in item.children"
              :key="sub.name"
            >
              <el-menu-item :index="concatPath(item.path, sub.path)">
                <SvgIcon
                  v-if="sub.meta['icon']"
                  :name="sub.meta['icon']"
                />
                <template #title>
                  {{ sub.meta.title }}
                </template>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item
            v-else
            :index="concatPath(item.path)"
          >
            <SvgIcon
              v-if="item.meta['icon']"
              :name="item.meta['icon']"
            />
            <template #title>
              {{ item.meta.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div
      class="fold"
      @click="changeCollapse(!isCollapse)"
    >
      <icon
        v-if="!isCollapse"
        :name="Fold"
        :color="COLORS.ICON_DEFAULT_COLOR"
      />
      <icon
        v-else
        :name="Expand"
        :color="COLORS.ICON_DEFAULT_COLOR"
      />
    </div>
  </el-aside>
</template>

<script lang="ts">
import { COLORS } from '@/config/color'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { Fold, Expand } from '@element-plus/icons-vue'
import { activeTab } from '@/hooks/tabs'

export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    const isCollapse = ref(false)
    const active = ref(route.path)
    activeTab(route.name)

    const routers = computed(() => store.state.home.routers)
    const selectMenu = index => {
      active.value = index
      activeTab(index)
    }
    const changeCollapse = (val: boolean) => {
      isCollapse.value = val
    }

    const concatPath = (pPath, cPath = '') => `/${pPath}${cPath !== '' ? `/${cPath}` : ''}`

    return {
      route,
      routers,
      concatPath,
      changeCollapse,
      isCollapse,
      active,
      selectMenu,
      COLORS,
      Fold,
      Expand
    }
  }
}
</script>

<style lang="less" scoped>
@import url('@/assets/styles/variable.less');
:deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  font-size: 16px;
}

:deep(.el-sub-menu__title) {
  height: @aside-menu-height;
}

:deep(.el-sub-menu .el-menu-item) {
  height: @aside-menu-height;
}

:deep(.el-menu-item.is-active, .el-menu--popup .el-menu-item.is-active) {
  background-color: rgba(17, 119, 238, 0.08) !important;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 48px !important;
}
.aside-menu {
  width: @aside-width;
}

.collapse {
  width: 64px !important;
}

.noScrollBar {
  overflow: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.noSelect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.line(@n) {
  height: @n + px;
  line-height: @n + px;
}

.el-aside {
  padding-top: 15px;
  box-sizing: border-box;
  height: calc(100vh - 64px);
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  -moz-transition: width 0.3s ease-in-out;
  -webkit-transition: width 0.3s ease-in-out;
  border-right: 1px solid #dddddd;
  .noSelect();
  .el-menu {
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    flex: 1;
    border-right: none;
    .noScrollBar();
    &:not(.el-menu--collapse) {
      width: @aside-width;
    }
  }

  .fold {
    display: none;
    @include line(48);
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    text-align: right;
    padding: 0 20px;
    background-color: #ffffff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
