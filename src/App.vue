<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script lang="ts">
import zhCn from '@/common/element.locale'

export default {
  setup() {
    return {
      locale: zhCn
    }
  }
}
</script>
<style lang="less">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'PingFang SC Regular', 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
