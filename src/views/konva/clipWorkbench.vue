<template>
  <div class="clip-workbench-general-container">
    <div class="operation-area">
      <el-input-number
        :value="scaleValue"
        :precision="2"
        :step="scaleStep"
        :max="maxScaleVal"
        :min="minScaleVal"
        @change="scaleRateChangeHandler"
        :disabled="!config4MainImage.image"
      ></el-input-number>
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
        <el-button @click="switchShowClipBox" size="small" type="primary">
          {{ isShowClipBox ? '清空裁剪框' : '添加裁剪框' }}
        </el-button>
        <el-button @click="confirmClipAction" size="small" type="primary">
          开始裁剪
        </el-button>
        <el-button @click="bgImageConfig" size="small" type="primary">
          {{
            config4MainImage.fillPatternImage ? '清空背景图片' : '设置背景图片'
          }}
        </el-button>
        <el-button @click="exportAsImageHandler" size="small" type="primary">
          导出图片
        </el-button>
        <el-button @click="strokeOutlineHandler" size="small" type="primary">
          轮廓描边
        </el-button>
      </el-button-group>
    </div>

    <div class="canvas-outer-container">
      <div class="canvas-inner-container">
        <v-stage ref="stage" :config="stageSize">
          <v-layer ref="ref4MainLayer" :config="config4MainLayer">
            <v-image ref="ref4MainImage" :config="config4MainImage" />
            <v-line :config="configOutline" />
            <v-rect :config="computedRect" />
          </v-layer>
          <v-layer v-if="isShowClipBox" ref="ref4CropBoxLayer">
            <clip-selection-box :dataRect="configRect" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>
