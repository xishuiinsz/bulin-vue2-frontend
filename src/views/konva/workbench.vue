<template>
  <div class="konva-workbench-container">
    <div class="btn-group">
      <el-button @click="gruop" type="primary">组合</el-button>
      <el-button @click="ungroup">取消组合</el-button>
    </div>
    <v-stage
      ref="stage"
      :config="stageSize"
      @mousedown="handleStageMouseDown"
      @mousemove="handleStageMouseMove"
      @mouseup="handleStageMouseUp"
      @touchstart="handleStageMouseDown"
      class="konva-stage-container"
    >
      <v-layer ref="layer">
        <workspace :eleList="shapesList"> </workspace>
        <v-rect :config="selectionRect" />
        <v-transformer @transformend="handleTransformEnd" ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
// import Konva from 'konva'
import workspace from './workspace'
export default {
  components: {
    workspace
  },
  data() {
    return {
      key: 0,
      stageSize: {
        width: 0,
        height: 0
      },
      selectionRect: {
        visible: false
      }, // 矩形选择框
      shapesList: [
        {
          id: '1',
          x: 30,
          y: 30,
          text: 'Some text on canvas',
          name: 'text1',
          fontSize: 15,
          type: 'text',
          draggable: true
        },
        {
          id: '2',
          rotation: 0,
          x: 310,
          y: 340,
          width: 120,
          height: 120,
          scaleX: 1,
          scaleY: 1,
          fill: 'red',
          name: 'rect1',
          draggable: true,
          type: 'rect'
        },
        {
          id: '3',
          rotation: 0,
          x: 250,
          y: 250,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          fill: 'green',
          name: 'rect2',
          draggable: true,
          type: 'rect'
        },
        {
          id: '4',
          x: 250,
          y: 100,
          radius: 50,
          fill: 'green',
          type: 'circle',
          name: 'circle1',
          draggable: true
        },
        {
          id: '5',
          x: 20,
          y: 200,
          points: [0, 0, 100, 0, 100, 100],
          tension: 0.5,
          closed: true,
          stroke: 'black',
          fillLinearGradientStartPoint: { x: -50, y: -50 },
          fillLinearGradientEndPoint: { x: 50, y: 50 },
          fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
          type: 'line',
          name: 'line1',
          draggable: true
        },
        {
          id: '6',
          type: 'group',
          draggable: true,
          name: 'group1',
          children: [
            {
              id: '7',
              rotation: 0,
              x: 350,
              y: 250,
              width: 100,
              height: 100,
              scaleX: 1,
              scaleY: 1,
              fill: 'green',
              name: 'rect21',
              type: 'rect'
            },
            {
              id: '8',
              x: 450,
              y: 100,
              radius: 50,
              fill: 'green',
              type: 'circle',
              name: 'circle8'
            }
          ]
        }
      ],
      selectedShapeName: ''
    }
  },
  mounted() {
    this.initStage()
  },
  methods: {
    // 初始化konva stage
    initStage() {
      const konvaGroupContainer = this.$el.querySelector(
        '.konva-stage-container'
      )
      const width = konvaGroupContainer.offsetWidth
      const height = konvaGroupContainer.offsetHeight
      this.stageSize = { width, height }
    },
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.shapesList.find(r => r.name === this.selectedShapeName)
      // update the state
      rect.x = e.target.x()
      rect.y = e.target.y()
      rect.rotation = e.target.rotation()
      rect.scaleX = e.target.scaleX()
      rect.scaleY = e.target.scaleY()

      // change fill
      // rect.fill = Konva.Util.getRandomColor()
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = ''
        this.updateTransformer()
        this.selectionRect = {
          visible: true,
          width: 0,
          height: 0
        }
        this.flagMouseDown = true
        this.x1 = e.target.getPointerPosition().x
        this.y1 = e.target.getPointerPosition().y
        this.x2 = e.target.getPointerPosition().x
        this.y2 = e.target.getPointerPosition().y
        return
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer'
      if (clickedOnTransformer) {
        return
      }

      // clicked on group
      if (e.target.getParent().nodeType === 'Group') {
        this.selectedShapeName = e.target.getParent().name()
        this.updateTransformer()
        return
      }

      // find clicked rect by its name
      const name = e.target.name()
      const rect = this.shapesList.find(r => r.name === name)
      if (rect) {
        this.selectedShapeName = name
      } else {
        this.selectedShapeName = ''
      }
      this.updateTransformer()
    },
    handleStageMouseMove(e) {
      if (this.flagMouseDown) {
        const stage = this.$refs.stage.getNode()
        this.x2 = stage.getPointerPosition().x
        this.y2 = stage.getPointerPosition().y
        this.selectionRect = {
          x: Math.min(this.x1, this.x2),
          y: Math.min(this.y1, this.y2),
          width: Math.abs(this.x2 - this.x1),
          height: Math.abs(this.y2 - this.y1),
          fill: 'rgba(0,0,255,0.5)',
          visible: true
        }
      }
    },
    handleStageMouseUp(e) {
      this.flagMouseDown = false
      setTimeout(() => {
        this.selectionRect = {
          visible: false
        }
      })
      console.log(e.target.getStage())
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode()
      const stage = transformerNode.getStage()
      const { selectedShapeName } = this

      const selectedNode = stage.findOne('.' + selectedShapeName)
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode])
        transformerNode.moveToTop()
      } else {
        // remove transformer
        transformerNode.nodes([])
      }
    },
    // 取消组合
    ungroup() {
      const nodes = this.$refs.transformer.getNode().nodes()
      if (!nodes.length) {
        this.$message.warning('请选择组合元素！')
        return
      }
      const [selecedShape] = nodes
      if (selecedShape.nodeType === 'Group') {
        const { id, x, y } = selecedShape.attrs
        const index = this.shapesList.findIndex(shape => shape.id === id)
        const [spliceEle] = this.shapesList.splice(index, 1)
        spliceEle.children.forEach(ele =>
          Object.assign(ele, {
            draggable: true,
            x: ele.x + x,
            y: ele.y + y
            // scaleX,
            // scaleY
          })
        )
        this.shapesList.push(...spliceEle.children)
      } else {
        this.$message.warning('请选择组合元素！')
      }
    },
    gruop() {}
  }
}
</script>
<style lang="scss" scoped>
.konva-workbench-container {
  width: 100%;
  height: calc(100vh - 84px);
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .konva-stage-container {
    flex: 1;
  }
}
</style>
