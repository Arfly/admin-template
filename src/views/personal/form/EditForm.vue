<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="100px"
    :rules="formRules"
  >
    <el-row>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="用户名"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            placeholder="请输入用户名"
            disabled
            maxlength="20"
            @change="emit('update:data', formData)"
          />
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="姓名"
          prop="realName"
        >
          <el-input
            v-model="formData.realName"
            placeholder="请输入姓名"
            maxlength="20"
            @change="emit('update:data', formData)"
          />
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="性别"
          prop="gender"
        >
          <el-select
            v-model="formData.gender"
            style="width: 100%"
            @change="emit('update:data', formData)"
          >
            <el-option
              :key="1"
              :value="1"
              label="男"
            />
            <el-option
              :key="2"
              :value="2"
              label="女"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号"
            disabled
            maxlength="20"
            @change="emit('update:data', formData)"
          />
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="证件类型"
          prop="credentialsType"
        >
          <el-select
            v-model="formData.credentialsType"
            style="width: 100%"
            @change="formData.credentialsCode = null"
          >
            <el-option
              v-for="item in CREDENTIALS_TYPE_LIST"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="证件号码"
          prop="credentialsCode"
        >
          <el-input
            v-model="formData.credentialsCode"
            placeholder="请输入证件号码"
            maxlength="20"
          />
          <Tip :content="NEW_USER_TOOLTIP.CREDENTIALS_ID" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        :span="8"
        :xl="{ span: 6 }"
      >
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
            @change="emit('update:data', formData)"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider />
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
    <el-divider />
    <el-row>
      <el-col
        :span="24"
        :xl="{ span: 16 }"
      >
        <el-form-item
          label="备注"
          prop="remark"
        >
          <Remark
            v-model="formData.remark"
            @change="emit('update:data', formData)"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { CREDENTIALS_TYPE_LIST } from '@/hooks/useConfig'
import { NEW_USER_TOOLTIP } from '@/text'
import { PASSPORT_VALIDATOR, VERIFY_NUMBER, EDIT_PERSON_VALIDATOR } from '@/validator'
import Tip from '@/views/components/panel/Tip.vue'
import { FormInstance, FormRules } from 'element-plus'
import { ref, watch, reactive } from 'vue'
import PersonBindOrgTable from '../table/PersonBindOrgTable.vue'
import PersonBindPostTable from '../table/PersonBindPostTable.vue'
import Remark from '@/components/common/Remark.vue'
import { UserBindPostItem, UserDetail, UserRelationOrgItem } from '@/api'

const emit = defineEmits(['update:data'])
const formRef = ref<FormInstance>()

const props = withDefaults(
  defineProps<{
    postData: UserBindPostItem[]
    orgData: UserRelationOrgItem[]
    data: UserDetail
  }>(),
  {
    data: () => ({
      credentialsCode: '',
      credentialsType: 1,
      email: null,
      gender: 1,
      id: '',
      mobile: null,
      name: '',
      realName: '',
      remark: '',
      source: 0,
      status: null,
      userCode: '',
      uniformId: null
    }),
    postData: () => [],
    orgData: () => []
  }
)

const formData = ref(props.data)
const formRules: FormRules = reactive({ ...EDIT_PERSON_VALIDATOR })

watch(
  () => formData.value.credentialsCode,
  () => {
    if (formData.value.credentialsCode) {
      formRules.credentialsType = [
        {
          required: true,
          message: '请选择证件类型!',
          trigger: 'blur'
        }
      ]
    } else {
      formRules.credentialsType = []
    }
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => formData.value.credentialsType,
  () => {
    let validator = []
    switch (formData.value.credentialsType) {
      case 1:
      case 2:
      case 3:
        validator = VERIFY_NUMBER
        break
      case 7:
        validator = PASSPORT_VALIDATOR
        break
      default:
        validator = []
        return
    }
    formRules.credentialsCode = [
      ...validator,
      {
        required: true,
        message: '请输入证件号码',
        trigger: 'blur'
      }
    ]
  },
  {
    immediate: true,
    deep: true
  }
)

// tabs
const TABS_POSITION = {
  SYS: 'system',
  POST: 'post'
}
const tabPosition = ref(TABS_POSITION.SYS)

// 设置数据
watch(
  () => props.data,
  val => {
    formData.value = val
  },
  {
    immediate: true,
    deep: true
  }
)

function validate(cb: () => void) {
  formRef.value.validate(valid => {
    if (valid && cb) {
      cb()
    }
  })
}

function clearData() {
  formRef.value?.resetFields()
}

defineExpose({
  validate,
  clearData,
  formData
})
</script>

<style lang="less" scoped>
:deep(.main-table .el-table td.el-table__cell) {
  padding: 12px;
}
.main-table {
  flex-direction: column;
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
</style>
