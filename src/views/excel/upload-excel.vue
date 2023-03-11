<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <div v-if="tableData.length" class="table-layer-item" :style="tableLayerStyle">
      <el-table :key="keyTable" class="my-custom-table" @cell-click="cellClick" :data="tableData" border highlight-current-row style="">
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

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import uniqueId from 'lodash/uniqueId'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      keyTable: 0,
      tableLayerData: {
        x: 300,
        y: 400
      },
      tableData: [],
      tableHeader: []
    }
  },
  computed: {
    tableLayerStyle() {
      const { x, y } = this.tableLayerData
      return {
        left: `${x}px`,
        top: `${y}px`
      }
    }
  },
  methods: {
    cellClick(row, column, cell, event) {
      console.log(column)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    // 左侧新增列
    addColByLeft(item) {},
    // 删除列
    delCol(item) {
      const index = this.tableHeader.findIndex(el => el === item)
      this.tableHeader.splice(index, 1)
      this.keyTable++
    },
    // 右侧新增列
    addColByRight(item) {
      const index = this.tableHeader.findIndex(el => el === item)
      this.tableHeader.splice(index + 1, 0, {
        width: 100,
        colId: crypto.randomUUID(),
        title: `标题${uniqueId()}`
      })
    }
  }
}
</script>
<style lang="scss" src="./upload-excel.scss" />