<script>
import ClipSelectionBox from './clipSelectionBox.vue'
import getImageOutline from 'image-outline'
export default {
  name: 'ClipWorkbench',
  components: { ClipSelectionBox },
  data() {
    return {
      points: [],
      scaleStep: 10,
      minScaleVal: 10,
      maxScaleVal: 400,
      stageSize: {
        width: 0,
        height: 0
      },
      config4MainLayer: {
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        clip: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },
      scaleValue: 100,
      scaleValueLast: 100,
      configRect: {
        x: 200,
        y: 200,
        width: 400,
        height: 400,
        stroke: 'green',
        draggable: false
      },
      isShowClipBox: true,
      config4MainImage: {
        image: null,
        fillPatternImage: null,
        draggable: true,
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        strokeEnabled: true,
        stroke: 'black',
        strokeWidth: 1
      }
    }
  },
  computed: {
    configOutline() {
      const points = this.points
      let x, y
      if (this.$refs.ref4MainImage) {
        const node4MainImage = this.$refs.ref4MainImage.getNode()
        x = node4MainImage.getAbsolutePosition().x
        y = node4MainImage.getAbsolutePosition().y
      } else {
        x = this.config4MainImage.x
        y = this.config4MainImage.y
      }
      const configOutline = {
        points,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 5,
        x,
        y
      }
      return configOutline
    },
    computedRect() {
      const scaleRate = this.scaleValue / 100
      const { x: offsetX, y: offsetY } = this.config4MainLayer
      const { x, y, width, height } = this.configRect
      return {
        x: (x + offsetX) / scaleRate,
        y: (y + offsetY) / scaleRate,
        width: width / scaleRate,
        height: height / scaleRate,
        stroke: 'green'
      }
    }
  },
  methods: {
    initCanvas() {
      const canvasInnerContainer = document.querySelector(
        '.canvas-inner-container'
      )
      this.stageSize.width = canvasInnerContainer.offsetWidth
      this.stageSize.height = canvasInnerContainer.offsetHeight
    },
    beforeUpload(file) {
      this.loadingInstance = this.$loading({
        target: this.$el
      })
    },
    initImage(imgUrl) {
      const img = new Image()
      img.onload = () => {
        this.config4MainImage.width = img.width
        this.config4MainImage.height = img.height
        if (
          img.width > this.stageSize.width ||
          img.height > this.stageSize.height
        ) {
          if (
            img.width / img.height >
            this.stageSize.width / this.stageSize.height
          ) {
            this.config4MainLayer.scaleX = this.config4MainLayer.scaleY =
              this.stageSize.width / img.width
            this.config4MainImage.x = 0
            this.config4MainImage.y =
              (this.stageSize.height -
                this.config4MainImage.height * this.config4MainLayer.scaleX) /
              2
          } else {
            this.config4MainLayer.scaleX = this.config4MainLayer.scaleY =
              this.stageSize.height / img.height
            this.config4MainImage.y = 0
            this.config4MainImage.x =
              (this.stageSize.width -
                this.config4MainImage.width * this.config4MainLayer.scaleX) /
              2
          }
          this.scaleValue = this.config4MainLayer.scaleX * 100
        } else {
          this.config4MainImage.x = (this.stageSize.width - img.width) / 2
          this.config4MainImage.y = (this.stageSize.height - img.height) / 2
          this.config4MainImage.width = img.width
          this.config4MainImage.height = img.height
        }
        this.config4MainImage.image = img
      }
      img.src = imgUrl
    },
    handleSuccess(response) {
      this.loadingInstance.close()
      const { file } = response.files
      this.initImage(file)
    },
    resize() {
      this.stageSize = {
        width: 0,
        height: 0
      }
    },
    switchShowClipBox() {
      if (!this.isShowClipBox) {
        if (!this.config4MainImage.image) {
          this.$message.error('请先上传图片！')
          return
        }
      }
      this.isShowClipBox = !this.isShowClipBox
      if (this.isShowClipBox) {
        const node4MainImage = this.$refs.ref4MainImage.getNode()
        const { x, y } = node4MainImage.getAbsolutePosition()
        this.configRect.x = x
        this.configRect.y = y
        this.configRect.width =
          this.config4MainImage.width * (this.scaleValue / 100)
        this.configRect.height =
          this.config4MainImage.height * (this.scaleValue / 100)
      }
    },
    // 手功调整 缩放率
    scaleRateChangeHandler(currentValue, oldValue) {
      this.scaleValue = currentValue
      this.scaleValueLast = oldValue
      this.scaleMainImage()
    },
    // mousewheel中间滚轮事件
    lmiMouseWheelHandler(e) {
      if (!this.config4MainImage.image) {
        this.$message.error('请先上传图片！')
        return
      }
      if (e.wheelDelta > 0 && this.scaleValue >= this.maxScaleVal) return
      if (e.wheelDelta < 0 && this.scaleValue <= this.minScaleVal) return
      this.scaleValueLast = this.scaleValue
      this.scaleValue += e.wheelDelta > 0 ? this.scaleStep : -this.scaleStep
      this.scaleMainImage({ x: e.offsetX, y: e.offsetY })
    },
    // 开始裁剪
    confirmClipAction() {
      // debugger
      const scaleRate = this.scaleValue / 100
      const { width: cropBoxWidth, height: cropBoxHeight } = this.configRect
      const node4CropBox = this.$refs.ref4CropBox.getNode()
      const { x: cropBoxX, y: cropBoxY } = node4CropBox.getAbsolutePosition()
      const node4MainImage = this.$refs.ref4MainImage.getNode()
      const { x: mainImageX, y: mainImageY } =
        node4MainImage.getAbsolutePosition()
      const mainImaggWidth = this.config4MainImage.width * scaleRate
      const mainImaggHeight = this.config4MainImage.height * scaleRate
      // console.log(cropBoxX, cropBoxY, cropBoxWidth, cropBoxHeight)
      // console.log(mainImageX, mainImageY, mainImaggWidth, mainImaggHeight)
      console.log(cropBoxX - mainImageX, cropBoxY - mainImageY)
      const { x: offsetXLayer, y: offsetYLayer } = this.config4MainLayer
      this.config4MainLayer.clip = {
        x: cropBoxX,
        y: cropBoxY,
        width: cropBoxWidth / scaleRate,
        height: cropBoxHeight / scaleRate
      }
    },
    // 开始缩放主图片
    scaleMainImage(pointer) {
      const oldScale = this.scaleValueLast / 100
      const newScale = this.scaleValue / 100
      const pos = pointer || {
        x: this.config4MainImage.x + this.config4MainImage.width / 2,
        y: this.config4MainImage.y + this.config4MainImage.height / 2
      }
      const mousePointTo = {
        x: (pos.x - this.config4MainLayer.x) / oldScale,
        y: (pos.y - this.config4MainLayer.y) / oldScale
      }
      this.config4MainLayer.scaleX = newScale
      this.config4MainLayer.scaleY = newScale
      this.config4MainLayer.x = pos.x - mousePointTo.x * newScale
      this.config4MainLayer.y = pos.y - mousePointTo.y * newScale
    },
    // 设置|清空背景图片
    bgImageConfig() {
      if (!this.config4MainImage.fillPatternImage) {
        const bgImgUrl = require('@/assets/images/135458S3K.jpg')
        const img = new Image()
        img.onload = () => {
          this.config4MainImage.fillPatternImage = img
        }
        img.src = bgImgUrl
      } else {
        this.config4MainImage.fillPatternImage = null
      }
    },
    downloadURI(uri, name) {
      const link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link.remove()
    },
    // 导出图片
    exportAsImageHandler() {
      const node4MainImage = this.$refs.ref4MainImage.getNode()
      node4MainImage.toImage({
        callback: img => {
          this.downloadURI(img.src, 'stage.png')
        }
      })
    },
    stageMousedownEvt(e) {
      const id = e.target.getAttr('id')
      let x2, y2
      const x1 = this.nodeStage.getPointerPosition().x
      const y1 = this.nodeStage.getPointerPosition().y
      x2 = this.nodeStage.getPointerPosition().x
      y2 = this.nodeStage.getPointerPosition().y
      this.nodeStage.off('mousemove')
      const { x, y, width, height } = this.configRect
      this.nodeStage.on('mousemove', e => {
        e.evt.preventDefault()
        x2 = this.nodeStage.getPointerPosition().x
        y2 = this.nodeStage.getPointerPosition().y
        switch (id) {
          case 'rectBox':
            Object.assign(this.configRect, {
              x: x + x2 - x1,
              y: y + y2 - y1
            })
            break
          case 'bc':
            Object.assign(this.configRect, {
              height: height + y2 - y1
            })
            break
          case 'tc':
            Object.assign(this.configRect, {
              height: height - (y2 - y1),
              y: y + (y2 - y1)
            })
            break

          default:
            break
        }
      })
    },
    stageMousemoveEvt(e) {
      const id = e.target.getAttr('id')
      switch (id) {
        case 'rectBox':
          this.nodeStage.container().style.cursor = 'move'
          break
        case 'tl':
        case 'br':
          this.nodeStage.container().style.cursor = 'nw-resize'
          break
        case 'tr':
        case 'bl':
          this.nodeStage.container().style.cursor = 'ne-resize'
          break
        case 'tc':
        case 'bc':
          this.nodeStage.container().style.cursor = 'n-resize'
          break
        case 'rc':
        case 'lc':
          this.nodeStage.container().style.cursor = 'e-resize'
          break
        default:
          this.nodeStage.container().style.cursor = 'default'
          break
      }
    },
    stageMouseupEvt(e) {
      this.nodeStage.off('mousemove')
      this.nodeStage.on('mousemove', this.stageMousemoveEvt)
    },
    // 轮廓描边
    strokeOutlineHandler() {
      const { image } = this.config4MainImage
      const polygon = getImageOutline(image)
      const points = polygon.map(item => [item.x, item.y]).flat()
      this.points = points
    }
  },
  watch: {},
  mounted() {
    this.initCanvas()
    this.$nextTick(this.initImage(require('@/assets/images/girl01.png')))
    window.addEventListener('resize', this.resize)
    this.nodeStage = this.$refs.stage.getNode()
    this.nodeStage
      .container()
      .addEventListener('mousewheel', this.lmiMouseWheelHandler, false)
    this.nodeStage.on('mousedown', this.stageMousedownEvt)
    this.nodeStage.on('mousemove', this.stageMousemoveEvt)
    this.nodeStage.on('mouseup', this.stageMouseupEvt)
  }
}
</script>
<style lang="scss" scoped>
.clip-workbench-general-container {
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
  .canvas-outer-container {
    flex: 1;
    background-color: green;
    padding: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .canvas-inner-container {
      width: 100%;
      height: 100%;
      background-color: pink;
    }
  }
}
</style>
