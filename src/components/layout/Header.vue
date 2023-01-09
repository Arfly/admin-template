<template>
  <el-header height="64px">
    <div class="header_left">Admin Title</div>
    <div class="header_right">
      <el-dropdown
        size="medium"
        trigger="click"
      >
        <div class="user_info df-c">
          <el-avatar
            :size="30"
            :src="avatar"
          />
          <span class="username df-vc">
            {{ userName }}
            <icon
              :name="ArrowDown"
              style="width: 1em; height: 1em; margin-left: 8px"
            />
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              command="user"
              @click="visible = true"
            >
              修改密码
            </el-dropdown-item>
            <el-dropdown-item
              command="user"
              @click="openPersonInfoDialog()"
            >
              个人中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <svgIcon
        name="signout"
        size="28"
        style="cursor: pointer"
        @click="handleCommand"
      />
    </div>
    <PersonInfo
      v-if="personInfoVisible"
      v-model:visible="personInfoVisible"
      @close="personInfoVisible = false"
    />

    <!--  修改密码的弹框-->
    <el-dialog
      v-model="visible"
      title="修改密码"
      width="33%"
      class="auto"
      @close="dialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        v-if="succeed"
        ref="formRef"
        :model="formObj"
        label-width="140px"
        :rules="formRules"
      >
        <el-row justify="center">
          <el-form-item
            label="原密码"
            prop="pwd"
          >
            <el-input
              v-model="formObj.pwd"
              placeholder="请输入原密码"
              minlength="8"
              maxlength="20"
              style="width: 280px"
            />
          </el-form-item>
        </el-row>
        <el-row justify="center">
          <el-form-item
            label="新密码"
            prop="newPwd"
          >
            <el-input
              v-model="formObj.newPwd"
              placeholder="请输入新密码"
              type="password"
              show-password
              minlength="8"
              maxlength="20"
              style="width: 280px"
            />
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
              placeholder="请再次输入新密码"
              minlength="8"
              maxlength="20"
              style="width: 280px"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <el-row
        v-else
        style="display: flex; flex-direction: column; align-items: center; padding-top: 33px; padding-bottom: 33px"
      >
        <svgIcon
          name="succeed"
          size="48"
          style="margin-bottom: 16px"
        />
        <p>密码修改成功</p>
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
  </el-header>
</template>

<script>
import { logout, modifyUserPwd, SUCCESS_CODE } from '@/api'
import { ArrowDown } from '@element-plus/icons-vue'
import avatar from '@/assets/img/admin.png'
import { cleanSystem } from '@/common/common'
import { regToPassword } from '@/common/utils'
import { RESET_PWD } from '@/validator'
import md5 from 'js-md5'
import { computed, getCurrentInstance, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import PersonInfo from '@/views/personal/PersonInfo.vue'

export default {
  components: {
    PersonInfo
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    const store = useStore()
    const visible = ref(false)
    const formObj = ref({})
    const succeed = ref(true)
    const state = reactive({
      isFullScreen: false,
      avatar
    })
    const formRef = ref(null)
    const userName = computed(() => store.getters.getUserName)

    // 打开个人中心
    const personInfoVisible = ref(false)
    const openPersonInfoDialog = () => {
      personInfoVisible.value = true
    }

    const equalToPassword = (rule, value, callback) => {
      if (formObj.value.newPwd !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        const msg = regToPassword(value)
        msg ? callback(new Error(msg)) : callback()
      }
    }
    const formRules = ref({
      pwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
      newPwd: RESET_PWD.newPwd,
      confirmPwd: [...RESET_PWD.confirmPwd, { required: true, validator: equalToPassword, trigger: 'blur' }]
    })

    const handleCommand = command => {
      if (command === 'user') {
        router.push('/user')
      } else {
        logout().then(() => {
          cleanSystem()
          store.dispatch('clearUser')
          proxy.$message?.success('退出成功')
          router.replace('/login')
        })
      }
    }
    const changePwd = () => {
      formRef.value.validate(async valid => {
        if (!valid) return
        modifyUserPwd({
          pwd: md5(formObj.value.pwd),
          newPwd: md5(formObj.value.newPwd)
        }).then(res => {
          if (res.code === SUCCESS_CODE) {
            succeed.value = false
          }
        })
      })
    }
    const dialogClosed = () => {
      visible.value = false
      succeed.value = true
      formObj.value = {}
      formRef.value.resetFields()
    }
    return {
      userName,
      handleCommand,
      ...toRefs(state),
      visible,
      changePwd,
      formObj,
      formRules,
      dialogClosed,
      formRef,
      succeed,
      openPersonInfoDialog,
      personInfoVisible,
      ArrowDown
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/variable.less';
.el-header {
  width: 100vw;
  padding: 0 32px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-image: url('../../assets/img/bg_head.png');
  background-size: cover;

  .header_left {
    flex: 1;
    font-size: @header-font-size;
    color: #ffffff;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .header_right {
    display: flex;
    align-items: center;
    padding-left: 8px;
    width: auto;

    & > i {
      padding: 8px 6px;
      font-size: 20px;
      cursor: pointer;
    }

    .user_info {
      width: auto;
      text-align: right;
      cursor: pointer;
    }

    .el-avatar {
      vertical-align: middle;
    }

    span.username {
      font-size: 20px;
      color: #ffffff;
      margin-left: 12px;
      margin-right: 24px;
      vertical-align: middle;
    }
  }
}
</style>
