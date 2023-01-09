<template>
  <el-table
    :border="false"
    :data="props.data"
    height="420px"
    :show-header="false"
  >
    <el-table-column
      type="index"
      width="45"
    />
    <el-table-column label="用户名称">
      <template #default="scope">
        {{ `${scope.row.realName} ${ProtectPhone(scope.row.mobile)}` }}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="60"
    >
      <template #default="scope">
        <icon
          color="#ed5565"
          style="cursor: pointer"
          :name="Delete"
          @click="deleteResource(scope.$index, scope.row)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { PostBindUserListItem } from '@/api'
import { useFilter } from '@/hooks/filter'
import { Delete } from '@element-plus/icons-vue'
const props = defineProps<{
  data: PostBindUserListItem[]
}>()
const { ProtectPhone } = useFilter()
const emit = defineEmits(['delete'])

const deleteResource = (index: number, row: PostBindUserListItem) => {
  emit('delete', index, row)
}
</script>

<style scoped></style>
