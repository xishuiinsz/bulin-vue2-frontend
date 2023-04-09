<template>
  <div class="app-container">
    <div style="display: flex; gap: 24px">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label="背景色">
          <el-color-picker @change="bgColoChange" v-model="colorValue"></el-color-picker>
        </el-form-item> -->
      </el-form>
    </div>

    <div v-if="tableData.length" class="table-layer-item" :style="tableLayerStyle">
      <el-table :key="keyTable" class="my-custom-table" :data="tableData" border highlight-current-row style="">
        <el-table-column
          v-for="item of tableHeader"
          :width="item.width"
          :key="item.colId"
          :prop="item.title"
          :label="item.title"
          :column-key="item.colId"
        />
      </el-table>
      <div class="selection-box"></div>
      <span @mousedown.stop="rotateHandlerMousedown" class="rotate-handler"></span>
    </div>
  </div>
</template>

<script src="./table.js"></script>
<style lang="scss" src="./upload-excel.scss" />
