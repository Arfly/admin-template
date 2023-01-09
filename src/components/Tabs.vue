<template>
  <div class="container">
    <div class="tab-wrapper">
      <div
        v-for="(tab, index) in tabs"
        :key="tab.name"
        :class="{ tab: true, active: active.name === tab.name, noBorder: tabs[index + 1]?.name === active.name }"
        :title="tab.meta.title"
        @click="changeTab(tab)"
      >
        <span class="label">
          {{ tab.meta.title }}
        </span>
        <SvgIcon
          :class="`close ${tabs.length === 1 ? 'disabled' : ''}`"
          name="close"
          :color="active.name === tab.name ? '#333' : '#999'"
          @click.stop="removeTab(tab)"
        />
      </div>
      <div class="tab-wrapper-rest"></div>
    </div>
    <div
      v-loading="loading"
      class="component-wrapper"
    >
      <KeepAlive>
        <router-view v-if="route.meta.keepAlive" />
      </KeepAlive>

      <router-view v-if="!route.meta.keepAlive" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Route } from '@/store/modules/tabs'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import router from '@/router'

const store = useStore()
const tabs = computed(() => store.getters.tabs)
const active = computed(() => store.getters.activeTab)
const route = useRoute()

const changeTab = (tab: Route) => {
  console.log(tab)
  store.dispatch('setActiveTab', tab)
}

function removeTab(tab: Route) {
  if (tabs.value.length > 1) {
    store.dispatch('removeTab', tab)
  }
}

const loading = computed(() => !!store.state.tabs.loading)

watch(
  () => store.state.tabs.activeTab,
  () => {
    router.push({ path: store.state.tabs.activeTab.path, query: store.state.tabs.activeTab.query || {} })
  }
)
</script>

<style scoped lang="less">
@tab-width: 152px;
@tab-height: 40px;
@tab-active-bg-color: #fff;
@tab-default-bg-color: #f0f2f5;
@tab-active-color: #333;
@tab-default-color: #999;
.container {
  .tab-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;

    .tab {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: @tab-default-color;
      font-weight: 500;
      width: @tab-width;
      height: @tab-height;
      background-color: @tab-default-bg-color;
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 9px 16px;
      box-sizing: border-box;
      border: none;
      border-right: 1px #d0d3d7 solid;
      .label {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .close {
        opacity: 0.4;
      }

      .close:hover {
        opacity: 1;
      }
    }

    .noBorder {
      border-right: none;
    }

    .tab:hover {
      cursor: pointer;
    }

    .active {
      font-family: PingFangSC-Medium;
      background-color: @tab-active-bg-color;
      color: @tab-active-color;
      border-right: none;
      font-weight: 600;
    }

    .tab:nth-last-child(2) {
      border-right: 1px #d0d3d7 solid;
    }
    .tab-wrapper-rest {
      flex: 1;
      border-bottom: 1px #d0d3d7 solid;
      box-sizing: border-box;
    }
  }
  .component-wrapper {
  }

  .disabled {
    cursor: not-allowed;
  }
}
</style>
