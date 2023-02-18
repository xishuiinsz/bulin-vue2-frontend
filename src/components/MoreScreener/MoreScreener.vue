<template>
  <div class="more-screener-container">
    <slot></slot>
    <el-button class="more-button" @click="btnClick" :icon="isCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'">更多</el-button>
    <div :style="{ zIndex, backgroundColor }" v-show="!isCollapsed" class="collapsed-form-outer">
      <slot name="collapsed"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    zIndex: {
      type: [String, Number],
      default: 10
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      isCollapsed: true // 默认折叠状态
    }
  },
  methods: {
    btnClick() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>
<style lang="scss" scoped>
.more-screener-container {
  position: relative;

  .more-button {
    position: absolute;
    right: 12px;
    bottom: 8px;
  }
  .collapsed-form-outer {
    position: absolute;
    width: 100%;
  }
}
</style>
