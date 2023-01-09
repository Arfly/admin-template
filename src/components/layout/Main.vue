<template>
  <div class="main-part-container">
    <div
      v-if="$slots.title"
      class="title"
    >
      <b>
        <slot name="title"></slot>
      </b>
    </div>

    <div :class="`content-container ${$slots.footer ? '' : 'no-footer'} ${$slots.title ? '' : 'no-title'}`">
      <div
        v-if="$slots.aside"
        :class="`aside ${$slots.footer ? '' : 'no-footer'} ${$slots.title ? '' : 'no-title'}`"
      >
        <slot name="aside"></slot>
      </div>

      <div :class="`main ${$slots.footer ? '' : 'no-footer'} ${$slots.title ? '' : 'no-title'}`">
        <slot name="content"></slot>
      </div>
    </div>
    <div
      v-if="$slots.footer"
      :class="`footer ${center ? 'center' : ''}`"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  center?: boolean //底部按钮是否居中
}>()
</script>

<style scoped lang="less">
@import url('@/assets/styles/variable.less');
@title-height: 25px;
@title-margin-bottom: 32px;
@footer-height: 32px;
@divider-height: 1px;
@divider-margin: 24px;

@aside-margin-right: 24px;

@menu-width: 300px;

@content-height-base: calc(100vh - @header-height - @main-padding*2 - @tab-height);
@content-height-normal: calc(@content-height-base - @title-height - @title-margin-bottom - @footer-height);

.main-part-container {
  width: calc(100% - @main-padding*2);
  height: calc(@content-height-base);
  padding: @main-padding;

  .title {
    height: @title-height;
    margin-bottom: @title-margin-bottom;
    b {
      font-size: 18px;
      color: #333333;
    }
  }

  .content-container {
    height: calc(@content-height-normal);
    min-width: 980px;
    width: 100%;
    display: flex;
    flex-direction: row;
    .aside {
      width: 280px;
      height: calc(@content-height-normal);
      overflow: auto;
      margin-right: @aside-margin-right;
    }

    .main {
      flex: 1;
      height: calc(@content-height-normal);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .no-footer {
      height: calc(@content-height-base - @title-height - @divider-margin * 2 - @divider-height);
    }

    .no-title {
      height: calc(@content-height-base - @footer-height);
    }

    .no-footer.no-title {
      height: calc(@content-height-base);
    }
  }

  .no-title {
    height: calc(@content-height-base - @footer-height);
  }

  .no-footer {
    height: calc(@content-height-base - @divider-margin * 2 - @divider-height - @title-height);
  }

  .no-footer.no-title {
    height: calc(@content-height-base);
  }

  .center {
    text-align: center;
  }
}
</style>
