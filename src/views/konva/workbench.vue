<template>
  <div class="konva-workbench-container">
    <v-stage ref="stage" :config="stageSize" class="konva-stage-container">
      <v-layer>
        <template v-for="item in shapesList">
          <v-text v-if="item.type === 'text'" :key="item.id" :config="item" />
          <v-rect v-if="item.type === 'rect'" :key="item.id" :config="item" />
          <v-circle
            v-if="item.type === 'circle'"
            :key="item.id"
            :config="item"
          />
          <v-line v-if="item.type === 'line'" :key="item.id" :config="item" />
        </template>
      </v-layer>
      <v-layer ref="dragLayer"></v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: 'Workbench',
  data() {
    return {
      stageSize: {
        width: 0,
        height: 0
      },
      shapesList: [
        {
          id: '1',
          text: 'Some text on canvas',
          fontSize: 15,
          type: 'text',
          draggable: true
        },
        {
          id: '2',
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10,
          type: 'rect',
          draggable: true
        },
        {
          id: '3',
          x: 200,
          y: 100,
          radius: 50,
          fill: 'green',
          type: 'circle',
          draggable: true
        },
        {
          id: '4',
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
          draggable: true
        }
      ]
    }
  },
  mounted() {
    this.initStage()
  },
  methods: {
    initStage() {
      const width = this.$el.offsetWidth
      const height = this.$el.offsetHeight
      this.stageSize = { width, height }
    }
  }
}
</script>
<style lang="scss" scoped>
.konva-workbench-container {
  min-height: calc(100vh - 84px);
  background-color: #f5f7fa;
}
</style>
