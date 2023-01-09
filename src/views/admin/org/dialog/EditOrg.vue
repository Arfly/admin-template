<template>
  <Main center>
    <template #content>
      <el-form
        ref="formEl"
        class="custom-form"
        :model="form"
        label-width="130px"
        :rules="formRules"
      >
        <el-form-item
          label="组织名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            placeholder=""
            clearable
          />
          <Tip :content="NEW_ORG_TOOLTIP.NAME" />
        </el-form-item>

        <el-form-item label="市认证组织编码">
          <el-input
            v-model="form.creditCode"
            disabled
            placeholder=""
            clearable
          />
        </el-form-item>

        <el-form-item label="组织代码">
          <el-input
            v-model="form.code"
            disabled
            placeholder=""
            clearable
          />
        </el-form-item>

        <el-form-item label="上级组织">
          <el-input
            v-model="form.parentName"
            disabled
            placeholder=""
            clearable
          />
        </el-form-item>

        <el-form-item label="组织层级">
          <el-input
            v-model="form.level"
            disabled
            placeholder=""
            clearable
          />
        </el-form-item>

        <el-form-item
          label="组织类型"
          prop="unitTypeCode"
        >
          <el-select v-model="form.unitTypeCode">
            <el-option
              v-for="item in UNIT_TYPE_LIST"
              :key="`${item.key}`"
              :label="item.value"
              :value="`${item.key}`"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="来源类型">
          <el-input
            :value="SOURCE_TYPE[form.source]"
            disabled
            placeholder=""
          />
        </el-form-item>

        <el-form-item label="组织全路径">
          <el-input
            v-model="form.orgDisplayPath"
            disabled
            placeholder=""
            clearable
          />
        </el-form-item>
        <el-divider />
        <el-form-item
          class="w-100"
          label="备注"
        >
          <Remark v-model="form.description" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        type="primary"
        size="default"
        @click="onSure"
      >
        确认
      </el-button>
      <el-button
        size="default"
        @click="store.dispatch('removeTab', store.state.tabs.activeTab)"
      >
        关闭
      </el-button>
    </template>
  </Main>
</template>

<script setup lang="ts">
import { getOrgDetail, SUCCESS_CODE, updateOrg } from '@/api'
import { NEW_ORG_VALIDATOR } from '@/validator'
import Remark from '@/components/common/Remark.vue'
import { NEW_ORG_TOOLTIP } from '@/text'
import { SOURCE_TYPE, UNIT_TYPE, UNIT_TYPE_LIST } from '@/hooks/useConfig'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import Tip from '@/views/components/panel/Tip.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'

const formEl = ref<FormInstance>()

const store = useStore()
const route = useRoute()

const id = route.query.id as string

const form = ref({
  name: null,
  parentName: null,
  level: 0,
  code: null,
  creditCode: null,
  description: null,
  unitType: null,
  unitTypeCode: null,
  orgDisplayPath: null,
  source: null
})

const formRules = reactive<FormRules>(NEW_ORG_VALIDATOR)

onMounted(async () => {
  const detailRes = await getOrgDetail(id)
  if (detailRes.code === SUCCESS_CODE) {
    const { name, unitType, unitTypeCode, description, creditCode, parentName, level, source, orgDisplayPath, code } =
      detailRes.data
    form.value = {
      unitType,
      creditCode: creditCode || '--',
      name,
      unitTypeCode,
      description,
      parentName,
      level,
      source,
      orgDisplayPath,
      code
    }
  }
})

async function onSure() {
  formEl.value.validate(async value => {
    if (value) {
      const { name, unitTypeCode, orgDisplayPath, description } = form.value
      const { code } = await updateOrg({
        id: id,
        name,
        unitTypeCode,
        unitType: UNIT_TYPE[form.value.unitTypeCode],
        description,
        orgDisplayPath
      })

      if (code === SUCCESS_CODE) {
        ElMessage.success('修改组织信息成功！')
      }
    }
  })
}
</script>

<style scoped lang="less">
:deep('.el-form-item') {
  width: 450px !important;
}
</style>
