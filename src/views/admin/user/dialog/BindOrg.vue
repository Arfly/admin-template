<template>
  <Main center>
    <template #title> 用户关联组织 </template>
    <template #content>
      <el-form
        ref="form"
        :inline="true"
        :rules="rules"
        label-width="110px"
      >
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
        <div class="sub-title">关联组织</div>
        <BindingPanel>
          <template #title>需要关联的组织</template>
          <template #label>请选择需要关联的内设机构（可多选），保存即生效</template>
          <template #content>
            <div class="org-container">
              <TreeWidthSearch
                ref="treeRef"
                :selected="boundOrgIds"
                @check-change="handleCheckChange"
              />
            </div>
          </template>
        </BindingPanel>
        <BindingPanel>
          <template #title>已选择的组织</template>
          <template #label>展示已选择的内设机构及其上级组织，可以取消关联，保存即生效</template>
          <template #content>
            <el-table
              :data="bindData"
              max-height="500"
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
              >
                <template #default="scope">
                  <div class="text-center">{{ scope.$index + 1 }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="组织名称"
                width="200"
                prop="organizationName"
              >
                <template #default="scope">
                  <div
                    v-show="scope.row.parentOrganizationName"
                    class="org-item"
                  >
                    <div class="org-parent">
                      <SvgIcon
                        class="img"
                        name="tree-fold"
                      />
                      <span class="name">{{ scope.row.parentOrganizationName }}</span>
                    </div>
                    <div class="org-name">
                      <SvgIcon
                        name="tree-leaf"
                        class="img"
                      />
                      <span class="name">{{ scope.row.organizationName }}</span>
                    </div>
                  </div>
                  <div v-show="!scope.row.parentOrganizationName">
                    <div class="no-parent-item">
                      <icon
                        class="parent-icon"
                        :name="Document"
                      />
                      <span class="name">{{ scope.row.organizationName }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="是否为主要组织"
                width="192"
              >
                <template #default="scope">
                  <el-select v-model="scope.row.major">
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
                label="操作"
                width="60"
                center
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
      <el-button @click="close">取 消</el-button>
    </template>
  </Main>
</template>

<script setup lang="ts">
import { bindOrg, DefaultOrgTreeItem, getRelationOrgByUser, SUCCESS_CODE, UserRelationOrgItem } from '@/api'
import { useStore } from '@/store'
import TreeWidthSearch from '@/views/components/TreeWidthSearch.vue'
import { Delete, Document } from '@element-plus/icons-vue'
import { ElMessage, FormRules } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id, name, realName } = route.query

const rules = ref<FormRules>()
const bindData = ref<UserRelationOrgItem[]>([])
const treeRef = ref<InstanceType<typeof TreeWidthSearch>>()

const boundOrgIds = computed(() => bindData.value.map(item => item.organizationId))

async function getBindOrg(id: string) {
  const bindOrg = await getRelationOrgByUser(id)
  if (bindOrg.code === SUCCESS_CODE) {
    bindData.value = bindOrg.data
  }
}

const store = useStore()

function handleCheckChange(data: DefaultOrgTreeItem, checked) {
  if (checked) {
    if (bindData.value.findIndex(item => item.organizationId === data.id) === -1) {
      bindData.value = [
        ...bindData.value,
        {
          major: 0,
          organizationId: data.id,
          organizationName: data.name,
          organizationSource: data.source,
          parentOrganizationName: data.parentName
        }
      ]
    }
  } else {
    const index = bindData.value.findIndex(item => item.organizationId === data.id)
    if (index !== -1) {
      bindData.value.splice(index, 1)
    }
  }
}
function onDelete(row) {
  const index = bindData.value.findIndex(item => item.organizationId === row.organizationId)
  bindData.value.splice(index, 1)
}

async function onSubmit() {
  const bindPost = bindData.value.map(item => {
    const { major, organizationId } = item
    return {
      id: organizationId,
      major
    }
  })
  const { code } = await bindOrg({
    userId: id as string,
    orgList: bindPost
  })
  if (code === SUCCESS_CODE) {
    ElMessage.success('成功关联组织')
    await getBindOrg(id as string)
  }
}

const close = () => {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}

onMounted(() => {
  if (id) {
    getBindOrg(id as string)
  }
})
</script>

<style scoped lang="less">
.org-container {
  box-sizing: border-box;
  width: 320px;
  height: 450px;
  padding: 8px 12px;
}

.org-parent {
  display: flex;
  align-items: center;
}
.org-name {
  padding-left: 20px;
  display: flex;
  align-items: center;
}

.name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.parent-icon {
  color: #c3c3c3;
  margin-right: 5px;
  font-size: 12px;
}

.no-parent-item {
  display: flex;
  align-items: center;
}

.img {
  width: 12px;
  height: 12px;
  margin-right: 9px;
}
</style>
