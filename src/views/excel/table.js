import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import uniqueId from 'lodash/uniqueId'
const selectedClassName = 'is-selected'
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
      colorValue: '',
      tableData: [],
      tableHeader: [],
      selectedList: [],
      rowStyleList: [],
      cellStyleList: [
        {
          rowId: 'f45b651f-0a1a-4b09-b4af-d02503aac12b',
          colId: '0e1af1d2-145a-4eda-8350-6c349e42ee53',
          style: {
            color: 'red'
          }
        }
      ],
      headerRowStyle: {
        height: '80px'
      }
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
      this.selectedList = []
      this.selectedList.push({
        rowId: row.rowId,
        colId: column.columnKey
      })
      const cellChild = cell.querySelector('.cell')
      cellChild.setAttribute('contentEditable', true)
      cellChild.addEventListener('blur', () => {
        const [findedCell] = this.tableData.filter(item => {
          return item.rowId === row.rowId
        })
        Object.assign(findedCell, { [column.property]: cellChild.innerText })
        cellChild.removeAttribute('contentEditable')
      })
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
    },
    rowStyle({ row, rowIndex }) {
      return { height: '60px' }
    },
    // 背景色change事件
    bgColoChange(color) {
      console.log(color)
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      const [findedCell] = this.cellStyleList.filter(item => {
        if (item.rowId && item.colId) {
          return row.rowId === item.rowId && item.colId === column.columnKey
        }
      })
      if (findedCell) {
        return findedCell.style
      }
      return {}
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      const [selectedCell] = this.selectedList.filter(item => {
        return item.rowId === row.rowId && item.colId === column.columnKey
      })
      if (selectedCell) {
        return selectedClassName
      }
      return ''
    },
    rowClassName({ row, rowIndex }) {
      return ''
    }
  }
}
