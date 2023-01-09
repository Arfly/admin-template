<template>
  <el-row
    justify="space-between"
    class="ques-title"
  >
    <icon
      :name="InfoFilled"
      :color="`#999`"
    />
    <p>鼠标停放，即可查看该字段的填写说明</p>
  </el-row>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<style scoped lang="less">
.ques-title {
  align-items: center;
  p {
    margin-left: 5px;
    color: #999;
  }
}
</style>
