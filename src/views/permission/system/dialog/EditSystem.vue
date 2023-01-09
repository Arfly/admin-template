<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        :model="formObj"
        label-width="140px"
        :rules="formRules"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="系统名称"
              prop="name"
            >
              <el-input
                v-model="formObj.name"
                placeholder="请输入..."
              />
            </el-form-item>
            <el-form-item
              label="系统管理员账号"
              prop="adminName"
            >
              <el-input
                v-model="formObj.adminName"
                placeholder="请输入…"
              />
              <Tip :content="NEW_SYSTEM_TOOLTIP.ADMIN_COUNT" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="系统回调地址"
              prop="redirectUrl"
            >
              <el-input
                v-model="formObj.redirectUrl"
                placeholder="请输入…"
                maxlength="200"
              />
            </el-form-item>
            <el-form-item
              label="系统管理员密码"
              class="mark"
              prop="adminPwd"
            >
              <el-input
                v-model="formObj.adminPwd"
                type="password"
                autocomplete="new-password"
                placeholder="********"
                minlength="8"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="系统编码"
              prop="contactCode"
            >
              <el-input
                v-model="formObj.contactCode"
                placeholder="请输入..."
                maxlength="40"
                :disabled="true"
              />
              <Tip :content="NEW_SYSTEM_TOOLTIP.SYSTEM_CODE" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="归属单位"
              prop="unitBelong"
            >
              <el-input
                v-model="formObj.unitBelong"
                placeholder="请输入..."
                maxlength="40"
              />
            </el-form-item>
            <el-form-item
              label="承建单位"
              prop="contractor"
            >
              <el-input
                v-model="formObj.contractor"
                placeholder="请输入..."
                maxlength="40"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="归属单位联系人"
              prop="unitBelongContact"
            >
              <el-input
                v-model="formObj.unitBelongContact"
                placeholder="请输入…"
              />
            </el-form-item>
            <el-form-item
              label="承建单位联系人"
              prop="contractorContact"
            >
              <el-input
                v-model="formObj.contractorContact"
                placeholder="请输入…"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="归属单位联系方式"
              prop="unitBelongContactPhone"
            >
              <el-input
                v-model="formObj.unitBelongContactPhone"
                placeholder="请输入…"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item
              label="承建单位联系方式"
              prop="contractorPhone"
            >
              <el-input
                v-model="formObj.contractorPhone"
                placeholder="请输入…"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="备注"
              prop="remarks"
            >
              <Remark v-model="formObj.desc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <el-button
        type="primary"
        @click="submitUser"
      >
        确 定
      </el-button>
      <el-button @click="emit('close')">取 消</el-button>
    </template>
  </Main>
</template>
<script setup lang="ts">
import { getSystemDetail, SUCCESS_CODE, SysDetail, systemEdit } from '@/api'
import Remark from '@/components/common/Remark.vue'
import { NEW_SYSTEM_TOOLTIP } from '@/text'
import { EDIT_SYS_VALIDATOR } from '@/validator'
import Tip from '@/views/components/panel/Tip.vue'
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['editSuccess', 'close'])

const route = useRoute()
const id = route.query.id as string

const formRef = ref(null)
const formObj = ref<SysDetail>({
  id: null,
  contactCode: null,
  contractor: null,
  contractorContact: null,
  contractorPhone: null,
  desc: null,
  name: null,
  code: null,
  adminName: null,
  unitBelong: null,
  unitBelongContact: null,
  unitBelongContactPhone: null,
  status: null,
  adminPwd: null,
  redirectUrl: null
})

onMounted(async () => {
  if (id) {
    const { code, data } = await getSystemDetail(id)
    if (code === SUCCESS_CODE) {
      formObj.value = data
      formObj.value.adminPwd = '********'
    }
  }
})

const formRules = EDIT_SYS_VALIDATOR

const submitUser = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const pwd = formObj.value.adminPwd === '********' ? '' : md5(formObj.value.adminPwd)
    let code = ''
    const {
      id,
      adminName,
      adminPwd,
      contractor,
      contactCode,
      contractorPhone,
      contractorContact,
      desc,
      redirectUrl,
      name,
      unitBelongContact,
      unitBelongContactPhone,
      unitBelong
    } = formObj.value
    const params = {
      id,
      adminName,
      adminPwd,
      contractor,
      contactCode,
      contractorPhone,
      contractorContact,
      desc,
      redirectUrl,
      name,
      unitBelongContact,
      unitBelongContactPhone,
      unitBelong
    }

    const res = await systemEdit({ ...params, adminPwd: pwd })
    code = res.code

    if (code === SUCCESS_CODE) {
      ElMessage.success('修改系统信息成功！')
    }
  })
}
</script>
<style lang="less" scoped>
:deep(.el-form-item__content) {
  margin-right: 15px;
}
</style>
