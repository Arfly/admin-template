<template>
  <Main center>
    <template #content>
      <el-form
        ref="formRef"
        class="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        :inline="false"
        size="normal"
      >
        <el-form-item
          label="组织名称"
          prop="name"
        >
          <el-input
            v-model.trim="form.name"
            placeholder="请输入..."
          />
          <Tip :content="NEW_ORG_TOOLTIP.NAME" />
        </el-form-item>

        <el-form-item label="组织代码">
          <el-input
            :value="'系统自动生成'"
            disabled
          >
            <template #prepend>SE-</template>
          </el-input>
        </el-form-item>

        <el-form-item
          label="组织类型"
          prop="unitTypeCode"
        >
          <el-select
            v-model="form.unitTypeCode"
            placeholder="请选择..."
            clearable
            filterable
          >
            <el-option
              v-for="item in UNIT_TYPE_LIST"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="上级组织">
          <el-input
            :value="name"
            disabled
          />
        </el-form-item>

        <el-form-item label="组织层级">
          <el-input
            :value="parseInt(level) || 0 + 1"
            disabled
          />
        </el-form-item>

        <el-form-item prop="creditCode">
          <template #label>
            <span class="verify-code">统一社会信用代码</span>
          </template>
          <el-input
            v-model="form.creditCode"
            placeholder="请输入..."
          />
          <Tip :content="NEW_ORG_TOOLTIP.CREDIT_CODE" />
        </el-form-item>

        <FomTip />

        <el-divider
          direction="horizontal"
          content-position="left"
        />

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
        @click="onSubmit"
      >
        确认
      </el-button>
      <el-button
        size="default"
        @click="onCancel"
      >
        取消
      </el-button>
    </template>
  </Main>
</template>

<script setup lang="ts">
import { createOrg, SUCCESS_CODE } from '@/api'
import { UNIT_TYPE, UNIT_TYPE_LIST } from '@/hooks/useConfig'
import { ElMessage, FormRules, ElForm } from 'element-plus'
import { computed, ref } from 'vue'
import FomTip from '@/components/FormTip.vue'
import Remark from '@/components/common/Remark.vue'
import { NEW_ORG_VALIDATOR } from '@/validator'
import Tip from '../../../components/panel/Tip.vue'
import { NEW_ORG_TOOLTIP } from '@/text'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const route = useRoute()
const store = useStore()

const { parentIds, orgDisplayPath, level, id, name } = route.query as {
  parentIds: string
  orgDisplayPath: string
  level: string
  id: string
  name: string
}

const props = defineProps<{
  rowObj: {
    name: string
    parentIds: string
    orgDisplayPath: string
    level: number
    id: string
  }
  visible: boolean
}>()

const rules: FormRules = NEW_ORG_VALIDATOR

const formRef = ref<InstanceType<typeof ElForm>>()

const form = ref({
  level: parseInt(level) || 0 + 1,
  name: null,
  parentIds,
  orgDisplayPath,
  unitType: null,
  unitTypeCode: null,
  creditCode: null,
  description: null,
  parentId: id
})

async function onSubmit() {
  formRef.value.validate(async valid => {
    if (valid) {
      const { code } = await createOrg({
        ...form.value,
        unitType: UNIT_TYPE[form.value.unitTypeCode],
        orgDisplayPath: fullPath.value,
        level: props.rowObj.level + 1
      })
      if (code === SUCCESS_CODE) {
        ElMessage.success('成功创建组织')
      }
    }
  })
}

const fullPath = computed(() => `${props.rowObj.orgDisplayPath}${form.value.name ? `/${form.value.name}` : ''}`)

function onCancel() {
  store.dispatch('removeTab', store.state.tabs.activeTab)
}
</script>

<style lang="less" scoped>
@import url('@/assets/styles/variable.less');
:deep(.el-input-group__prepend) {
  background-color: #fff;
}

.verify-code {
  width: 100px;
  text-align: right;
  padding-left: 20px;
}

.form {
  row-gap: 24px;
}

:deep(.el-divider) {
  margin-bottom: @main-padding - @margin-vertical;
  margin-top: @main-padding - @margin-vertical;
}
</style>
