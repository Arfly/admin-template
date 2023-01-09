<template>
  <el-date-picker
    v-model="timeRange"
    :shortcuts="shortcuts"
    :disabled-date="onDisabledDateChange"
    :default-time="defaultTime"
    type="datetimerange"
    format="YYYY-MM-DD HH:mm:ss"
    range-separator="-"
    start-placeholder="请选择开始日期"
    end-placeholder="请选择开结束日期"
    @calendar-change="onPick"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TIME_SHORTCUTS } from '../common/timepicker'

const props = withDefaults(
  defineProps<{
    modelValue: Date[]
    defaultTime: Date[]
  }>(),
  {
    modelValue: () => [],
    defaultTime: () => [new Date(new Date().setHours(0, 0, 0)), new Date(new Date().setHours(23, 59, 59))]
  }
)
const emit = defineEmits(['update:modelValue'])

const timeRange = ref<Date[]>([])

watch(
  () => props.modelValue,
  () => {
    timeRange.value = props.modelValue
  },
  {
    immediate: true
  }
)

const shortcuts = TIME_SHORTCUTS
const startChoiceDate = ref<number>()

const onDisabledDateChange = (time: Date) => {
  const curDate = new Date().setHours(23, 59, 59)
  // 如果已经选中一个日期 则返回该日期前后一个月时间可选
  if (startChoiceDate.value) {
    // 按自然月验证
    // const chosenMonth = new Date(startChoiceDate.value).getMonth()
    // const minTime = new Date(startChoiceDate.value).setMonth(chosenMonth - 1)
    // const maxTime = new Date(startChoiceDate.value).setMonth(chosenMonth + 1)
    // const max = curDate < maxTime ? curDate : maxTime
    // return time.getTime() < minTime || time.getTime() > max
    // 按30天验证
    const chosenDay = new Date(startChoiceDate.value).setHours(0, 0, 0)
    const range = 3600 * 1000 * 24 * 30
    const max = curDate < chosenDay + range ? curDate : chosenDay + range
    return time.getTime() <= chosenDay - range || time.getTime() >= max
  }
  // 若一个日期也没选中则返回当前日期以前日期可选
  return time.getTime() > curDate
}

const onPick = (val: Array<Date>) => {
  const [minDate, maxDate] = val
  startChoiceDate.value = minDate.getTime()
  if (maxDate) {
    startChoiceDate.value = null
  }
}

function onChange() {
  emit('update:modelValue', timeRange.value?.map(time => time.toLocaleString().replace(/\//g, '-')) ?? null)
}
</script>
