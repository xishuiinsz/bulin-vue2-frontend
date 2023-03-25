<template>
  <div class="img-clip-general-container">
    <div class="operation-area">
      <el-input-number v-model="scaleRate" :precision="2" :step="scaleStep" :max="500" :min="10"></el-input-number>
      <el-button type="primary" @click="fitBtnClick">合适大小</el-button>
      <el-button type="primary" @click="originBtnClick">原始大小</el-button>
      <el-upload
        :multiple="false"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
      >
        <el-button size="small" type="primary"> 上传图片 </el-button>
      </el-upload>
      <el-button-group>
        <el-button @click="switchShowClipBox" size="small" type="primary"> 裁剪框 </el-button>
        <el-button @click="confirmClipAction" size="small" type="primary"> 开始裁剪 </el-button>
      </el-button-group>
    </div>

    <div class="drawing-board-container">
      <div class="canvas-inner-container" :style="computedCanvasStyle">
        <v-stage @mousedown="stageMousedownEvt" ref="stage" :config="stageSize">
          <v-layer ref="layerMainImage" :config="layerConfig">
            <v-image :config="imageMainOption" />
            <v-rect v-if="isShowClipBox" :config="configRect" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>
<script>
const canvasInitOffset = {
  x: 0,
  y: 0
}
export default {
  name: 'OnlinePosterHome',
  data() {
    return {
      scaleStep: 10,
      stageSize: {
        width: 1920,
        height: 1080
      },
      layerConfig: {
        clip: {}
      },
      canvasOffset: {
        ...canvasInitOffset
      },
      configClip: {
        width: 200,
        height: 300
      },
      scaleRate: 100,
      configRect: {
        x: 200,
        y: 100,
        width: 100,
        height: 200,
        stroke: 'green',
        strokeWidth: 2,
        draggable: true
      },
      isShowClipBox: true,
      imageMainOption: {
        image: null,
        draggable: true,
        x: 100,
        y: 100,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
        centeredScaling: true
      }
    }
  },
  computed: {
    computedCanvasStyle() {
      const scaleRate = this.scaleRate / 100
      const { x, y } = this.canvasOffset
      return { transform: `translate(${x}px,${y}px) scale(${scaleRate})` }
    }
  },
  methods: {
    computedFitScale() {
      const gapSize = 80
      const drawingBoardContainer = this.$el.querySelector('.drawing-board-container')
      const { width: drawingBoradWidth, height: drawingBoradHeight } = getComputedStyle(drawingBoardContainer)
      const usableWidth = parseFloat(drawingBoradWidth) - gapSize
      const usableHeight = parseFloat(drawingBoradHeight) - gapSize
      const { width: canvasWidth, height: canvasHeight } = this.stageSize
      if (canvasWidth < usableWidth && canvasHeight < usableHeight) {
        this.scaleRate = 100
      } else if (canvasWidth > usableWidth && canvasHeight > usableHeight) {
        if (canvasWidth / canvasHeight > usableWidth / usableHeight) {
          this.scaleRate = (usableWidth / canvasWidth) * 100
        } else {
          this.scaleRate = (usableHeight / canvasHeight) * 100
        }
      } else if (canvasWidth > usableWidth && canvasHeight < usableHeight) {
        this.scaleRate = (usableWidth / canvasWidth) * 100
      } else {
        this.scaleRate = (usableHeight / canvasHeight) * 100
      }
    },
    fitBtnClick() {
      this.canvasOffset = { ...canvasInitOffset }
      this.computedFitScale()
    },
    originBtnClick() {
      this.scaleRate = 100
    },
    mouseMove(e) {
      if (this.keyCode === 'Space') {
        this.x2 = e.x
        this.y2 = e.y
        const offsetX = this.x2 - this.x1
        const offsetY = this.y2 - this.y1
        this.canvasOffset.x += offsetX
        this.canvasOffset.y += offsetY
        this.x1 = this.x2
        this.y1 = this.y2
      }
    },
    stageMousedownEvt(e) {
      this.x1 = this.x2 = e.evt.x
      this.y1 = this.y2 = e.evt.y
      window.addEventListener('mousemove', this.mouseMove)
      window.addEventListener('mouseup', () => {
        document.body.style.cursor = 'default'
        window.removeEventListener('mousemove', this.mouseMove)
      })
    },
    initCanvas() {
      const canvasInnerContainer = document.querySelector('.canvas-inner-container')
      this.stageSize.width = canvasInnerContainer.offsetWidth
      this.stageSize.height = canvasInnerContainer.offsetHeight
    },
    beforeUpload(file) {
      this.loadingInstance = this.$loading({
        target: this.$el
      })
    },
    handleSuccess(response) {
      this.loadingInstance.close()
      const { file } = response.files
      const img = new Image()
      const _this = this
      img.onload = () => {
        this.imageMainOption.width = img.width
        this.imageMainOption.height = img.height
        if (img.width > this.stageSize.width || img.height > this.stageSize.height) {
          if (img.width / img.height > this.stageSize.width / this.stageSize.height) {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY = this.stageSize.width / img.width
            this.imageMainOption.x = 0
            this.imageMainOption.y = (this.stageSize.height - this.imageMainOption.height * this.imageMainOption.scaleX) / 2
          } else {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY = this.stageSize.height / img.height
            this.imageMainOption.y = 0
            this.imageMainOption.x = (this.stageSize.width - this.imageMainOption.width * this.imageMainOption.scaleX) / 2
          }
          this.scaleRate = this.imageMainOption.scaleX * 100
        } else {
          this.imageMainOption.x = (this.stageSize.width - img.width) / 2
          this.imageMainOption.y = (this.stageSize.height - img.height) / 2
          this.imageMainOption.width = img.width
          this.imageMainOption.height = img.height
        }
        _this.imageMainOption.image = img
      }
      img.src = file
    },
    resize() {
      this.stageSize = {
        width: 0,
        height: 0
      }
    },
    switchShowClipBox() {
      if (!this.isShowClipBox) {
        if (!this.imageMainOption.image) {
          this.$message.error('请先上传图片！')
          return
        }
        this.configRect.x = this.imageMainOption.x
        this.configRect.y = this.imageMainOption.y
        this.configRect.width = this.imageMainOption.width
        this.configRect.height = this.imageMainOption.height
      }
      this.isShowClipBox = !this.isShowClipBox
    },
    lmiMouseWheelHandler(e) {
      this.scaleRate += e.wheelDelta / 10
      this.imageMainOption.scaleX = this.scaleRate / 100
      this.imageMainOption.scaleY = this.scaleRate / 100
    },
    // 开始裁剪
    confirmClipAction() {
      this.layerConfig.clip = {}
      const { x, y, width, height } = this.configRect
      this.layerConfig.clip = {
        x,
        y,
        width,
        height
      }
    },
    // 手功调整 缩放率
    scaleRateChangeHandler() {
      this.imageMainOption.scaleX = this.imageMainOption.scaleY = this.scaleRate / 100
      this.imageMainOption.x = (this.stageSize.width - this.image.width * (this.scaleRate / 100)) / 2
      this.imageMainOption.y = (this.stageSize.height - this.image.height * (this.scaleRate / 100)) / 2
    },
    // 键盘事件
    registerKeyboardEvt() {
      window.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          this.keyCode = 'Space'
          document.body.style.cursor = 'grab '
        }
      })
      window.addEventListener('keyup', e => {
        if (e.code === 'Space') {
          this.keyCode = ''
          document.body.style.cursor = 'default'
        }
      })
    }
  },
  mounted() {
    this.$nextTick(this.computedFitScale)
    this.registerKeyboardEvt()
    // window.addEventListener('resize', this.resize)
    // window.addEventListener('mousewheel', this.lmiMouseWheelHandler, false)
  }
}
</script>
<style lang="scss" scoped>
.img-clip-general-container {
  width: 100%;
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
  background-color: red;
  .operation-area {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .drawing-board-container {
    position: relative;
    flex: 1;
    background-color: green;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    .canvas-inner-container {
      width: fit-content;
      height: fit-content;
      background-color: pink;
      position: absolute;
    }
  }
}
</style>
