<template>
  <!-- 图像居中缩放 -->
  <div class="scale-at-center-container">
    <div class="btn-group">
      <el-input-number
        v-model="scaleValue"
        @change="handleChange"
        :step="scaleStep"
        :min="10"
        :max="500"
        label="缩放图片"
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
      scaleStep: 10,
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
    draw() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.clearRect(0, 0, this.stageSize.width, this.stageSize.height)
      this.ctx.save()
      this.ctx.scale(this.scaleRate, this.scaleRate)
      this.ctx.drawImage(
        this.img,
        this.imageMainOption.x,
        this.imageMainOption.y
      )
      this.ctx.restore()
    },
    handleChange() {
      this.scaleRate = this.scaleValue / 100
      this.draw()
    },
    init() {
      const img = new Image()
      const canvas = document.querySelector('canvas')

      canvas.width = this.stageSize.width
      canvas.height = this.stageSize.height
      canvas.addEventListener('wheel', this.mouseWhellEvt)
      canvas.addEventListener('mousedown', this.mousedownEvt)
      canvas.addEventListener('mousemove', this.mousemoveEvt)
      canvas.addEventListener('mouseup', this.mouseupEvt)
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
            this.scaleValue = (this.stageSize.width / img.width) * 100
            this.imageMainOption.x = 0
            this.imageMainOption.y =
              (this.stageSize.height -
                this.imageMainOption.height * this.scaleValue) /
              2
          } else {
            this.scaleValue = (this.stageSize.height / img.height) * 100
            this.imageMainOption.y = 0
            this.imageMainOption.x =
              (this.stageSize.width -
                this.imageMainOption.width * this.scaleValue) /
              2
          }
          if (
            img.width / img.height ===
            this.stageSize.width / this.stageSize.height
          ) {
            this.imageMainOption.x = this.imageMainOption.y = 0
          }
        } else {
          this.imageMainOption.x = (this.stageSize.width - img.width) / 2
          this.imageMainOption.y = (this.stageSize.height - img.height) / 2
        }
        this.img = img
        this.scaleRate = this.scaleValue / 100
        this.draw()
      }
      img.src = require('@/assets/images/girl01.png')
      // img.src = require('@/assets/images/13378259.png')
    },
    mouseWhellEvt(e) {
      if (e.wheelDelta > 0) {
        if (this.scaleValue >= 500) return
        this.scaleValue += this.scaleStep
      }
      if (e.wheelDelta < 0) {
        if (this.scaleValue <= 10) return
        this.scaleValue -= this.scaleStep
      }
      console.log(e)
      this.handleChange()
    },
    mousedownEvt(e) {
      this.startX = e.offsetX
      this.startY = e.offsetY
      this.mousedownFlag = true
    },
    mousemoveEvt(e) {
      if (this.mousedownFlag) {
        const { offsetX, offsetY } = e
        this.imageMainOption.x =
          this.imageMainOption.x +
          (offsetX - this.startX) / (this.scaleValue / 100)
        this.imageMainOption.y =
          this.imageMainOption.y +
          (offsetY - this.startY) / (this.scaleValue / 100)
        this.scaleRate = this.scaleValue / 100
        this.draw()
        this.startX = offsetX
        this.startY = offsetY
      }
    },
    mouseupEvt(e) {
      this.mousedownFlag = false
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
