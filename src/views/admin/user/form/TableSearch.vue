<template>
  <TableSearchContainer>
    <template #form>
      <div class="from-search">
        <el-input
          v-model="queryInfo.keyword"
          class="item"
          placeholder="请输入用户姓名"
          clearable
        />

        <el-select
          v-model="queryInfo.status"
          v-permission="[PERMISSIONS.USER_CENTRE]"
          class="item"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="item in USER_STATUS_LIST"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>

        <el-select
          v-model="queryInfo.source"
          class="item"
          placeholder="请选择用户来源"
          clearable
        >
          <el-option
            v-for="item in USER_SOURCE_LIST"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>
    </template>
    <template #opts>
      <el-button
        :icon="Search"
        type="primary"
        @click="search"
      >
        查询
      </el-button>
      <el-button
        :icon="RefreshLeft"
        @click="reset"
      >
        重置
      </el-button>
    </template>
  </TableSearchContainer>
</template>

<script setup lang="ts">
import TableSearchContainer from '@/components/table/TableSearchContainer.vue'
import { PERMISSIONS } from '@/config/permission'
import { SOURCE_TYPE, USER_SOURCE_LIST, USER_STATUS, USER_STATUS_LIST } from '@/hooks/useConfig'
import { reactive } from 'vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { Source, Status } from '@/api'
const DEFAULT = { keyword: null, status: null, source: null }

const queryInfo = reactive<{
  keyword: string
  status: Status
  source: Source
}>({
  keyword: DEFAULT.keyword,
  status: DEFAULT.status,
  source: DEFAULT.source
})

const emit = defineEmits(['search', 'reset'])

function reset() {
  queryInfo.keyword = DEFAULT.keyword
  queryInfo.source = DEFAULT.source
  queryInfo.status = DEFAULT.status

  emit('reset', {
    ...DEFAULT
  })
}

function search() {
  emit('search', {
    source: SOURCE_TYPE[queryInfo.source] === '全部' ? null : queryInfo.source,
    keyword: queryInfo.keyword,
    status: USER_STATUS[queryInfo.status] === '全部' ? null : queryInfo.status
  })
}
</script>
