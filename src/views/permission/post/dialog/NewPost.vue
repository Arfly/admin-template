<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="formRef"
        :model="formObj"
        label-width="100px"
        :rules="formRules"
      >
        <el-form-item
          label="岗位名称"
          prop="positionName"
        >
          <el-input
            v-model="formObj.positionName"
            placeholder="请输入..."
            maxlength="20"
          />
        </el-form-item>

        <el-form-item
          label="岗位编码"
          prop="id"
        >
          <el-input
            v-model="formObj.id"
            placeholder="系统自动生成"
            maxlength="20"
            disabled
          />
        </el-form-item>

        <el-divider />

        <el-form-item style="padding-left: 15px; padding-right: 15px">
          <template #label> <span class="danger-color">*</span>&nbsp;组织关联 </template>
          <BindingPanel>
            <template #title> 需要关联的组织 </template>
            <template #label>可以选择需要关联的组织（可多选），保存即生效</template>
            <template #content>
              <TreeWidthSearch
                ref="treeRef"
                :height="318"
                @check-change="handleCheckChange"
                @load="getPostBindOrgs"
              />
            </template>
          </BindingPanel>
          <BindingPanel>
            <template #title> 已选择的组织 </template>
            <template #label>展示已选择的组织，可以取消关联，保存即生效</template>
            <template #content>
              <el-table
                :data="treeSelectData"
                style="width: 100%; height: 330px"
                max-height="500"
              >
                <el-table-column
                  label="序号"
                  type="index"
                  width="55"
                />
                <el-table-column
                  label="组织名称"
                  prop="name"
                >
                  <template #default="scope">
                    <div class="org-node">
                      <div
                        v-show="scope.row.name"
                        class="parent"
                        :title="scope.row.name"
                      >
                        <icon
                          class="icon"
                          :name="CaretBottom"
                        />
                        <span>{{ scope.row.name }}</span>
                      </div>
                      <div class="children">{{ scope.row.children }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="60"
                >
                  <template #default="scope">
                    <icon
                      color="#ed5565"
                      style="cursor: pointer"
                      :name="Delete"
                      @click="deleteTree(scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </BindingPanel>
        </el-form-item>

        <el-divider />

        <el-form-item
          label="备注"
          prop="desc"
          style="padding-left: 15px; padding-right: 15px"
        >
          <Remark v-model="formObj.desc" />
        </el-form-item>
      </el-form>
    </template>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="submitUser"
        >
          确 定
        </el-button>
        <el-button @click="dialogClosed">取 消</el-button>
      </span>
    </template>
  </Main>
</template>
<script setup lang="ts">
import { SUCCESS_CODE, postAdd, PostDetailData, DefaultOrgTreeItem } from '@/api'
import Remark from '@/components/common/Remark.vue'
import { ElMessage, FormRules } from 'element-plus'
import { ref } from 'vue'
import TreeWidthSearch from '@/views/components/TreeWidthSearch.vue'
import { CaretBottom, Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['editSuccess', 'close', 'submit'])

const formRef = ref(null)
const editVisible = ref(false)
const formObj = ref<PostDetailData>({
  positionName: '',
  desc: '',
  status: null,
  createBy: '',
  deleted: null,
  department: '',
  deptCode: '',
  id: '',
  lastUpdateBy: ''
})

const treeSelectData = ref<
  {
    id: string
    name: string
    children: string
  }[]
>([])
const treeRef = ref()
const bindData = ref<DefaultOrgTreeItem[]>([])

async function getPostBindOrgs() {}

const dialogClosed = () => {
  editVisible.value = false
  emit('close')
}
const formRules = ref<FormRules>({
  positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
})

const deleteTree = index => {
  if (treeSelectData.value.length <= 1) {
    ElMessage.info('请至少关联一个组织')
  } else {
    const orgToDel = treeSelectData.value[index]
    treeSelectData.value.splice(index, 1)
    treeRef.value.setCheckedKeys([orgToDel.id], false)

    removeFromBindData(orgToDel.id)
  }
}

function removeFromBindData(id: string) {
  const _index = bindData.value.findIndex(item => item.id === id)
  if (_index !== -1) {
    bindData.value.splice(_index, 1)
  }
}
const submitUser = () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    if (treeSelectData.value.length === 0 && bindData.value.length === 0) {
      return ElMessage.info('请至少关联一个组织')
    }
    let res

    const { positionName, desc } = formObj.value
    res = await postAdd({
      positionName,
      desc,
      organizationIds: [...treeSelectData.value.map(item => item.id), ...bindData.value.map(item => item.id)]
    })

    if (res.code === SUCCESS_CODE) {
      ElMessage.success('岗位已成功创建')
    }
  })
}

function handleCheckChange(data: DefaultOrgTreeItem, checked) {
  if (
    checked &&
    treeSelectData.value.findIndex(item => item.id === data.id) === -1 &&
    bindData.value.findIndex(item => item.id === data.id) === -1
  ) {
    bindData.value = [...bindData.value, data]
  }

  if (!checked) {
    removeFromBindData(data.id)
  }
}
</script>
<style lang="less" scoped>
.el-col-8 {
  padding-left: 15px;
  padding-right: 15px;
}
.el-card {
  height: auto;
  width: 100%;
}
:deep(.el-card__body) {
  padding: 12px;
  p {
    line-height: 18px;
    min-height: 36px;
  }
}
:deep(.el-card__header) {
  font-size: 16px;
  line-height: 16px;
  min-height: 38px;
}

.org-node {
  display: flex;
  flex-direction: column;

  .parent {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
    }
  }
  .children {
    padding-left: 20px;
    margin-top: 5px;
    margin-left: 20px;
  }
}
</style>
