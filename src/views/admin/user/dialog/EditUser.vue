<template>
  <Main center>
    <template #content>
      <EditUserForm
        ref="formRef"
        v-model="editForm"
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
import { SUCCESS_CODE, editUserForSuper, getUserDetail, UserDetail } from '@/api'
import { closeCurTab } from '@/hooks/tabs'
import { ElForm, ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import EditUserForm from '../form/EditUserForm.vue'

const route = useRoute()
const userId = route.query.id as string

const editForm = ref<UserDetail>()
const formRef = ref<InstanceType<typeof ElForm>>()

onMounted(async () => {
  if (userId) {
    const { code, data } = await getUserDetail(userId)
    if (code === SUCCESS_CODE) {
      editForm.value = data
    }
  }
})

const submitUser = () => {
  formRef.value.validate(async () => {
    const { id, mobile, name, gender, remark, email, realName, credentialsCode, credentialsType, uniformId } =
      editForm.value
    const { code } = await editUserForSuper({
      realName: realName || null,
      id,
      mobile,
      name,
      gender,
      remark,
      email: email || null,
      credentialsCode: credentialsCode || null,
      credentialsType: credentialsType || null,
      uniformId: uniformId
    })

    if (code === SUCCESS_CODE) {
      ElMessage.success('修改用户信息成功！')
    }
  })
}
</script>
