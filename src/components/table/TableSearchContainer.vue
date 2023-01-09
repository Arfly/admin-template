<template>
  <el-row
    :gutter="0"
    justify="space-between"
  >
    <div class="form">
      <slot name="form"></slot>
    </div>
    <div class="opts">
      <slot name="opts"></slot>
    </div>
  </el-row>
</template>

<script setup></script>

<style scoped lang="less">
@import url('@/assets/styles/variable.less');
.form {
  flex: 1;
  margin-right: auto;
  margin-bottom: @margin-vertical;
  display: flex;
}
.opts {
  justify-content: flex-end;
  flex: 1;
  display: flex;
  margin-bottom: @margin-vertical;
}
</style>
