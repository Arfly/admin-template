<template>
  <svg
    :class="['svg-icon', $attrs.class]"
    :style="{
      width: size + 'px',
      height: size + 'px',
      outline: 0
    }"
    aria-hidden="true"
  >
    <use
      :href="`#icon-${name}`"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { COLORS } from '@/config/color'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: COLORS.ICON_DEFAULT_COLOR
    },
    size: {
      type: [Number, String],
      default: 14
    }
  }
})
</script>

<style scope>
.svg-icon {
  vertical-align: middle;
  fill: currentColor;
}
</style>
