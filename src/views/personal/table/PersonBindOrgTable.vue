<template>
  <el-table
    class="table"
    :data="props.data"
    style="height: 260px"
    :header-cell-style="{ 'background-color': '#F1F2F6' }"
  >
    <el-table-column
      label="组织"
      prop="organizationName"
    />
    <el-table-column
      label="上级组织"
      prop="parentOrganizationName"
    />
    <el-table-column
      label="是否为主要组织"
      :show-overflow-tooltip="false"
    >
      <template #default="scope"> {{ Major(scope.row.major) }} </template>
    </el-table-column>
    <el-table-column
      label="组织是否有效"
      :show-overflow-tooltip="false"
    >
      <template #default="scope"> {{ Major(scope.row.active) }} </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { UserRelationOrgItem } from '@/api'
import { useFilter } from '@/hooks/filter'
const { Major } = useFilter()
const props = defineProps<{
  data: UserRelationOrgItem[]
}>()
</script>

<style lang="less" scoped>
.table {
  margin-bottom: 10px;
}
</style>
