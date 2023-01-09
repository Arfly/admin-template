<template>
  <div class="binding-panel">
    <div class="title">
      <slot name="title"> 需要关联的岗位 </slot>
    </div>
    <div class="label"><slot name="label">请选择需要关联的岗位（可多选），保存即生效</slot></div>
    <div class="post-container">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.binding-panel {
  .title {
    line-height: 22px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }

  .label {
    margin-top: 4px;
    width: 320px;

    font-size: 16px;
    color: #999999;
    font-weight: 400;
  }

  .post-container {
    margin-top: 12px;
    box-sizing: border-box;
    border: 1px solid rgba(221, 221, 221, 1);
    padding: 12px 12px;
    // width: 320px;
    // height: 450px;
  }
}
</style>
