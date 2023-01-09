<template>
  <div class="bottom">
    <div
      :id="`room_id_${id}`"
      :class="textOver && !foldBtn ? 'room_intro showEllipsis' : 'room_intro'"
    >
      {{ Stuff(props.item.info) }}
    </div>
    <div
      v-if="textOver"
      class="btnWrap"
    >
      <el-button
        type="text"
        @click="foldBtn = !foldBtn"
      >
        {{ foldBtn ? '收起' : '展开全部' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, ref } from 'vue'
import { useFilter } from '@/hooks/filter'
import { SysLogListItem } from '../api'
const { Stuff } = useFilter()

const props = defineProps<{
  item: SysLogListItem
}>()

const id = Math.round(Math.random() * 1000000)

const textOver = ref(false) // 按钮
const foldBtn = ref(false) // 展开

onBeforeMount(async () => {
  nextTick(() => {
    const domRef = document.getElementById(`room_id_${id}`)
    if (domRef) {
      const height = window.getComputedStyle(domRef).height.replace('px', '')
      if (+height > 66) {
        // 40 -- 2行的高度
        textOver.value = true
      } else {
        textOver.value = false
      }
    }
  })
})
</script>

<style lang="less" scoped>
.bottom {
  margin-top: 12px;
  position: relative;
  .room_intro {
    flex: 1;
    white-space: normal;
    font-family: PingFangSC-Regular, PingFang SC;
    line-height: 22px;
    text-align: justify;
  }
  .showEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .btnWrap {
    align-self: flex-end;
    text-align: right;
    cursor: pointer;
  }
}
</style>
