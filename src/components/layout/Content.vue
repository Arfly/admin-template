<template>
  <el-card
    :class="{ noCard: type != 'card' }"
    shadow="never"
    class="index"
  >
    <template
      v-if="$slots.title"
      #header
    >
      <div class="card_header">
        <b>
          <slot name="title"></slot>
        </b>
      </div>
    </template>

    <el-row
      style="height: 100%"
      :gutter="20"
      justify="space-between"
    >
      <el-col
        :span="$slots.aside ? 5 : 0"
        style="padding: 10px; border: 1px solid #eee; overflow: auto; height: 100%"
      >
        <slot name="aside"></slot>
      </el-col>
      <el-col :span="$slots.aside ? 19 : 24">
        <div class="main__body">
          <slot name="content"></slot>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string
  }>(),
  {
    type: 'card'
  }
)
</script>

<style scoped lang="less">
:deep(.el-card__body) {
  height: calc(100% - 20px);
}
.noCard {
  border: 0;
  height: 100%;
  :deep(.el-card__body) {
    padding: 10px;
    margin-bottom: 0;
    height: calc(100% - 20px);
  }
}
</style>
