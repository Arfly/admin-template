<template>
  <div class="layout">
    <el-container class="is-vertical">
      <Header />
      <el-container class="body">
        <Aside width="300px" />
        <el-main>
          <Tabs />
          <!-- <router-view :key="key" /> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'

import Tabs from '../Tabs.vue'
</script>

<style lang="less" scoped>
@mixin zdy_scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e5e5e5 #f7f7f9;
  &::-webkit-scrollbar {
    width: 10px;
    height: 8px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #409eff;
    border-radius: 10px;
  }
}

@header-height: 64px;

.layout {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;

  .body {
    height: calc(100vh - @header-height);
  }
  .el-main {
    padding: 0;
    height: 100%;
  }
}
</style>
