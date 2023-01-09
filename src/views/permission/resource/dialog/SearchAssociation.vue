<template>
  <el-dialog
    v-model="dialogVis"
    title="关联后端资源"
    width="30%"
    @close="dialogClosed"
  >
    <!--内容主体区域-->
    <SearchInput
      v-model="search"
      @search="handleSearch"
    />
    <div
      v-show="result.length"
      v-loading="loading"
      class="search-result-container"
    >
      <template
        v-for="(item, index) in result"
        :key="index"
      >
        <div
          :class="`search-result-item ${select === index ? 'select' : ''}`"
          @click="onSelect(index)"
        >
          <p>{{ item.name }}</p>
          <p>{{ item.code }}</p>
        </div>
      </template>
    </div>
    <div
      v-show="noData"
      class="search-result-container"
    >
      <p class="search-result-item">
        <img
          :src="info"
          style="position: relative; top: 3px"
        />
        无此后端资源，请输入完整的资源名称或编码！
      </p>
    </div>
    <!--底部按钮区域-->
    <template #footer>
      <span class="dialog-footer">
        <el-button
          :disabled="!result.length || noData"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import info from '@/assets/icons/icon-prompt.png'
import { BackendResourceDetail, resourcePrecisionSearch, SUCCESS_CODE } from '@/api'

import SearchInput from '@/components/input/SearchInput.vue'
const emits = defineEmits(['close', 'editSuccess'])

const loading = ref(false)
const result = ref<BackendResourceDetail[]>([])
const noData = ref(false)
const select = ref()

const props = defineProps({
  visible: {
    type: Boolean,
    value: false
  }
})
const search = ref('')

watch(
  search,
  () => {
    if (!search.value) {
      noData.value = false
      result.value = []
    }
  },
  { immediate: true }
)

const dialogVis = ref(false)
watch(
  () => props.visible,
  () => {
    dialogVis.value = props.visible
    select.value = null
    result.value = []
    noData.value = false
  },
  {
    immediate: true
  }
)

function handleSearch() {
  loading.value = true
  resourcePrecisionSearch(search.value).then(res => {
    if (res.code === SUCCESS_CODE) {
      result.value = res.data || []
      noData.value = !result.value.length
    }
    loading.value = false
  })
}
const dialogClosed = () => {
  result.value = []
  search.value = ''
  emits('close')
}
function handleSubmit() {
  const data = result.value[select.value]

  emits('editSuccess', {
    backendResourceId: data.resourceId,
    backendResourceName: data.name,
    relationSystemName: data.relationSystemName,
    backendResourceCode: data.code,
    link: data.link
  })
}

function onSelect(index: number) {
  select.value = index
}
</script>
<style lang="less" scoped>
.search-result-container {
  max-height: 500px;
  overflow: auto;
  margin-top: 12px;

  .search-result-item {
    background: #f0f2f5;
    font-size: 16px;
    border: 1px solid rgba(221, 221, 221, 1);
    padding: 12px;
    display: flex;
    justify-content: space-between;
    color: #333333;
    font-weight: bold;
    margin: 5px 0;
    img {
      height: 16px;
      margin-right: 5px;
    }

    p {
      font-weight: 400;
    }
  }

  .search-result-item:hover {
    background-color: #ecf5ff;
  }

  .search-result-item.select {
    background-color: #409eff;
    color: #dddd;
  }
}
:deep(.el-button) {
  background: #1177ee;
  color: #ffffff;
  &.is-disabled {
    background: #f5f5f5;
    color: #bbbbbb;
  }
}
</style>
