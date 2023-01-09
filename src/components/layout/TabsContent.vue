<template>
  <div class="tab-content-container">
    <div
      v-if="$slots.aside"
      class="aside"
    >
      <slot name="aside"></slot>
    </div>
    <div class="main-container">
      <div :class="$slots.footer ? 'main' : 'main no-footer'">
        <slot name="content"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
@import url('@/assets/styles/variable.less');
@aside-margin-right: 24px;
@footer-height: 36px;
.tab-content-container {
  height: 100%;
  display: flex;

  .aside {
    width: @tree-container-width;
    margin-right: @aside-margin-right;
  }

  .main-container {
    flex: 1;
    width: calc(100% - 344px - @aside-margin-right);
    height: 100%;
    .main {
      height: calc(100% - @footer-height);
      display: flex;
      flex-direction: column;
    }
  }
}

.no-footer {
  height: 100% !important;
}
</style>
