<template>
  <v-stage
    ref="stage"
    :config="stageSize"
    @mousedown="handleStageMouseDown"
    @touchstart="handleStageMouseDown"
  >
    <v-layer ref="layer">
      <workspace :eleList="rectangles"> </workspace>
      <v-transformer @transformend="handleTransformEnd" ref="transformer" />
    </v-layer>
  </v-stage>
</template>

<script>
import Konva from 'konva'
import workspace from './workspace'
const width = window.innerWidth
const height = window.innerHeight
export default {
  components: {
    workspace
  },
  data() {
    return {
      stageSize: {
        width: width,
        height: height
      },
      rectangles: [
        {
          id: '1',
          x: 30,
          y: 30,
          text: 'Some text on canvas',
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
              name: 'rect2',
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
  mounted() {},
  methods: {
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.rectangles.find(r => r.name === this.selectedShapeName)
      // update the state
      rect.x = e.target.x()
      rect.y = e.target.y()
      rect.rotation = e.target.rotation()
      rect.scaleX = e.target.scaleX()
      rect.scaleY = e.target.scaleY()

      // change fill
      rect.fill = Konva.Util.getRandomColor()
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = ''
        this.updateTransformer()
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
      const rect = this.rectangles.find(r => r.name === name)
      if (rect) {
        this.selectedShapeName = name
      } else {
        this.selectedShapeName = ''
      }
      this.updateTransformer()
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
      } else {
        // remove transformer
        transformerNode.nodes([])
      }
    }
  }
}
</script>
