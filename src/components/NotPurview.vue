<template>
  <div class="purview">
    <el-result
      title="403"
      sub-title="抱歉，您暂无权限访问此系统..."
    >
      <template #title>
        <div class="title">403</div>
      </template>
      <template #sub-title>
        <div class="sub-title">抱歉，您暂无权限访问此系统...</div>
      </template>
      <template #icon>
        <el-image :src="errorImg" />
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import nfImg from '@/assets/img/404.png'
const errorImg = ref(nfImg)
</script>

<style lang="less" scoped>
.purview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.title {
  font-size: 24px;
  font-weight: bolder;
}

.sub-title {
  font-size: 16px;
  font-weight: 600;
}
</style>
