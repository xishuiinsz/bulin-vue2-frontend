<template>
  <div class="online-design-general-container">
    <div class="operation-area">
      <el-input-number v-model="scaleRate" :precision="2" :step="scaleStep" :max="400" :min="40"></el-input-number>
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
      <div class="drawing-canvas-container" :style="computedCanvasStyle">
        <div class="drawing-canvas" @mousedown="stageMousedownEvt" :style="stageStyle">
          <div
            :data-layer-id="layer.id"
            :class="getLayerItemClass(layer)"
            v-for="layer in layerList"
            :key="layer.id"
            class="layer-item"
            :style="getLayerStyle(layer)"
          >
            <div class="html-wrap" v-html="layer.html"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./onlineDesign"></script>
<style src="./style.scss" lang="scss" scoped></style>
