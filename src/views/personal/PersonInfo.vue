<template>
  <el-dialog
    v-model="dialogVis"
    :title="isEdit ? '编辑用户信息' : '个人中心'"
    width="70%"
    style="height: 83%"
    @close="dialogClosed"
  >
    <div
      v-loading="loading"
      style="height: 780px"
    >
      <p
        style="color: #343434; font-size: 16px"
        class="mb-20"
      >
        基本资料
      </p>
      <!-- 查看 -->
      <ViewForm
        v-if="isEdit === false"
        ref="viewFormRef"
        :data="dataForm"
        :post-data="postData"
        :org-data="orgData"
      />
      <!-- 修改 -->
      <EditForm
        v-if="isEdit === true"
        ref="editFormRef"
        :data="dataForm"
        :post-data="postData"
        :org-data="orgData"
      />
    </div>
    <template #footer>
      <div class="dialog-footer df-c">
        <div v-show="isEdit === false">
          <el-button
            v-show="dataForm.source === SOURCE_TYPE['内部新增']"
            type="primary"
            @click="dialogEdit"
          >
            编辑
          </el-button>
          <el-button @click="dialogClosed">关闭</el-button>
        </div>
        <div v-show="isEdit === true">
          <el-button
            type="primary"
            @click="onSubmit"
          >
            确认
          </el-button>
          <el-button @click="onClosed">取消</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  getRelationOrgByUser,
  getUserDetail,
  SUCCESS_CODE,
  userPostList,
  editSelfUser,
  UserDetail,
  UserBindPostItem,
  UserRelationOrgItem
} from '@/api'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, watch } from 'vue'

import EditForm from './form/EditForm.vue'
import ViewForm from './form/ViewForm.vue'
import { SOURCE_TYPE } from '@/hooks/useConfig'

const props = defineProps({
  visible: {
    type: Boolean,
    value: false
  }
})
const isEdit = ref(false)

const loading = ref(false)

const emit = defineEmits(['close'])
const userInfo = JSON.parse(localStorage.getItem('accessToken')).userinfo

const DEFAULT: UserDetail = {
  credentialsCode: null,
  credentialsType: 1,
  email: null,
  gender: 1,
  id: null,
  mobile: null,
  name: null,
  realName: null,
  remark: '',
  source: null,
  status: null,
  userCode: null,
  uniformId: null
}

const dataForm = ref<UserDetail>(DEFAULT)

const editFormRef = ref()

const postData = ref<UserBindPostItem[]>([])
const orgData = ref<UserRelationOrgItem[]>([])

const dialogVis = ref(false)
watch(
  () => props.visible,
  async val => {
    dialogVis.value = props.visible
    if (val) {
      const postResult = await userPostList(userInfo.id)
      if (postResult.code === SUCCESS_CODE) {
        postData.value = postResult.data
      }
      const orgResult = await getRelationOrgByUser(userInfo.id)
      if (orgResult.code === SUCCESS_CODE) {
        orgData.value = orgResult.data
      }
    }
  },
  {
    immediate: true
  }
)
watch(
  isEdit,
  async () => {
    loading.value = true
    const { code, data } = await getUserDetail(userInfo.id)
    if (code === SUCCESS_CODE) {
      dataForm.value = data
    }
    loading.value = false
  },
  {
    immediate: true
  }
)

function dialogClosed() {
  emit('close')
}

function dialogEdit() {
  isEdit.value = true
}

function onSubmit() {
  editFormRef.value.validate(() => {
    ElMessageBox.confirm('个人信息已编辑，是否确认更新?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(async () => {
      const { gender, remark, email, realName, credentialsType, credentialsCode } = editFormRef.value.formData
      const params = {
        gender: gender || null,
        email: email || null,
        remark,
        realName,
        credentialsType,
        credentialsCode
      }

      const res = await editSelfUser(params)
      if (res.code === SUCCESS_CODE) {
        ElMessage.success('修改信息成功！')
        onClosed()
      }
    })
  })
}

function onClosed() {
  isEdit.value = false
  editFormRef.value.clearData()
}
</script>
