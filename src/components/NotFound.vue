<template>
  <div class="error">
    <el-result
      title="404"
      sub-title="抱歉，您访问的页面消失了..."
    >
      <template #title>
        <div class="title">404</div>
      </template>
      <template #sub-title>
        <div class="sub-title">抱歉，您访问的页面消失了...</div>
      </template>
      <template #icon>
        <el-image :src="errorImg" />
      </template>
      <template #extra>
        <el-button
          type="primary"
          plain
          @click="backHome"
        >
          返回控制台
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import nfImg from '@/assets/img/404.png'

export default {
  setup() {
    const router = useRouter()
    const errorImg = ref(nfImg)

    const backHome = () => {
      router.replace('/')
    }

    return { backHome, errorImg }
  }
}
</script>

<style lang="less" scoped>
.error {
  width: 100%;
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
