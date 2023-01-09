<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="form"
        :model="formObj"
        label-width="140px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="系统名称">{{ formObj.name }}</el-form-item>
            <el-form-item label="系统管理员账号">
              {{ formObj.adminName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统回调地址">
              {{ formObj.redirectUrl }}
            </el-form-item>
            <el-form-item label="系统管理员密码">********</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统编码">
              {{ formObj.contactCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="8">
            <el-form-item label="归属单位">{{ formObj.unitBelong }}</el-form-item>
            <el-form-item label="承建单位">{{ formObj.contractor }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属单位联系人">
              {{ formObj.unitBelongContact }}
            </el-form-item>
            <el-form-item label="承建单位联系人">
              {{ formObj.contractorContact }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属单位联系方式"> {{ formObj.unitBelongContactPhone }} </el-form-item>
            <el-form-item label="承建单位联系方式">
              {{ formObj.contractorPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-form-item label="备注">{{ formObj.desc }}</el-form-item>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCurTab()">关闭</el-button>
      </span>
    </template>
  </Main>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getSystemDetail, SUCCESS_CODE, SysDetail } from '@/api'
import { useRoute } from 'vue-router'
import { closeCurTab } from '@/hooks/tabs'

const route = useRoute()
const id = route.query.id as string

const formObj = ref<SysDetail>({
  id: '-',
  contactCode: '-',
  contractor: '-',
  unitBelongContact: '-',
  contractorContact: '-',
  unitBelongContactPhone: '-',
  contractorPhone: '-',
  desc: '-',
  name: '-',
  code: '-',
  adminName: '-',
  unitBelong: '-',
  status: null,
  adminPwd: '',
  redirectUrl: ''
})

onMounted(async () => {
  if (id) {
    const { code, data } = await getSystemDetail(id)
    if (code === SUCCESS_CODE) {
      formObj.value = Object.assign(formObj.value, data)
    }
  }
})
</script>
<style lang="less" scoped>
:deep(.el-form-item__content) {
  margin-right: 15px;
}
</style>
