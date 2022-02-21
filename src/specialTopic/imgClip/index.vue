<template>
  <div class="img-clip-general-container">
    <div class="operation-area">
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
      <el-button size="small" type="primary"> 裁剪框 </el-button>
    </div>

    <div class="canvas-outer-container">
      <div class="canvas-inner-container">
        <v-stage ref="stage" :config="stageSize">
          <v-layer ref="layer" :config="layerConfig">
            <v-image :config="imageMainOption" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      stageSize: {
        width: 0,
        height: 0
      },
      layerConfig: {
        scaleX: 1,
        scaleY: 1
      },
      imageMainOption: {
        image: null,
        draggable: true,
        x: 100,
        y: 100,
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
        if (
          img.width > _this.stageSize.width ||
          img.height > _this.stageSize.height
        ) {
          if (
            img.width / img.height >
            _this.stageSize.width / _this.stageSize.height
          ) {
            _this.imageMainOption.width = _this.stageSize.width
            _this.imageMainOption.height =
              img.height * (_this.stageSize.width / img.width)
            _this.imageMainOption.x = 0
            _this.imageMainOption.y =
              (this.stageSize.height - _this.imageMainOption.height) / 2
          } else {
            _this.imageMainOption.height = _this.stageSize.height
            _this.imageMainOption.width =
              img.width * (_this.stageSize.height / img.height)
            _this.imageMainOption.y = 0
            _this.imageMainOption.x =
              (this.stageSize.width - _this.imageMainOption.width) / 2
          }
        } else {
          _this.imageMainOption.x = (this.stageSize.width - img.width) / 2
          _this.imageMainOption.y = (this.stageSize.height - img.height) / 2
          _this.imageMainOption.width = img.width
          _this.imageMainOption.height = img.height
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
    }
  },
  mounted() {
    this.initCanvas()
    window.addEventListener('resize', this.resize)
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
