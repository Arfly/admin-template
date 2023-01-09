<template>
  <!--  修改密码的弹框-->
  <el-dialog
    v-model="dialogVis"
    title="重置密码"
    width="640"
    class="auto"
    @close="dialogClosed"
  >
    <!--内容主体区域-->
    <el-form
      v-if="succeed"
      ref="formRef"
      class="form"
      :model="formObj"
      label-width="140px"
      :rules="formRules"
    >
      <el-row justify="center">
        <el-form-item
          label="新密码"
          prop="newPwd"
        >
          <el-input
            v-model="formObj.newPwd"
            placeholder="请输入..."
            type="password"
            show-password
            minlength="8"
            maxlength="20"
            style="width: 280px"
          />
          <Tip :content="USER_TOOLTIP.RESET_PWD" />
        </el-form-item>
      </el-row>
      <el-row justify="center">
        <el-form-item
          label="再次输入新密码"
          prop="confirmPwd"
        >
          <el-input
            v-model="formObj.confirmPwd"
            type="password"
            show-password
            placeholder="请输入..."
            minlength="8"
            maxlength="20"
            style="width: 280px"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <el-row
      v-else
      style="display: flex; flex-direction: column; align-items: center; padding-top: 8px; padding-bottom: 8px"
    >
      <svgIcon
        name="succeed"
        size="48"
        style="margin-bottom: 16px"
      />
      <p>密码重置成功</p>
    </el-row>
    <!--底部按钮区域-->
    <template #footer>
      <span
        v-if="succeed"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="changePwd"
        >
          确 定
        </el-button>
        <el-button @click="dialogClosed">取 消</el-button>
      </span>
      <span
        v-else
        class="dialog-footer"
      >
        <el-button @click="dialogClosed">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { SUCCESS_CODE, resetPwd, UserListItem } from '@/api'
import md5 from 'js-md5'
import Tip from '../../../components/panel/Tip.vue'
import { USER_TOOLTIP } from '@/text'
import { RESET_PWD } from '@/validator'
import { ElForm } from 'element-plus'

const props = defineProps<{
  rowObj: UserListItem
  visible: boolean
}>()

const dialogVis = ref(false)
watch(
  () => props.visible,
  () => {
    dialogVis.value = props.visible
  },
  {
    immediate: true
  }
)

const formObj = ref<{
  newPwd: string
  confirmPwd: string
}>({
  newPwd: null,
  confirmPwd: null
})
const formRef = ref<InstanceType<typeof ElForm>>()
const succeed = ref(true)

const emit = defineEmits(['close'])

const dialogClosed = () => {
  succeed.value = true
  emit('close')
}

const equalToConfirmPassword = (rule, value, callback) => {
  if (formObj.value.newPwd !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const formRules = {
  newPwd: RESET_PWD.newPwd,
  confirmPwd: [...RESET_PWD.confirmPwd, { required: true, validator: equalToConfirmPassword, trigger: 'blur' }]
}

const changePwd = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const { code } = await resetPwd({
      pwd: md5(formObj.value.newPwd),
      userId: props.rowObj.id
    })
    if (code === SUCCESS_CODE) {
      succeed.value = false
    }
  })
}
</script>

<style scoped lang="less">
.form {
  flex-wrap: wrap;

  .el-form-item {
    margin-bottom: 24px;
    width: 500px;
  }
}
</style>
