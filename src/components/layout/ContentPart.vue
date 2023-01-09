<template>
  <div class="content-container">
    <div class="header">
      <slot name="search"></slot>
    </div>
    <div :class="$slots.footer ? 'main' : 'main no-footer'">
      <slot name="table"></slot>
    </div>
    <div
      v-if="$slots.footer"
      class="footer"
    >
      <slot name="page"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
@header-height: 32px;
@footer-height: 36px;
@main-margin-top: 24px;
.content-container {
  height: 100%;

  .header {
    height: @header-height;
  }

  .main {
    height: calc(100% - @header-height - @footer-height - @main-margin-top);
    margin-top: @main-margin-top;
  }

  .no-footer {
    height: calc(100% - @header-height - @main-margin-top);
  }

  .footer {
    height: @footer-height;
  }
}
</style>
