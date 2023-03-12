<template>
  <div class="app-container">
    <div style="display: flex; gap: 24px">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="背景色">
          <el-color-picker @change="bgColoChange" v-model="colorValue"></el-color-picker>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="tableData.length" class="table-layer-item" :style="tableLayerStyle">
      <el-table
        :key="keyTable"
        class="my-custom-table"
        :header-row-style="headerRowStyle"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        @cell-click="cellClick"
        :cell-class-name="cellClassName"
        :row-class-name="rowClassName"
        :data="tableData"
        border
        highlight-current-row
        style=""
      >
        <el-table-column
          v-for="item of tableHeader"
          :width="item.width"
          :key="item.colId"
          :prop="item.title"
          :label="item.title"
          :column-key="item.colId"
        />
      </el-table>
      <div v-if="tableHeader.length" class="table-operation-container">
        <div class="table-col-operation">
          <div class="table-col-item" v-for="item in tableHeader" :key="item.col" :style="{ width: `${item.width}px` }">
            <div @click="addColByLeft(item)" class="col-item-action left">+</div>
            <div @click="delCol(item)" class="col-item-action center">-</div>
            <div @click="addColByRight(item)" class="col-item-action right">+</div>
          </div>
        </div>
        <div class="table-row-operation">
          <div class="table-row-item" v-for="item in tableData" :key="item.rowId">
            <div @click="addColByLeft(item)" class="row-item-action left">+</div>
            <div @click="delCol(item)" class="row-item-action center">-</div>
            <div @click="addColByRight(item)" class="row-item-action right">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./table.js"></script>
<style lang="scss" src="./upload-excel.scss" />
