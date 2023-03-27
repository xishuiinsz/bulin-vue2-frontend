const maxScale = 4
const minScale = 0.4
const canvasInitOffset = {
  x: 0,
  y: 0
}
export default {
  name: 'OnlinePosterHome',
  data() {
    return {
      scaleStep: 5,
      stageSize: {
        width: 920,
        height: 480
      },
      activeLayerList: [],
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
      layerList: [
        {
          id: '1',
          width: 300,
          height: 100,
          x: 50,
          y: 100,
          type: 'svg',
          html: `
          <svg class="online-design-svg" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <rect width="300" height="100" style="fill:white;stroke-width:1;stroke:rgb(0,0,0)" />
          </svg>
          `
        },
        {
          id: '2',
          width: 300,
          height: 148,
          x: 300,
          y: 300,
          type: 'img',
          html: '<img class="online-design-img" src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"  />'
        },
        {
          id: '3',
          width: 140,
          height: 48,
          x: 200,
          y: 300,
          type: 'text',
          html: '<div class="online-design-text" contenteditable="true" style="background-color:blue;">我是文本</div>'
        }
      ],
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
      return { transform: `matrix(${scaleRate}, 0, 0, ${scaleRate}, ${x}, ${y})` }
      // return { transform: `translate(${x}px,${y}px) scale(${scaleRate})` }
    },
    stageStyle() {
      const { width, height } = this.stageSize
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    }
  },
  methods: {
    getLayerItemClass(layer) {
      let className = `layer-${layer.type}`
      if (this.activeLayerList.map(item => item.layerId).includes(layer.id)) {
        className += ' is-active'
      }
      return className
    },
    getLayerStyle(item) {
      const { width, height, x, y } = item
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`
      }
    },
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
      this.x2 = e.x
      this.y2 = e.y
      const offsetX = this.x2 - this.x1
      const offsetY = this.y2 - this.y1
      if (this.keyCode === 'Space') {
        this.canvasOffset.x += offsetX
        this.canvasOffset.y += offsetY
        //   如果当前有文本图层处于编辑态，则使其失焦
        if (this.activeLayerList.length) {
          this.activeLayerList.forEach(({ element }) => {
            if (element.classList.contains('layer-text')) {
              const textEle = element.querySelector('.online-design-text')
              if (textEle) {
                textEle.blur()
              }
            }
          })
        }
      } else {
        if (this.activeLayerList.length) {
          this.activeLayerList
            .map(item => item.layerId)
            .forEach(layerId => {
              const [layerIdItem] = this.layerList.filter(item => item.id === layerId)
              if (layerIdItem) {
                layerIdItem.x += offsetX
                layerIdItem.y += offsetY
              }
            })
        }
      }
      this.x1 = this.x2
      this.y1 = this.y2
    },
    getLayerId(element) {
      if (element.classList.contains('drawing-canvas')) return null
      if (element.dataset.layerId) return { layerId: element.dataset.layerId, element }
      else return this.getLayerId(element.parentElement)
    },
    stageMousedownEvt(e) {
      if (this.keyCode !== 'Space') {
        const layerId = this.getLayerId(e.target)
        if (layerId) {
          if (!this.activeLayerList.map(item => item.layerId).includes(layerId)) {
            this.activeLayerList = []
            this.activeLayerList.push(layerId)
          }
        } else {
          this.activeLayerList = []
        }
      }
      this.x1 = this.x2 = e.x
      this.y1 = this.y2 = e.y
      window.addEventListener('mousemove', this.mouseMove)
      window.addEventListener('mouseup', () => {
        document.body.style.cursor = 'default'
        window.removeEventListener('mousemove', this.mouseMove)
      })
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
    },
    // 鼠标中建滚动事件回调
    registerMousewheelEvtHandler(e) {
      console.log(e)
      const dy = -e.deltaY || e.wheelDeltaY
      this.lastScaleRate = this.scaleRate
      this.scaleRate += dy / 20
      if (this.scaleRate / 100 > maxScale) {
        this.scaleRate = maxScale * 100
      }
      if (this.scaleRate / 100 < minScale) {
        this.scaleRate = minScale * 100
      }
    },
    // 鼠标中建滚动事件注册
    registerMousewheelEvt() {
      document.body.addEventListener('mousewheel', this.registerMousewheelEvtHandler)
    },
    registerResizeEvt() {
      window.addEventListener('resize', this.fitBtnClick)
    }
  },
  mounted() {
    this.$nextTick(this.computedFitScale)
    this.registerKeyboardEvt()
    this.registerMousewheelEvt()
    this.registerResizeEvt()
    // window.addEventListener('resize', this.resize)
    // window.addEventListener('mousewheel', this.lmiMouseWheelHandler, false)
  }
}
