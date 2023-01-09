<template>
  <div class="container">
    <template v-if="isJSON">
      <template v-for="(value, key) in typeof props.data === 'string' ? JSON.parse(props.data) : props.data">
        <div
          v-if="typeof value === 'string'"
          :key="key"
          class="item"
        >
          <span class="title">{{ key }}</span>
          <span class="content">{{ Stuff(value) }}</span>
        </div>
        <div
          v-if="Array.isArray(value)"
          :key="key"
          class="item table"
        >
          <div class="title">{{ key }}</div>
          <div class="table main-table">
            <el-table
              :data="getTableData(value)"
              max-height="260"
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
              />
              <el-table-column
                v-for="col in cols"
                :key="col.label"
                :prop="col.prop"
                :label="col.label"
              />
            </el-table>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="item">
        <span class="content">
          {{ Stuff(`${props.data}`) }}
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="tsx" setup>
import { useFilter } from '@/hooks/filter'
import { computed, ref } from 'vue'

const { Stuff } = useFilter()

const props = defineProps<{ data: string | Record<string, string> }>()

const cols = ref<{ prop: string; label: string }[]>([])

/**
 * 将描述表格结构的数组转化为el-table绑定的数据格式
 * @param data 描述表格的数组
 * @author fei.han
 */
function getTableData(data: { [key: string]: string }[]) {
  const props = Object.keys(data[0])
  const labels = Object.values(data[0])

  cols.value = props.map((prop, index) => ({
    prop,
    label: labels[index]
  }))

  return data.slice(1)
}

const isJSON = computed(() => {
  let isJson = true
  try {
    if (typeof props.data === 'string') {
      JSON.parse(props.data)
    }
  } catch (err) {
    isJson = false
  }
  return isJson
})
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 0 12px;

  .item {
    min-width: 33.3333%;
    display: flex;
    margin: 12px 0;

    .title {
      font-size: 16px;
      color: #666666;
      text-align: right;
      font-weight: 400;
      margin-right: 24px;
      width: 100px;
    }

    .content {
      font-size: 16px;
      color: #333333;
      font-weight: 400;
    }
  }

  .table {
    width: 100%;
    display: flex;
    flex-direction: column;

    .title {
      text-align: left;
      margin-bottom: 12px;
    }
  }
}
</style>
