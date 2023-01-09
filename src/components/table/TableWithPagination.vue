<template>
  <el-table
    :data="props.data"
    v-bind="$attrs"
    max-height="520"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      v-for="col in props.columns"
      :key="col.label"
      :label="col.label"
      :type="col.type"
      :width="col.width"
      :prop="col.prop"
      v-bind="col.attr"
    >
      <template
        v-if="col.customerRender"
        #default="scope"
      >
        <Extend :render="col.customerRender(scope.row)" />
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    class="pagination"
    background
    :current-page="page.pageNum"
    :page-sizes="[10, 20, 50]"
    :page-size="page.pageSize"
    layout="total, prev, pager, next,sizes,jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <div
    v-if="props.showCustomerInfo && total"
    class="customer-page-info"
  >
    第 {{ page.pageNum }}/{{ Math.ceil(total / page.pageSize) }} 页
  </div>
</template>

<script setup lang="ts">
import { usePagination } from '@/hooks/pagenation'
import Extend from '../common/extend.vue'
import { TableColumn } from './table'

const { total, page, handleCurrentChange, handleSizeChange, resetPage } = usePagination(() => {
  emit('pageChange', page.value.pageNum, page.value.pageSize)
})

const props = defineProps<{
  columns: TableColumn[]
  data: any[]
  showCustomerInfo?: boolean
}>()

const emit = defineEmits(['pageChange', 'selectionChange'])

defineExpose({
  page,
  total,
  resetPage
})

function handleSelectionChange(selection) {
  emit('selectionChange', selection)
}
</script>

<style scoped lang="less">
:deep(td.el-table__cell) {
  .cell {
    height: 40px;
    line-height: 40px;
  }
}
.pagination {
  display: flex;
  align-items: flex-end;
  width: 100%;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}

.customer-page-info {
  position: absolute;
  font-size: 14px;
  font-weight: 400;
  color: var(--el-text-color-regular);
  bottom: 0;
  left: 80px;
}
</style>
