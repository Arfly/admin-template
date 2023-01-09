<template>
  <Main center>
    <template #title> 查看用户详情 </template>
    <template #content>
      <div class="basic-info-container">
        <div class="item">
          <span class="label">用户名</span>
          <span class="value">{{ formObj.name }}</span>
        </div>
        <div class="item">
          <span class="label">来源类型</span>
          <span class="value">{{ Stuff(SOURCE_TYPE[formObj.source]) }}</span>
        </div>
        <div class="item">
          <span class="label">姓名</span>
          <span class="value">{{ formObj.realName }}</span>
        </div>
        <div class="item">
          <span class="label">性别</span>
          <span class="value">{{ Gender(formObj.gender) }}</span>
        </div>

        <div class="item">
          <span class="label">手机号码</span>
          <span
            class="value"
            :title="formObj.mobile"
          >
            {{ formObj.mobile }}
          </span>
        </div>
        <div class="item">
          <span class="label">电子邮件</span>
          <span
            class="value"
            :title="`${Stuff(formObj.email)}`"
          >
            {{ Stuff(formObj.email) }}
          </span>
        </div>
        <div class="item">
          <span class="label">证件类型</span>
          <span class="value">
            {{ Stuff(CREDENTIALS_TYPE[formObj.credentialsType]) }}
          </span>
        </div>
        <div class="item">
          <span class="label">证件号码</span>
          <span
            class="value"
            :title="`${Stuff(formObj.credentialsCode)}`"
          >
            {{ Stuff(formObj.credentialsCode) }}
          </span>
        </div>
        <div
          v-if="isSuperUser"
          class="item uniform-id"
        >
          <span class="label">省认证用户ID </span>
          <span class="value">{{ Stuff(formObj.uniformId) }}</span>
        </div>
      </div>
      <el-divider />
      <div class="custom-table">
        <el-radio-group
          v-model="tabPosition"
          style="margin-bottom: 30px"
        >
          <el-radio-button label="system">关联组织详情</el-radio-button>
          <el-radio-button label="post">关联岗位详情</el-radio-button>
        </el-radio-group>
        <div class="table-container">
          <UserBindOrgTable
            v-show="tabPosition === 'system'"
            height="275"
            :data="userOrgData"
          />
          <UserBindPostTable
            v-show="tabPosition === 'post'"
            height="275"
            :data="userPostData"
          />
          <el-row
            v-show="tabPosition === 'post'"
            justify="space-between"
            class="ques-title"
          >
            <svgIcon
              name="ques"
              color="#C3C3C3"
              size="16"
            />
            <p>鼠标点击，即可查看该角色下所有资源</p>
          </el-row>
        </div>
      </div>
      <el-divider />
      <div class="remark">
        <div class="remark-title">备注</div>
        <div class="remark-text">{{ Stuff(formObj.remark) }}</div>
      </div>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <el-button @click="closeCurTab()">关闭</el-button>
    </template>
  </Main>
</template>
<script setup lang="ts">
import {
  getRelationOrgByUser,
  getUserDetail,
  SUCCESS_CODE,
  UserBindPostItem,
  UserDetail,
  userPostList,
  UserRelationOrgItem
} from '@/api'
import Main from '@/components/layout/Main.vue'
import { useFilter } from '@/hooks/filter'
import { closeCurTab } from '@/hooks/tabs'
import { CREDENTIALS_TYPE, SOURCE_TYPE } from '@/hooks/useConfig'
import { useStoreHook } from '@/hooks/useStore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserBindOrgTable from '../table/UserBindOrgTable.vue'
import UserBindPostTable from '../table/UserBindPostTable.vue'
const { Stuff, Gender } = useFilter()
const userPostData = ref<UserBindPostItem[]>([])
const userOrgData = ref<UserRelationOrgItem[]>([])

const route = useRoute()
const userId = route.query.id as string
const { isSuperUser } = useStoreHook()

const tabPosition = ref('system')

const formObj = ref<UserDetail>({
  credentialsCode: null,
  credentialsType: 1,
  email: null,
  gender: 1,
  id: null,
  mobile: null,
  name: null,
  realName: null,
  remark: null,
  source: null,
  status: null,
  userCode: null,
  uniformId: null
})

onMounted(async () => {
  if (userId) {
    const { code, data } = await getUserDetail(userId)
    if (code === SUCCESS_CODE) {
      formObj.value = data
    }

    const postData = await userPostList(userId)
    if (postData.code === SUCCESS_CODE) {
      userPostData.value = postData.data
    }

    const orgData = await getRelationOrgByUser(userId)
    if (orgData.code === SUCCESS_CODE) {
      userOrgData.value = orgData.data
    }
  }
})
</script>
<style lang="less" scoped>
@import url('@/assets/styles/variable.less');

:deep(.el-radio-button) {
  color: #333333;
  background-color: transparent;
}

:deep(.main-table .el-table td.el-table__cell) {
  padding: 12px;
}
.custom-table {
  margin-left: 30px;
  margin-right: 30px;
  flex-direction: column;
  flex-wrap: nowrap;

  :deep(.el-table) {
    .el-table__body {
      td.el-table__cell {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  }
}

@item-width: 400px;
@label-width: 110px;
@item-value-width: 180px;
@item-label-margin-right: 22px;

.basic-info-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: @margin-vertical;
  .item {
    display: flex;
    width: @label-width+ @item-value-width + @item-label-margin-right;
    align-items: baseline;
    // margin-bottom: @margin-vertical;
    .label {
      width: @label-width;
      line-height: 22px;

      font-size: 16px;
      color: #666666;
      text-align: right;
      font-weight: 400;
      margin-right: @item-label-margin-right;
    }
    .value {
      line-height: 22px;

      font-size: 16px;
      color: #333333;
      font-weight: 400;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: @item-value-width;
    }
  }
  .uniform-id {
    width: calc(@label-width + @item-label-margin-right + 240px);

    .value {
      width: 240px;
    }
  }
}

.remark {
  display: flex;
  height: 180px;
  .remark-title {
    line-height: 22px;

    font-size: 16px;
    color: #666666;
    text-align: right;
    font-weight: 400;
    width: 100px;
    text-align: right;
    margin-right: 10px;
  }

  .remark-text {
    flex: 1;
    line-height: 22px;

    font-size: 16px;
    color: #333333;
    font-weight: 400;
    word-break: break-all;
  }
}

.table-container {
  width: 100%;
  height: 319px;
}

:deep(.el-table__row) {
  height: 46px;
}

.dialog-footer {
  width: 100%;
  text-align: center;
}

.ques-title {
  margin-top: @margin-vertical;
}
</style>
