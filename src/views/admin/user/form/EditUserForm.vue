<template>
  <el-form
    ref="formRef"
    class="custom-form"
    :model="formData"
    :rules="formRules"
  >
    <el-form-item
      label="用户名"
      prop="name"
    >
      <template #default>
        <el-input
          v-model="formData.name"
          placeholder="请输入用户名"
          maxlength="20"
        />
        <Tip
          custom-class="tip"
          :content="NEW_USER_TOOLTIP.NAME"
        />
      </template>
    </el-form-item>
    <el-form-item label="来源类型">
      <el-input
        disabled
        :value="SOURCE_TYPE[formData.source]"
        maxlength="20"
      />
    </el-form-item>
    <el-form-item
      label="姓名"
      prop="realName"
    >
      <el-input
        v-model="formData.realName"
        placeholder="请输入用户姓名"
        maxlength="20"
      />
    </el-form-item>
    <el-form-item
      label="性别"
      prop="gender"
    >
      <el-select v-model="formData.gender">
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
    <el-form-item
      label="手机号"
      prop="mobile"
    >
      <el-input
        v-model="formData.mobile"
        placeholder="请输入手机号"
        maxlength="20"
      />
    </el-form-item>
    <el-form-item
      label="邮箱"
      prop="email"
    >
      <el-input
        v-model="formData.email"
        placeholder="请输入邮箱"
        maxlength="20"
      />
    </el-form-item>
    <el-form-item
      label="证件类型"
      prop="credentialsType"
    >
      <el-select
        v-model="formData.credentialsType"
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
    <el-form-item
      label="证件号码"
      prop="credentialsCode"
    >
      <el-input
        v-model="formData.credentialsCode"
        placeholder="请输入证件号码"
        maxlength="20"
      />
      <Tip
        custom-class="tip"
        :content="NEW_USER_TOOLTIP.CREDENTIALS_ID"
      />
    </el-form-item>

    <el-form-item
      v-if="isSuperUser"
      label="省认证用户ID"
      prop="uniformId"
    >
      <el-input
        v-model="formData.uniformId"
        placeholder="请输入..."
        maxlength="22"
      />
    </el-form-item>
    <el-divider />
    <el-form-item
      class="w-100"
      label="备注"
      prop="remark"
    >
      <Remark v-model="formData.remark" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import Remark from '@/components/common/Remark.vue'
import { CREDENTIALS_TYPE, CREDENTIALS_TYPE_LIST, SOURCE_TYPE } from '@/hooks/useConfig'
import { PASSPORT_VALIDATOR, VERIFY_NUMBER, Validator, useUserValidator } from '@/validator'
import { NEW_USER_TOOLTIP } from '@/text'
import Tip from '@/views/components/panel/Tip.vue'
import { ref, watch } from 'vue'
import { ElForm } from 'element-plus'
import { useStoreHook } from '@/hooks/useStore'
import { UserDetail } from '@/api'
import { useRoute } from 'vue-router'

const { isSuperUser } = useStoreHook()
const formRef = ref<InstanceType<typeof ElForm>>()
const props = withDefaults(
  defineProps<{
    modelValue: UserDetail
  }>(),
  {
    modelValue: () => ({
      credentialsCode: null,
      credentialsType: 1,
      email: null,
      gender: 1,
      id: null,
      mobile: null,
      name: null,
      realName: null,
      remark: null,
      source: 0,
      status: null,
      userCode: null,
      uniformId: null
    })
  }
)

const route = useRoute()
const userId = route.query.id as string
const formData = ref<UserDetail>(props.modelValue)
const formRules = ref(useUserValidator(userId))

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  val => {
    formData.value = { ...val }
  }
)

watch(
  () => formData.value,
  () => {
    formRules.value.credentialsType = formData.value.credentialsCode
      ? [{ required: true, message: '请选择证件类型!', trigger: 'blur' }]
      : []

    let credentialsCodeRule: Validator = []

    if (formData.value.credentialsType) {
      credentialsCodeRule = [{ required: true, message: '请输入证件号码!', trigger: 'blur' }]
      switch (formData.value.credentialsType) {
        case CREDENTIALS_TYPE['身份证']:
        case CREDENTIALS_TYPE['军官证']:
        case CREDENTIALS_TYPE['士官证']:
          credentialsCodeRule = [...VERIFY_NUMBER, ...credentialsCodeRule]
          break
        case CREDENTIALS_TYPE['护照']:
          credentialsCodeRule = [...PASSPORT_VALIDATOR, ...credentialsCodeRule]
          break
        default:
          break
      }
    }

    formRules.value.credentialsCode = credentialsCodeRule
    formRef.value?.validate(() => {})
    emit('update:modelValue', formData.value)
  },
  {
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

defineExpose({
  validate
})
</script>
