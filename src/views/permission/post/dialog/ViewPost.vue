<template>
  <Main center>
    <!--内容主体区域-->
    <template #content>
      <el-form
        ref="form"
        :model="formObj"
        label-width="120px"
      >
        <el-form-item label="岗位名称">
          {{ formObj.positionName }}
        </el-form-item>

        <el-form-item label="岗位编号">{{ formObj.id }}</el-form-item>

        <el-divider />
        <el-form-item label="组织关联">
          <el-table
            :data="groupData"
            height="240"
          >
            <el-table-column
              label="组织"
              prop="name"
            />
            <el-table-column
              label="上级组织"
              prop="parentName"
            />
            <el-table-column label="组织是否有效">
              <template #default="scope">
                {{ scope.row.active ? '是' : '否' }}
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
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
<script setup lang="ts">
import { getPostRelatedOrgList, PostBindOrgListItem, postDetail, PostDetailData, SUCCESS_CODE } from '@/api'
import { closeCurTab } from '@/hooks/tabs'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.query.id as string

const groupData = ref<PostBindOrgListItem[]>([])

const formObj = ref<PostDetailData>({
  positionName: '-',
  desc: '-',
  status: null,
  createBy: '-',
  deleted: false,
  department: '-',
  deptCode: '-',
  id: '-',
  lastUpdateBy: '-'
})

onMounted(async () => {
  if (id) {
    const postDetailRes = await postDetail(id)
    if (postDetailRes.code === SUCCESS_CODE) {
      formObj.value = postDetailRes.data
    }

    const postBindOrgListRes = await getPostRelatedOrgList(id)
    if (postBindOrgListRes.code === SUCCESS_CODE) {
      groupData.value = postBindOrgListRes.data
    }
  }
})
</script>
<style lang="less" scoped>
:deep(.mark .el-form-item__label:before) {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
  margin-top: 4px;
}
</style>
