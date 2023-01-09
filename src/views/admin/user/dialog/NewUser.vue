<template>
  <Main center>
    <template #content>
      <NewUserForm
        ref="formRef"
        v-model="newForm"
      />
    </template>
    <template #footer>
      <el-button
        type="primary"
        @click="submitUser"
      >
        确 定
      </el-button>
      <el-button @click="closeCurTab()">关 闭</el-button>
    </template>
  </Main>
</template>
<script setup lang="ts">
import { SUCCESS_CODE, createUser, NewUserData } from '@/api'
import { ElForm, ElMessage } from 'element-plus'
import md5 from 'js-md5'
import { ref } from 'vue'
import NewUserForm from '../form/NewUserForm.vue'
import Main from '@/components/layout/Main.vue'
import { closeCurTab } from '@/hooks/tabs'

const newForm = ref<NewUserData>()
const formRef = ref<InstanceType<typeof ElForm>>()
const submitUser = () => {
  formRef.value.validate(async () => {
    const { code } = await createUser({
      ...newForm.value,
      email: newForm.value.email || null,
      pwd: md5(newForm.value.pwd)
    })

    if (code === SUCCESS_CODE) {
      closeCurTab()
      ElMessage.success('用户已成功创建')
    }
  })
}
</script>
