<template>
  <Main center>
    <template #title> {{ route.meta.title }} </template>
    <template #content>
      <el-form ref="form">
        <el-form-item label="用户名">
          <el-input
            :value="name"
            disabled
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            :value="realName"
            disabled
          />
        </el-form-item>
      </el-form>
      <el-divider
        direction="horizontal"
        content-position="left"
      />

      <div class="binding-panel-container">
        <div class="sub-title">关联岗位</div>
        <BindingPanel>
          <template #title>需要关联的岗位 </template>
          <template #label>请选择需要关联的岗位（可多选），保存即生效 </template>
          <template #content>
            <PostTable
              ref="postTableRef"
              :bind="existEdPost"
              :selected="bindData"
              @selection-change="handleSelectionChange"
              @remove-select="onSelectRemove"
            />
          </template>
        </BindingPanel>

        <BindingPanel>
          <template #title>已选择的岗位 </template>
          <template #label>展示已选择的岗位，可以取消关联，保存即生效 </template>
          <template #content>
            <el-table
              :data="bindData"
              max-height="500"
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
                align="center"
              />
              <el-table-column
                label="岗位名称"
                prop="positionName"
                width="176"
              />
              <el-table-column
                label="是否为临时权限"
                width="140"
              >
                <template #default="scope">
                  <el-select
                    v-model="scope.row.brief"
                    :disabled="existEdPost.includes(scope.row.positionId)"
                    @change="onBriefChange(scope.row)"
                  >
                    <el-option
                      :key="0"
                      :label="'否'"
                      :value="0"
                    />
                    <el-option
                      :key="1"
                      :label="'是'"
                      :value="1"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="权限时长"
                width="150"
              >
                <template #default="scope">
                  <el-select
                    v-model="scope.row.timeLimit"
                    :disabled="scope.row.brief === 0 || existEdPost.includes(scope.row.positionId)"
                  >
                    <el-option
                      :key="'3'"
                      :label="'3天'"
                      :value="'3'"
                    />
                    <el-option
                      :key="'7'"
                      :label="'7天'"
                      :value="'7'"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="63"
                align="center"
              >
                <template #default="scope">
                  <el-button
                    type="text"
                    size="default"
                    @click="onDelete(scope.row)"
                  >
                    <icon :name="Delete" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </BindingPanel>
      </div>
    </template>

    <template #footer>
      <el-button
        type="primary"
        @click="onSubmit"
      >
        确 认
      </el-button>
      <el-button @click="closeCurTab()">取 消</el-button>
    </template>
  </Main>
</template>

<script setup lang="ts">
import { bindPosition, SUCCESS_CODE, UserBindPostItem, userPostList } from '@/api'
import { closeCurTab } from '@/hooks/tabs'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PostTable from '../table/PostTable.vue'
const route = useRoute()
const existEdPost = ref<string[]>([])
const postTableRef = ref()
const { id, name, realName } = route.query

async function getBindPost() {
  const { code, data } = await userPostList(id as string)
  if (code === SUCCESS_CODE) {
    bindData.value = data
    existEdPost.value = bindData.value.map(item => item.positionId)
  }
}

const bindData = ref<UserBindPostItem[]>([])
function handleSelectionChange(selected: UserBindPostItem[]) {
  bindData.value = [...selected]
}

function onDelete(row) {
  const index = bindData.value.findIndex(item => item.positionId === row.positionId)
  if (index !== -1) {
    bindData.value.splice(index, 1)
  }

  postTableRef.value.toggleRowSelection(row.positionId, false)

  const bindUserIndex = existEdPost.value.findIndex(id => id === row.positionId)
  if (bindUserIndex !== -1) {
    existEdPost.value.splice(bindUserIndex, 1)
  }
}

async function onSubmit() {
  const bindPost = bindData.value.map(item => {
    const { brief, positionId, timeLimit } = item
    return {
      id: positionId,
      brief,
      timeLimit
    }
  })

  const { code } = await bindPosition({
    userId: id as string,
    positionList: bindPost
  })

  if (code === SUCCESS_CODE) {
    ElMessage.success('成功关联岗位')
    getBindPost()
  }
}

function onBriefChange(data: UserBindPostItem) {
  if (data.brief === 0) {
    // eslint-disable-next-line no-param-reassign
    data.timeLimit = null
  } else {
    // eslint-disable-next-line no-param-reassign
    data.timeLimit = '3'
  }
}

function onSelectRemove(index: number) {
  bindData.value.splice(index, 1)
}

onMounted(() => {
  if (route.query.id) {
    getBindPost()
  }
})
</script>
