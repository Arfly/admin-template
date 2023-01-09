<template>
  <el-dialog
    v-model="viewVisible"
    title="日志内容详情"
    width="70%"
    @close="dialogClosed"
  >
    <div class="basic-info-container">
      <div class="row">
        <div class="item">
          <span class="label">请求地址</span>
          <span class="value">{{ Stuff(infoData.ip) }}</span>
        </div>
        <div class="item">
          <span class="label">时间</span>
          <span class="value">{{ Stuff(infoData.logTime) }}</span>
        </div>
        <div class="item">
          <span class="label">日志等级</span>
          <span class="value">{{ Stuff(infoData.level) }}</span>
        </div>
        <div class="item">
          <span class="label">线程名称</span>
          <span class="value">{{ Stuff(infoData.thread) }}</span>
        </div>
        <div class="item w-100">
          <span class="label">logger名称</span>
          <span class="value">{{ Stuff(infoData.logger) }}</span>
        </div>
        <el-divider />
        <div class="item w-100">
          <span class="label">日志内容</span>
          <span
            class="value"
            style="white-space: pre-wrap"
          >
            {{ Stuff(infoData.info) }}
          </span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="viewVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useFilter } from '@/hooks/filter'
import { SysLogListItem } from '../../api'
const { Stuff } = useFilter()

const viewVisible = ref(false)

const infoData = ref<SysLogListItem>({
  ip: null,
  logTime: null,
  level: null,
  thread: null,
  logger: null,
  info: null
})

function dialogClosed() {
  viewVisible.value = false
}
function dialogOpen(row) {
  infoData.value = row
  viewVisible.value = true
}

defineExpose({
  dialogClosed,
  dialogOpen
})
</script>

<style lang="less" scoped>
.basic-info-container {
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .item {
      display: flex;
      align-items: baseline;
      width: 33%;
      padding: 10px;
      box-sizing: border-box;

      .label {
        width: 100px;
        padding-right: 24px;
        line-height: 22px;
        font-size: 16px;
        color: #666666;
        font-family: PingFangSC-Medium;
        text-align: right;
        font-weight: 400;
      }
      .value {
        flex: 1;
        line-height: 22px;

        font-size: 16px;
        color: #333333;
        font-weight: 600;
      }
    }
    .value-id {
      width: 270px;
    }
  }
}

:deep(.el-dialog > .el-dialog__header > .el-dialog__headerbtn) {
  color: #1077ee;
}
</style>
