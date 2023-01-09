<template>
  <el-card class="box-card">
    <template #header>
      <el-row
        justify="space-between"
        class="main--dealt"
      >
        <p>
          <slot name="title"></slot>
        </p>
      </el-row>
    </template>
    <p style="color: #9f9f9f">
      <slot name="label"></slot>
    </p>
    <slot name="content"></slot>
  </el-card>
</template>

<style scoped lang="less">
.el-card {
  height: auto;
}
:deep(.el-card__header) {
  font-size: 16px;
  line-height: 16px;
}
:deep(.el-card__body) {
  padding: 12px;
  p {
    min-height: 35px;
    line-height: 18px;
  }
}
</style>
