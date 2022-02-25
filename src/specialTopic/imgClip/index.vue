<template>
  <div class="img-clip-general-container">
    <div class="operation-area">
      <el-input-number
        v-model="scaleRate"
        :precision="2"
        :step="1"
        :max="500"
        :min="10"
        @change="scaleRateChangeHandler"
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
          裁剪框
        </el-button>
        <el-button @click="confirmClipAction" size="small" type="primary">
          开始裁剪
        </el-button>
      </el-button-group>
    </div>

    <div class="canvas-outer-container">
      <div class="canvas-inner-container">
        <v-stage ref="stage" :config="stageSize">
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
export default {
  name: 'ImgClip',
  data() {
    return {
      stageSize: {
        width: 0,
        height: 0
      },
      layerConfig: {
        clip: {}
      },
      configClip: {
        width: 200,
        height: 300
      },
      scaleRate: 100,
      configRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        stroke: 'green',
        strokeWidth: 1,
        draggable: true
      },
      isShowClipBox: false,
      imageMainOption: {
        image: null,
        draggable: true,
        x: 100,
        y: 100,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0
      }
    }
  },
  computed: {},
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
    handleSuccess(response) {
      this.loadingInstance.close()
      const { file } = response.files
      const img = new Image()
      const _this = this
      img.onload = () => {
        this.imageMainOption.width = img.width
        this.imageMainOption.height = img.height
        if (
          img.width > this.stageSize.width ||
          img.height > this.stageSize.height
        ) {
          if (
            img.width / img.height >
            this.stageSize.width / this.stageSize.height
          ) {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY =
              this.stageSize.width / img.width
            this.imageMainOption.x = 0
            this.imageMainOption.y =
              (this.stageSize.height -
                this.imageMainOption.height * this.imageMainOption.scaleX) /
              2
          } else {
            this.imageMainOption.scaleX = this.imageMainOption.scaleY =
              this.stageSize.height / img.height
            this.imageMainOption.y = 0
            this.imageMainOption.x =
              (this.stageSize.width -
                this.imageMainOption.width * this.imageMainOption.scaleX) /
              2
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
      this.imageMainOption.scaleX = this.imageMainOption.scaleY =
        this.scaleRate / 100
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.resize)
    window.addEventListener('mousewheel', this.lmiMouseWheelHandler, false)
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
