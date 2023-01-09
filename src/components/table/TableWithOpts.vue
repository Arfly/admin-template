<template>
  <div class="main-table">
    <div
      v-if="$slots.opts"
      class="opt-btns"
    >
      <slot name="opts"></slot>
    </div>

    <div class="content">
      <slot name="table"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.main-table {
  display: flex;
  flex-direction: column;
  align-content: space-between;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.opt-btns {
  display: flex;
  height: 52px;
  border: 1px solid rgba(221, 221, 221, 1);
  width: 100%;
  border-bottom: 0;
  box-sizing: border-box;
  padding: 0 24px;
  align-items: center;
  :deep(button) {
    color: #666666;
    img {
      margin-right: 12px;
    }
  }
}
</style>
