<template>
  <div class="konva-group-container">
    <h3>konva.js实现组合、解除组合功能</h3>
    <el-row>
      <el-button type="primary">组合</el-button>
      <el-button type="primary">解除组合</el-button>
    </el-row>
    <div id="konva-group-container"></div>
  </div>
</template>

<script>
export default {
  name: "konvaGroupUngroup",
  components: {},
};
</script>

<style lang="scss" scoped>
.konva-group-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  padding: 24px;
  box-sizing: border-box;
}
</style>
