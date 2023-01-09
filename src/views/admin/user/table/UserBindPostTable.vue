<template>
  <el-table
    :data="data"
    max-height="500"
  >
    <el-table-column
      label="岗位名称"
      prop="positionName"
    >
      <template #default="scope">
        <div class="post">
          <span class="label overflow-ellipsis">{{ scope.row.positionName }}</span>
          <UserResourcePopOver :position-id="scope.row.positionId" />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="是否为临时权限">
      <template #default="scope">
        {{ scope.row.brief ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column label="权限时长">
      <template #default="scope">{{ Stuff(scope.row.timeLimit) }}</template>
    </el-table-column>
    <el-table-column label="到期时间">
      <template #default="scope">
        {{ scope.row.expireTime ? new Date(scope.row.expireTime).toLocaleString() : '-' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { UserBindPostItem } from '@/api'
import { useFilter } from '@/hooks/filter'
import UserResourcePopOver from '@/views/components/popover/UserResourcePopOver.vue'
const { Stuff } = useFilter()
defineProps<{
  data: UserBindPostItem[]
}>()
</script>

<style lang="less" scoped>
.post {
  display: flex;
  justify-content: space-between;

  .label {
    display: inline-block;
    text-align: left;
    width: 200px;
  }
}
</style>
