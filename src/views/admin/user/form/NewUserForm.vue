<template>
  <el-form
    ref="formRef"
    class="custom-form"
    :model="formData"
    :rules="formRules"
  >
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
      label="手机号"
      prop="mobile"
      required
    >
      <el-input
        v-model="formData.mobile"
        placeholder="请输入手机号"
        maxlength="20"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="所属组织"
      prop="organizationId"
    >
      <el-select
        v-model="formData.organizationId"
        placeholder="请选择所属组织"
        clearable
        @change="onOrgChange"
      >
        <el-option
          v-for="item in orgs"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
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
      label="证件类型"
      prop="credentialsType"
    >
      <el-select
        v-model="formData.credentialsType"
        clearable
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
        clearable
      />
      <Tip :content="NEW_USER_TOOLTIP.CREDENTIALS_ID" />
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
      label="用户名"
      prop="name"
    >
      <el-input
        v-model="formData.name"
        placeholder="请输入用户名"
        maxlength="20"
        clearable
      />
      <Tip :content="NEW_USER_TOOLTIP.NAME" />
    </el-form-item>
    <el-form-item
      label="初始密码"
      prop="pwd"
    >
      <el-input
        v-model="formData.pwd"
        type="password"
        autocomplete="new-password"
        placeholder="请输入初始密码"
        clearable
      />
      <Tip :content="NEW_USER_TOOLTIP.PWD" />
    </el-form-item>

    <FomTip class="w-100 form-tip" />

    <el-divider />

    <el-form-item
      class="w-100"
      label="备注"
      prop="desc"
    >
      <Remark v-model="formData.remark" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { NEW_USER_VALIDATOR, PASSPORT_VALIDATOR, VERIFY_NUMBER, Validator } from '@/validator'
import { ref, onMounted, reactive, watch } from 'vue'
import { NEW_USER_TOOLTIP } from '@/text'
import { CREDENTIALS_TYPE, CREDENTIALS_TYPE_LIST } from '@/hooks/useConfig'
import { NewUserData, searchOrgTreeByName, SUCCESS_CODE } from '@/api'
import Tip from '@/views/components/panel/Tip.vue'
import Remark from '@/components/common/Remark.vue'
import { FormInstance, FormRules } from 'element-plus'
import FomTip from '@/components/FormTip.vue'
import { useStoreHook } from '@/hooks/useStore'

const formRef = ref<FormInstance>()
const orgs = ref([])
const { isSuperUser } = useStoreHook()

const props = withDefaults(
  defineProps<{
    modelValue: NewUserData
  }>(),
  {
    modelValue: () => ({
      realName: null,
      mobile: null,
      organizationId: null,
      gender: 1,
      credentialsType: null,
      credentialsCode: null,
      email: null,
      name: null,
      pwd: null,
      remark: null,
      uniformId: null
    })
  }
)

const emit = defineEmits(['update:modelValue'])
const formData = ref(props.modelValue)
const formRules = reactive<FormRules>({ ...NEW_USER_VALIDATOR })

onMounted(async () => {
  const { code, data } = await searchOrgTreeByName('')
  if (code === SUCCESS_CODE) {
    orgs.value = data.filter(item => item.active === 1)
  }
})

function onOrgChange() {
  formRef.value.validateField(['organizationId'], () => {})
}

watch(
  () => formData.value,
  () => {
    formRules.credentialsType = formData.value.credentialsCode
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

    formRules.credentialsCode = credentialsCodeRule

    emit('update:modelValue', formData)
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

defineExpose({
  validate
})
</script>

<style scoped lang="less">
.form-tip {
  margin-top: 0;
  margin-left: 45px;
}
</style>
