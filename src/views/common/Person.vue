<template>
  <el-row
    class="user"
    :gutter="16"
  >
    <el-col
      :sm="24"
      :md="8"
      :lg="6"
    >
      <el-card
        shadow="hover"
        style="margin-bottom: 16px"
      >
        <div class="user_left">
          <img
            class="avatar"
            src="@/assets/img/admin.png"
            draggable="false"
          />
          <p class="user_name">{{ userName }}</p>
          <!-- 个人信息 -->
          <div class="line">
            <SvgIcon name="message" />
            <span>XXXXXXXXXXXXXXX</span>
          </div>
          <div class="line">
            <SvgIcon name="postcard" />
            <span>超级管理员</span>
          </div>
          <div class="line">
            <SvgIcon name="location-information" />
            <span>深圳市</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col
      :sm="24"
      :md="16"
      :lg="18"
    >
      <el-card shadow="hover">
        <template #header>
          <span>信息设置</span>
        </template>
        <el-form
          ref="userFormRef"
          class="user_right"
          :model="userState"
          :rules="rules"
          label-width="96px"
        >
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model.trim="userState.name"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
          >
            <el-input
              v-model.trim="userState.email"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="职位"
            prop="title"
          >
            <el-input
              v-model.trim="userState.title"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="地址"
            prop="local"
          >
            <el-input
              v-model.trim="userState.local"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleClick('reset')"> 重置 </el-button>
            <el-button
              type="primary"
              @click="handleClick('save')"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/store'

export default {
  setup() {
    const userFormRef = ref()
    const userState = reactive({ name: '', email: '', title: '', local: '' })
    const rules = {
      name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
      ]
    }

    const store = useStore()
    const userName = computed(() => store.getters.getUserName)
    const handleClick = type => {
      if (type === 'reset') {
        userFormRef.value.resetFields()
        return
      }
      userFormRef.value.validate(valid => {
        if (!valid) {
          return false
        }
      })
    }

    return { userFormRef, userState, rules, handleClick, userName }
  }
}
</script>

<style lang="less" scoped>
.user_left {
  padding-top: 20px;
  .avatar {
    margin: 0 auto;
    display: block;
    width: 128px;
    height: 128px;
    border-radius: 50%;
  }

  .user_name {
    padding: 16px 0;
    font-size: 20px;
    line-height: 2;
    text-align: center;
  }

  .line {
    color: #555;
    line-height: 32px;
    i {
      margin-right: 8px;
      font-size: 18px;
    }
  }
}

.user_right {
  padding-right: 16px;
}
</style>
