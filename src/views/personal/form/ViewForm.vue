<template>
  <div>
    <el-form label-width="100px">
      <el-row>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="用户名">
            <span class="info-color">{{ Stuff(formObj.name) }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="姓名">
            <span class="info-color">{{ Stuff(formObj.realName) }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="性别">
            <span class="info-color">{{ Gender(formObj.gender) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="手机号码">
            <span class="info-color">{{ Stuff(formObj.mobile) }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="证件类型">
            <span class="info-color">{{ Stuff(CREDENTIALS_TYPE[formObj.credentialsType]) }}</span>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="证件号码">
            <span class="info-color">{{ Stuff(formObj.credentialsCode) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="8"
          :xl="{ span: 6 }"
        >
          <el-form-item label="电子邮箱">
            <span class="info-color">{{ Stuff(formObj.email) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider class="divider" />
      <el-row class="main-table">
        <el-radio-group
          v-model="tabPosition"
          style="margin-bottom: 30px"
        >
          <el-radio-button
            style="border-right: 1px solid"
            :label="TABS_POSITION.SYS"
          >
            关联组织详情
          </el-radio-button>
          <el-radio-button :label="TABS_POSITION.POST"> 关联岗位详情 </el-radio-button>
        </el-radio-group>
        <div class="table-container">
          <PersonBindOrgTable
            v-show="tabPosition === TABS_POSITION.SYS"
            :data="props.orgData"
          />
          <PersonBindPostTable
            v-show="tabPosition === TABS_POSITION.POST"
            :data="props.postData"
          />
        </div>
      </el-row>
      <el-divider class="divider" />
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注">
            <span
              class="info-color"
              style="height: 72px"
            >
              {{ Stuff(formObj.remark) }}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { UserBindPostItem, UserDetail, UserRelationOrgItem } from '@/api'
import { useFilter } from '@/hooks/filter'
import { CREDENTIALS_TYPE } from '@/hooks/useConfig'
import { ref, watch } from 'vue'
import PersonBindOrgTable from '../table/PersonBindOrgTable.vue'
import PersonBindPostTable from '../table/PersonBindPostTable.vue'
const { Gender, Stuff } = useFilter()
// default
const props = withDefaults(
  defineProps<{
    postData: UserBindPostItem[]
    orgData: UserRelationOrgItem[]
    data: UserDetail
  }>(),
  {
    data: () => ({
      credentialsCode: '-',
      credentialsType: 1,
      email: '-',
      gender: 1,
      id: '',
      mobile: '-',
      name: '-',
      realName: '-',
      remark: '-',
      source: 0,
      status: null,
      userCode: '-',
      uniformId: ''
    }),
    postData: () => [],
    orgData: () => []
  }
)

// data
const formObj = ref(props.data)

// tabs
const TABS_POSITION = {
  SYS: 'system',
  POST: 'post'
}
const tabPosition = ref(TABS_POSITION.SYS)

watch(
  () => props.data,
  val => {
    formObj.value = val
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="less" scoped>
:deep(.main-table .el-table td.el-table__cell) {
  padding: 12px;
}
.main-table {
  flex-direction: column;
  width: 100%;
}

:deep(.main-table .el-radio-button) {
  border-radius: 4px;
  // border-color: #dedede;
  .el-radio-button__inner {
    //修改按钮样式
    width: 120px;
    height: 36px;
    line-height: 1.3;
    background: #fff;
    color: #454545;
    border-color: #dedede;
    box-shadow: -1px 0 0 0 #dedede;
  }
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    // 修改按钮激活样式
    color: #3f85d4;
    border-color: #3f85d4;
    box-shadow: -1px 0 0 0 #3f85d4;
  }
}

.basic-info-container {
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    margin-bottom: 10px;
    .item {
      display: flex;
      width: 220px;
      align-items: baseline;
      .label {
        width: 100px;
        line-height: 22px;

        font-size: 16px;
        color: #666666;
        text-align: right;
        font-weight: 400;
        margin-right: 20px;
      }
      .value {
        line-height: 22px;

        font-size: 16px;
        color: #333333;
        font-weight: 400;
      }
    }
    .value-id {
      width: 270px;
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
  }
}

.table-container {
  width: 100%;
}
</style>
