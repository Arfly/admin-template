<template>
  <Main center>
    <template #content>
      <div class="container">
        <div class="item">
          <span class="item-title">组织名称</span>
          <span class="value">{{ Stuff(detail.name) }}</span>
        </div>
        <div class="item">
          <span class="item-title">组织代码</span>
          <span class="value">{{ Stuff(detail.code) }}</span>
        </div>
        <div class="item">
          <span class="item-title">市认证组织编码</span>
          <span class="value">{{ Stuff(detail.creditCode) }}</span>
        </div>

        <div class="item">
          <span class="item-title">上级组织</span>
          <span class="value">{{ Stuff(detail.parentName) }}</span>
        </div>
        <div class="item">
          <span class="item-title">组织层级</span>
          <span class="value">{{ Stuff(detail.level) }}</span>
        </div>
        <div class="item">
          <span class="item-title">组织类型</span>
          <span class="value">{{ Stuff(detail.unitType) }}</span>
        </div>

        <div class="item">
          <span class="item-title">来源类型</span>
          <span class="value">{{ Stuff(SOURCE_TYPE[detail.source]) }}</span>
        </div>
        <div class="item">
          <span class="item-title">组织全路径</span>
          <span
            class="value"
            :title="detail.orgDisplayPath"
          >
            {{ Stuff(detail.orgDisplayPath) }}
          </span>
        </div>
      </div>

      <el-divider />

      <div class="item">
        <span class="item-title">人员名单</span>
        <span
          class="value link"
          @click="onUserListClick"
        >
          用户管理列表
        </span>
      </div>

      <el-divider />

      <div class="item">
        <span class="item-title">备注</span>
        <span class="value">
          {{ Stuff(detail.description) }}
        </span>
      </div>
    </template>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </template>
  </Main>
</template>

<script setup lang="ts">
import { getOrgDetail, OrgDetailData, SUCCESS_CODE } from '@/api'
import { useFilter } from '@/hooks/filter'
import { SOURCE_TYPE } from '@/hooks/useConfig'
import { useStore } from '@/store'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { Stuff } = useFilter()

const router = useRouter()
const route = useRoute()
const store = useStore()

const id = route.query.id as string

const detail = ref<OrgDetailData>({
  unitTypeCode: null,
  name: null,
  id: null,
  code: null,
  parentName: null,
  level: null,
  unitType: null,
  source: null,
  orgDisplayPath: null,
  description: null,
  creditCode: null
})

function onUserListClick() {
  router.push({
    name: 'AdminUser',
    query: {
      organizationID: detail.value.id
    }
  })
}

onMounted(async () => {
  if (id) {
    const { code, data } = await getOrgDetail(id)
    if (code === SUCCESS_CODE) {
      detail.value = data
    }
  }
})

const close = () => {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  row-gap: 24px;

  .item {
    min-width: 350px;
    color: #606266;
    display: flex;
    align-items: center;
    .item-title {
      width: 120px;
      height: 22px;

      font-size: 16px;
      color: #666666;
      text-align: right;
      font-weight: 400;
    }

    .value {
      // width: 64px;
      margin-left: 22px;
      height: 22px;

      font-size: 16px;
      color: #333333;
      font-weight: 400;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .link {
      width: 96px;
      height: 22px;

      font-size: 16px;
      color: #1177ee;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
