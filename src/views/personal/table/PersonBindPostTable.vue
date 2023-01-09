<template>
  <div>
    <el-table
      :data="data"
      style="height: 260px; width: 100%"
      :header-cell-style="{ 'background-color': '#F1F2F6' }"
    >
      <el-table-column
        label="岗位名称"
        prop="positionName"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <div class="ellipsis df-c">
            <el-tooltip
              effect="dark"
              :content="scope.row.positionName"
              placement="top"
            >
              <span class="ellipsis-text">{{ Stuff(scope.row.positionName) }}</span>
            </el-tooltip>
            <UserResourcePopOver :position-id="scope.row.positionId" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否为临时权限">
        <template #default="scope"> {{ Major(scope.row.brief) }} </template>
      </el-table-column>
      <el-table-column label="时长">
        <template #default="scope">{{ Stuff(scope.row.timeLimit) }}</template>
      </el-table-column>
      <el-table-column label="到期时间">
        <template #default="scope">
          {{ scope.row.expireTime ? new Date(scope.row.expireTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20 df-vc">
      <svgIcon
        name="info"
        class="mr-10"
        color="#999"
      />
      <span>鼠标点击，即可查看该岗位下所有角色，以及角色所对应的系统和资源</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFilter } from '@/hooks/filter'
import UserResourcePopOver from '@/views/components/popover/UserResourcePopOver.vue'
import { UserBindPostItem } from '@/api'
const { Major, Stuff } = useFilter()
defineProps<{
  data: UserBindPostItem[]
}>()
</script>

<style scoped lang="less">
.ellipsis {
  width: 100%;
  display: flex;
  align-items: center;

  &-text {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
  }
}
:deep(.el-table .cell.el-tooltip) {
  width: 100% !important;
  padding-right: 0;
}
</style>
