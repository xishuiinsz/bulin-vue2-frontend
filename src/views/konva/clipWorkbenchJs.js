import ClipSelectionBox from './clipSelectionBox.vue'
import getImageOutline from 'image-outline'
import { Photoshop } from 'vue-color'
export default {
  name: 'ClipWorkbench',
  components: {
    ClipSelectionBox,
    'chrome-picker': Photoshop
  },
  data() {
    return {
      bgColors: '',
      points: [],
      scaleStep: 10,
      minScaleVal: 10,
      maxScaleVal: 400,
      stageSize: {
        width: 0,
        height: 0
      },
      config4MainLayer: {
        draggable: true,
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0,
        id: 'mainLayer',
        clip: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },
      scaleValue: 100,
      scaleValueLast: 100,
      fitZoom: 1, // 自适应比例
      configRect: {
        x: 200,
        y: 200,
        width: 200,
        height: 250,
        stroke: 'green',
        isFixedSize: false,
        draggable: false
      },
      isShowClipBox: false,
      config4MainImage: {
        image: null,
        fillPatternImage: null,
        fill: '',
        x: 100,
        y: 100,
        width: 0,
        height: 0,
        strokeEnabled: true,
        stroke: 'black',
        id: 'mainImage',
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
        x = node4MainImage.x()
        y = node4MainImage.y()
      } else {
        x = this.config4MainImage.x
        y = this.config4MainImage.y
      }
      const configOutline = {
        points,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 5,
        id: 'outline',
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
        x: (x + offsetX * 2) / scaleRate,
        y: (y + offsetY * 2) / scaleRate,
        width: width / scaleRate,
        height: height / scaleRate,
        id: 'shadowClipRectBox'
      }
    }
  },
  methods: {
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
    // 初始化主图片
    initImage(imgUrl) {
      const img = new Image()
      img.onload = () => {
        this.initScale(img)
      }
      img.src = imgUrl
    },
    // 初始化缩放率
    initScale(img) {
      this.config4MainImage.width = img.width
      this.config4MainImage.height = img.height
      if (img.width > this.stageSize.width || img.height > this.stageSize.height) {
        if (img.width / img.height >= this.stageSize.width / this.stageSize.height) {
          this.fitZoom = this.stageSize.width / img.width
          this.config4MainImage.x = 0
          this.config4MainImage.y = (this.stageSize.height - this.config4MainImage.height * this.fitZoom) / 2 / this.fitZoom
        } else {
          this.fitZoom = this.stageSize.height / img.height
          this.config4MainImage.y = 0
          this.config4MainImage.x = (this.stageSize.width - this.config4MainImage.width * this.fitZoom) / 2 / this.fitZoom
        }
      } else {
        this.config4MainImage.x = (this.stageSize.width - img.width) / 2
        this.config4MainImage.y = (this.stageSize.height - img.height) / 2
      }
      this.scaleValue = this.fitZoom * 100
      this.config4MainLayer.scaleX = this.config4MainLayer.scaleY = this.fitZoom
      this.config4MainImage.image = img
    },
    // 上传成功的回调
    handleSuccess(response) {
      this.config4MainLayer.clip = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
      this.isShowClipBox = false
      this.loadingInstance.close()
      const { file } = response.files
      this.initImage(file)
    },
    // 上传背景图片成功回调
    handleSuccessBg(response) {
      this.loadingInstance.close()
      const { file } = response.files
      this.bgImageConfig(file)
    },
    // 更新背景颜色
    updateBgColors(color) {
      console.log(color)
    },
    // 背景颜色【确定】回调
    okBgColorsHandler() {
      if (this.bgColors) {
        const { hex8 } = this.bgColors
        this.config4MainImage.fill = hex8
      }
    },
    // 窗口窗口变化事件
    resize() {
      this.fitZoom = 1
      this.scaleValue = 100
      this.config4MainLayer.clip = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
      this.initCanvas()
      this.initScale(this.config4MainImage.image)
    },
    // 是否添加裁剪框
    switchShowClipBox() {
      if (!this.isShowClipBox) {
        if (!this.config4MainImage.image) {
          this.$message.error('请先上传图片！')
          return
        }
      }
      this.isShowClipBox = !this.isShowClipBox
      if (this.isShowClipBox) {
        const node4MainImage = this.nodeStage.findOne('#mainImage')
        const { x, y } = node4MainImage.getAbsolutePosition()
        this.configRect.x = x
        this.configRect.y = y
        this.configRect.width = this.config4MainImage.width * (this.scaleValue / 100)
        this.configRect.height = this.config4MainImage.height * (this.scaleValue / 100)
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
      if (!this.isShowClipBox) return
      const scaleRate = this.scaleValue / 100
      const { width: cropBoxWidth, height: cropBoxHeight } = this.configRect
      const node4CropBox = this.nodeStage.findOne('#rectBox')
      const { x, y } = node4CropBox.getAbsolutePosition()
      const nodeShadowClipBox = this.nodeStage.findOne('#shadowClipRectBox')
      nodeShadowClipBox.absolutePosition({ x, y })
      const relativeX = nodeShadowClipBox.x()
      const relativeY = nodeShadowClipBox.y()
      this.config4MainLayer.clip = {
        x: relativeX,
        y: relativeY,
        width: cropBoxWidth / scaleRate,
        height: cropBoxHeight / scaleRate
      }
      this.config4MainLayer.computedClip = nodeShadowClipBox.getClientRect()
    },
    // 重置裁剪
    resetClipAction() {
      this.config4MainLayer.clip = { x: 0, y: 0, width: 0, height: 0 }
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
    // 设置背景图片
    bgImageConfig(url) {
      if (!this.config4MainImage.fillPatternImage) {
        // const bgImgUrl = require('@/assets/images/135458S3K.jpg')
        const img = new Image()
        img.onload = () => {
          this.config4MainImage.fill = ''
          this.config4MainImage.fillPatternImage = img
        }
        img.src = url
      }
    },
    // 清空背景图片
    bgImageClear() {
      if (this.config4MainImage.fillPatternImage) {
        this.config4MainImage.fillPatternImage = null
      }
      if (this.config4MainImage.fill) {
        this.config4MainImage.fill = ''
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
      this.config4MainImage.strokeEnabled = false
      this.$nextTick(() => {
        const node4MainGroup = this.nodeStage.findOne('#mainGroup')
        node4MainGroup.toImage({
          callback: img => {
            const { clip } = this.config4MainLayer
            if (clip.width === 0 || clip.height === 0) {
              this.downloadURI(img.src, Date.now() + '.png')
            } else {
              const { x, y } = node4MainGroup.getClientRect()
              const node4ClipRectBox = this.nodeStage.findOne('#rectBox')
              let { x: clipX, y: clipY, width: clipWidth, height: clipHeight } = node4ClipRectBox.getClientRect()
              if (this.config4MainLayer.computedClip) {
                const { x, y, width, height } = this.config4MainLayer.computedClip
                clipX = x
                clipY = y
                clipWidth = width
                clipHeight = height
              }
              const canvas4MainGroup = node4MainGroup.toCanvas()
              const ctx4MainGroup = canvas4MainGroup.getContext('2d')
              const imgData = ctx4MainGroup.getImageData(clipX - x, clipY - y, clipWidth, clipHeight)
              const canvas = document.createElement('canvas')
              canvas.width = clipWidth
              canvas.height = clipHeight
              const ctx = canvas.getContext('2d')
              ctx.putImageData(imgData, 0, 0)
              this.downloadURI(canvas.toDataURL(), Date.now() + '.png')
            }
            this.config4MainImage.strokeEnabled = true
          }
        })
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
          case 'rc':
            Object.assign(this.configRect, {
              width: width + (x2 - x1)
            })
            break
          case 'lc':
            Object.assign(this.configRect, {
              width: width - (x2 - x1),
              x: x + (x2 - x1)
            })
            break
          case 'br':
            Object.assign(this.configRect, {
              height: height + (y2 - y1),
              width: width + (x2 - x1)
            })
            break
          case 'tl':
            Object.assign(this.configRect, {
              height: height - (y2 - y1),
              width: width - (x2 - x1),
              x: x + (x2 - x1),
              y: y + (y2 - y1)
            })
            break
          case 'tr':
            Object.assign(this.configRect, {
              width: width + (x2 - x1),
              height: height - (y2 - y1),
              y: y + (y2 - y1)
            })
            break
          case 'bl':
            Object.assign(this.configRect, {
              width: width - (x2 - x1),
              x: x + (x2 - x1),
              height: height + y2 - y1
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
    },
    // 小一寸
    littlerOneInch() {
      if (!this.isShowClipBox) {
        this.switchShowClipBox()
      }
      const width = 2.2 * 25
      const height = 3.2 * 25
      Object.assign(this.configRect, {
        width,
        height,
        isFixedSize: true
      })
    },
    // 一寸
    normalOneInch() {
      if (!this.isShowClipBox) {
        this.switchShowClipBox()
      }
      const width = 2.5 * 25
      const height = 3.5 * 25
      Object.assign(this.configRect, {
        width,
        height,
        isFixedSize: true
      })
    },
    // 小二寸
    littlerTwoInch() {
      if (!this.isShowClipBox) {
        this.switchShowClipBox()
      }
      const width = 3.3 * 25
      const height = 4.8 * 25
      Object.assign(this.configRect, {
        width,
        height,
        isFixedSize: true
      })
    },
    // 二寸
    normalTwoInch() {
      if (!this.isShowClipBox) {
        this.switchShowClipBox()
      }
      const width = 3.5 * 25
      const height = 5.3 * 25
      Object.assign(this.configRect, {
        width,
        height,
        isFixedSize: true
      })
    },
    // 拖拽完成事件
    dragEndEvt(e) {
      const { target } = e
      const { x, y } = target.getAbsolutePosition()
      this.config4MainLayer.x = x
      this.config4MainLayer.y = y
      this.config4MainLayer.clip = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    },
    // 上一步
    undoHandler() {
      console.log('上一步')
    },
    // 下一步
    redoHandler() {
      console.log('下一步')
    }
  },
  watch: {},
  mounted() {
    this.initCanvas()
    this.$nextTick(this.initImage(require('@/assets/images/girl08.png')))
    window.addEventListener('resize', this.resize)
    this.nodeStage = this.$refs.stage.getNode()
    this.nodeStage.container().addEventListener('mousewheel', this.lmiMouseWheelHandler, false)
    this.nodeStage.on('mousedown', this.stageMousedownEvt)
    this.nodeStage.on('mousemove', this.stageMousemoveEvt)
    this.nodeStage.on('mouseup', this.stageMouseupEvt)
  }
}
