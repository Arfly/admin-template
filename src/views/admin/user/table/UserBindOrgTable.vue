<template>
  <el-table
    :data="props.data"
    max-height="500"
  >
    <el-table-column
      label="组织"
      prop="organizationName"
    />
    <el-table-column
      label="上级组织"
      prop="parentOrganizationName"
    />
    <el-table-column label="是否为主要组织">
      <template #default="scope"> {{ Major(scope.row.major) }} </template>
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
