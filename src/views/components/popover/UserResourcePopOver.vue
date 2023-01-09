<template>
  <el-popover
    placement="right"
    :width="800"
    trigger="click"
    @show="onShow"
  >
    <template #reference>
      <svgIcon
        name="ques"
        color="#C3C3C3"
        size="18"
        class="cursor"
      />
    </template>
    <div
      v-loading="loading"
      class="user-resources"
    >
      <div class="container">
        <div class="row row1">
          <div class="title">系统列表</div>
          <div class="content">
            <template v-if="system.length > 0">
              <div
                v-for="item in system"
                :key="item.id"
                :class="{ item, selected: selectedSys === item.id }"
                :title="item.name"
                @click="selectSys(item.id)"
              >
                <span>{{ item.name }}</span>
              </div>
            </template>
            <div
              v-else
              class="empty-text"
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="title">角色列表</div>
          <div class="content">
            <template v-if="role.length > 0">
              <div
                v-for="item in role"
                :key="item.id"
                :class="{ item, selected: selectedRole === item.id }"
                :title="item.roleName"
                @click="selectRole(item.id)"
              >
                <span>{{ item.roleName }}</span>
              </div>
            </template>
            <div
              v-else
              class="empty-text"
            >
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="row row3">
          <div class="title">资源列表</div>
          <div class="content">
            <el-tree
              :props="{ children: 'childrenList', label: 'name' }"
              :data="resourceTree"
              empty-text="暂无数据"
            />
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getRoleListByPostId, resourceByRoleId, ResTreeNode, RoleListItem, Status, SUCCESS_CODE } from '@/api'
const loading = ref(true)
const props = defineProps({
  positionId: {
    type: String,
    default: ''
  }
})
const allRole = ref<RoleListItem[]>([])

interface PostBindSysListItem {
  id: string
  name: string
  status: Status
}
const system = ref<PostBindSysListItem[]>([])
const role = ref<RoleListItem[]>([])
const resourceTree = ref<ResTreeNode[]>([])

const selectedSys = ref('')
const selectedRole = ref('')

async function onShow() {
  loading.value = true
  const { code, data } = await getRoleListByPostId(props.positionId)
  if (code === SUCCESS_CODE) {
    allRole.value = data
  }
  system.value = []

  if (allRole.value.length) {
    system.value.push({
      name: '全部',
      id: '',
      status: null
    })
  }

  allRole.value.forEach(item => {
    if (system.value.findIndex(sys => sys.id === item.systemId) === -1) {
      system.value.push({
        id: item.systemId,
        name: item.systemName,
        status: null
      })
    }
  })

  if (system.value.length > 0) {
    await selectSys(system.value[0].id)
  }

  loading.value = false
}

async function selectSys(id) {
  selectedSys.value = id
  role.value = id ? allRole.value.filter(role => role.systemId === id) : allRole.value

  if (role.value.length > 0) {
    selectRole(role.value[0].id)
  }
}

async function selectRole(roleId) {
  selectedRole.value = roleId
  const { code, data } = await resourceByRoleId(roleId)
  if (code === SUCCESS_CODE) {
    resourceTree.value = data
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 450px;
  .row {
    display: flex;
    flex-direction: column;
    flex: 1;

    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
    }

    p {
      line-height: 22px;

      font-size: 16px;
      color: #666666;
      font-weight: 400;
      padding: 10px;
    }

    .content {
      flex: 1;
      margin-top: 12px;
      background: #ffffff;
      border: 1px solid rgba(221, 221, 221, 1);
      overflow: auto;
      .item {
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        padding: 0 0 0 10px;
        white-space: nowrap;
        width: 258px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item.selected {
        background-color: rgb(17 119 238 / 10%);
        color: #1177ee;
      }

      .item:hover {
        background-color: rgb(17 119 238 / 20%);
      }
    }
  }
  .row1 {
    .content {
      border-right: none;
    }
  }

  .row3 {
    .content {
      border-left: none;
    }
  }
}

.empty-text {
  position: relative;
  min-height: 3.75rem;
  text-align: center;
  width: 100%;
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-base);
  }
}

.user-resources {
  height: auto;
}
</style>
