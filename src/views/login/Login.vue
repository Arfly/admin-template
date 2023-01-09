<template>
  <div class="login">
    <div class="login_from">
      <el-card
        class="login_center"
        shadow="never"
      >
        <div class="title">
          <span>登录</span>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginFormState"
          :rules="rules"
        >
          <el-form-item prop="name">
            <el-input
              v-model.trim="loginFormState.name"
              clearable
              :maxlength="USER_NAME_LENGTH"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <svgIcon
                  name="username"
                  size="24"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              v-model.trim="loginFormState.pwd"
              clearable
              maxlength="20"
              placeholder="请输入密码"
              show-password
              size="large"
              @keyup.enter.exact="handleLogin"
            >
              <template #prefix>
                <svgIcon
                  name="password"
                  :color="COLORS.ICON_ACTIVE_COLOR"
                  size="24"
                />
              </template>
            </el-input>
          </el-form-item>
          <p
            v-if="userError"
            style="color: #ff4f4f"
          >
            {{ userError }}
          </p>
          <el-form-item
            v-if="loginFormState.codeImg"
            prop="code"
          >
            <div style="display: flex; justify-content: space-between; width: 100%">
              <el-input
                v-model.trim="loginFormState.code"
                clearable
                maxlength="20"
                placeholder="请输入验证码"
                size="large"
                style="width: 220px"
                @keyup.enter.exact="handleLogin"
              >
                <template #prefix>
                  <svgIcon
                    name="password"
                    :color="COLORS.ICON_ACTIVE_COLOR"
                    size="24"
                  />
                </template>
              </el-input>
              <img
                :src="`data:;base64,${loginFormState.codeImg}`"
                style="height: 60px"
                @click="getCaptcha"
              />
            </div>
          </el-form-item>
          <el-form-item :style="{ marginTop: userError ? '10px' : '50px' }">
            <el-button
              :loading="loading"
              size="large"
              style="width: 100%"
              type="primary"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
          <el-divider>快捷登录</el-divider>
          <div class="yuezhengyi-login">
            <img
              src="@/assets/img/login/zhengyi.png"
              style="cursor: pointer"
              @click="goZhengYi"
            />
            <p>粤政易</p>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { captcha, login } from '@/api/login.js'
import md5 from 'js-md5'
import useCookie from '@/hooks/useCookie'
import { CODE_ERROR, LACK_ERROR, SUCCESS_CODE, USER_ERROR, USER_INVALIDATOR_ERROR, VERIFY_ERROR } from '@/api'
import { getLoginSearch, tokenTestimonials } from '@/router'
import { ElMessage } from 'element-plus'
import { COLORS } from '@/config/color'

const USER_NAME_LENGTH = 40
const { getCookie } = useCookie()

const loginFormRef = ref()
const loading = ref(false)
const userError = ref('')
const loginFormState = reactive({
  name: '',
  pwd: '',
  code: '',
  codeImg: ''
})

const rules = {
  name: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' }
  ]
}
const handleLogin = () => {
  userError.value = ''
  loginFormRef.value.validate(valid => {
    if (!valid) {
      return false
    }
    loading.value = true
    const cookie = getCookie()
    const params = {
      account: loginFormState.name,
      pwd: md5(loginFormState.pwd),
      systemCode: cookie.systemCode || 'user-centre',
      captcha: loginFormState.code
    }

    login(params).then(async res => {
      loading.value = false
      if (res.code === SUCCESS_CODE) {
        const redirection = res.data as string
        const token = getLoginSearch(redirection).token
        if (import.meta.env.MODE === 'development') {
          window.location.href = `http://localhost:5173/user-centre/#/login?token=${token}`
        } else {
          if (params.systemCode === 'user-centre') {
            await tokenTestimonials(token)
            return
          }
          window.location.href = redirection
        }
      } else {
        userError.value = ''
        if (res.code === USER_ERROR || res.code === USER_INVALIDATOR_ERROR) userError.value = res.msg
        if (res.code === CODE_ERROR || res.code === LACK_ERROR || res.code === VERIFY_ERROR) {
          ElMessage.warning(res.msg)
          getCaptcha()
          return
        }
        if (typeof res.data !== 'string' && res.data?.needCaptcha && !loginFormState.codeImg) getCaptcha()
      }
    })
  })
}
const getCaptcha = () => {
  captcha(loginFormState.name).then(res => {
    if (res.code === SUCCESS_CODE) {
      loginFormState.codeImg = res.data
    }
  })
}
const goZhengYi = () => {
  const cookie = getCookie()
  const systemCode = cookie.systemCode || 'user-centre'
  location.assign(
    `${import.meta.env.VITE_APP_URL}/zwrz/rz/sso/oauth/authorize?response_type=code&scope=all&client_id=${
      import.meta.env.VITE_APP_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_APP_REDIRECT}${systemCode}`
  )
}
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/img/login/loginBg.png');
  background-size: cover;
  display: flex;
  justify-content: right;
  align-items: center;
  overflow: hidden;

  .login_from {
    width: 50%;
    position: relative;
    right: 0;

    :deep(.el-form) {
      display: flex;
      .el-form-item {
        width: 100%;
        margin-right: 0;
        margin-left: 0;

        .el-input {
          width: 100%;
        }
      }

      .el-form-item:nth-child(2) {
        margin-top: 24px;
      }
    }
    .login_center {
      width: 456px;
      height: 657px;
      margin: auto;

      .title {
        font-size: 40px;
        color: #333333;
        text-align: center;
        font-weight: 600;
        margin-top: 16px;
        margin-bottom: 50px;

        img {
          position: relative;
          top: 10px;
          right: 5px;
        }
      }
    }
  }
}

:deep(.el-card__body) {
  padding: 48px;
}

:deep(.el-input__inner) {
  height: 60px;
  font-size: 16px;
}

:deep(.el-divider) {
  margin-top: 48px;
  margin-bottom: 24px;

  .el-divider__text {
    font-size: 16px;
    color: #999999;
    line-height: 24px;
  }
}

:deep(.el-button) {
  background-color: #1177ee;
  padding: 29px 19px;
}

.yuezhengyi-login {
  flex: 1;
  text-align: center;
}
</style>
