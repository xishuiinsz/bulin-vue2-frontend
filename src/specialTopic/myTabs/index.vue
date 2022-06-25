<template>
  <div class="my-tabs-container">
    <h4>
      需求说明：参与的某项目使用的是甲方内定的另外一种前端组件库，需求方要求实现的Tabs页签交互及样式与el-tabs基本上一样，但工程里无法直接引用Element
      UI.我的想法是直接提取 element ui的Tabs源码并置入项目的component目录
    </h4>
    <ele-tabs :beforeLeave="beforeLeave" v-model="activeName" @tab-click="handleClick">
      <ele-tab-pane label="用户管理" name="first">用户管理</ele-tab-pane>
      <ele-tab-pane label="配置管理配置管理" name="second">配置管理配置管理</ele-tab-pane>
      <ele-tab-pane label="角色管理" name="third">角色管理</ele-tab-pane>
      <ele-tab-pane label="定时任务补偿定时任务补偿" name="fourth">定时任务补偿定时任务补偿</ele-tab-pane>
    </ele-tabs>
  </div>
</template>
<script>
import EleTabs from './tabs'
import EleTabPane from './tab-pane'
export default {
  components: {
    EleTabs,
    EleTabPane
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    beforeLeave() {
      // this.$message.warning('随机阻止切换Tab！')
      return true
    },
    handleClick(tab) {
      console.log(tab)
    }
  }
}
</script>
<style lang="scss">
@import './tabs.scss';
@import './tab-pane.scss';
.el-tabs__item.is-active {
  font-weight: 1000;
  font-family: Microsoft YaHei;
}
</style>
