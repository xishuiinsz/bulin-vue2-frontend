<template>
  <!-- 图像居中缩放 -->
  <div class="scale-at-center-container">
    <div class="btn-group">
      <el-input-number
        v-model="scaleValue"
        @change="handleChange"
        :step="10"
        :min="10"
        :max="500"
        label="描述文字"
      ></el-input-number>
    </div>
    <div class="canvas-container">
      <canvas style="background-color: green"></canvas>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScaleAtCener',
  data() {
    return {
      scaleValue: 100,
      stageSize: {
        width: 1200,
        height: 800
      },
      imageMainOption: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    handleChange() {
      const scaleRate = this.scaleValue / 100
      this.ctx.clearRect(0, 0, this.stageSize.width, this.stageSize.height)
      this.ctx.save()
      this.ctx.translate(
        ((1 - scaleRate) * this.stageSize.width) / 2,
        ((1 - scaleRate) * this.stageSize.height) / 2
      )
      this.ctx.scale(scaleRate, scaleRate)
      this.ctx.drawImage(
        this.img,
        this.imageMainOption.x,
        this.imageMainOption.y
      )
      this.ctx.restore()
    },
    init() {
      const img = new Image()
      const canvas = document.querySelector('canvas')

      canvas.width = this.stageSize.width
      canvas.height = this.stageSize.height
      this.ctx = canvas.getContext('2d')
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
            this.scaleValue = this.stageSize.width / img.width
            this.imageMainOption.x = 0
            this.imageMainOption.y =
              (this.stageSize.height -
                this.imageMainOption.height * this.scaleValue) /
              2
          } else {
            this.scaleValue = this.stageSize.height / img.height
            this.imageMainOption.y = 0
            this.imageMainOption.x =
              (this.stageSize.width -
                this.imageMainOption.width * this.scaleValue) /
              2
          }
        } else {
          this.imageMainOption.x = (this.stageSize.width - img.width) / 2
          this.imageMainOption.y = (this.stageSize.height - img.height) / 2
        }
        this.img = img
        this.ctx.drawImage(img, this.imageMainOption.x, this.imageMainOption.y)
      }
      img.src = require('./girl01.png')
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.scale-at-center-container {
  .canvas-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
