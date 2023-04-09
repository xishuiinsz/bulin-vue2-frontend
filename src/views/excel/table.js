import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { getParentElementBySelector, getElementCenterPoint, getDistanceByPoints, getTransformByKey, getAngle } from './uitls'
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
    rotateHandlerMousedown(e) {
      this.tableLayer = getParentElementBySelector(e.target, 'table-layer-item')
      if (this.tableLayer) {
        this.pointerCenter = getElementCenterPoint(this.tableLayer)
        const { x: xCenter, y: yCenter } = this.pointerCenter
        this.xCenter = xCenter
        this.yCenter = yCenter
        this.p1 = { x: e.x - xCenter, y: e.y - yCenter }
        document.addEventListener('mousemove', this.rotateHandlerMousemove)
        document.addEventListener('mouseup', this.rotateHandlerMouseup)
      }
    },
    rotateHandlerMousemove(e) {
      this.p2 = { x: e.x - this.xCenter, y: e.y - this.yCenter }
      const angel = getAngle({ x: 0, y: 0 }, this.p1, this.p2)
      const rotateValue = getTransformByKey(this.tableLayer, 'rotate')
      const rotate = (rotateValue ? parseFloat(rotateValue) : 0) + angel
      this.tableLayer.style.userSelect = 'none'
      this.tableLayer.style.transform = `rotate(${rotate}deg)`
      this.p1 = this.p2
    },
    rotateHandlerMouseup(e) {
      this.tableLayer.style.userSelect = 'auto'
      document.removeEventListener('mousemove', this.rotateHandlerMousemove)
      document.removeEventListener('mouseup', this.rotateHandlerMouseup)
    }
  }
}
