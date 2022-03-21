/* eslint-disable vue/max-attributes-per-line */
<template>
  <div class="clip-workbench-general-container">
    <div class="operation-area">
      <el-input-number
        :value="scaleValue"
        :precision="2"
        :step="scaleStep"
        :max="maxScaleVal"
        :min="minScaleVal"
        size="small"
        @change="scaleRateChangeHandler"
        :disabled="!config4MainImage.image"
      ></el-input-number>
      <el-upload :multiple="false" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload" class="editor-slide-upload" action="https://httpbin.org/post">
        <el-button size="small" type="primary"> 上传图片 </el-button>
      </el-upload>
      <el-popover placement="bottom" title="设置背景" width="200" trigger="click">
        <el-button-group>
          <el-upload :multiple="false" :show-file-list="false" :on-success="handleSuccessBg" :before-upload="beforeUpload" class="editor-slide-upload" action="https://httpbin.org/post">
            <el-button size="small" type="primary"> 设置背景图片 </el-button>
          </el-upload>
          <el-popover placement="bottom" title="设置背景" trigger="click">
            <chrome-picker @ok="okBgColorsHandler" v-model="bgColors"></chrome-picker>
            <el-button style="margin-top: 4px" @click="bgImageConfig" size="small" type="primary" slot="reference"> 设置背景颜色 </el-button>
          </el-popover>
          <el-button style="margin-top: 4px" @click="bgImageClear" size="small" type="primary"> 清空背景 </el-button>
        </el-button-group>
        <el-button size="small" type="primary" slot="reference">设置背景</el-button>
      </el-popover>
      <el-popover placement="bottom" title="请选择动作" trigger="click">
        <el-button-group>
          <el-button @click="switchShowClipBox" size="small" type="primary">
            {{ isShowClipBox ? '清空裁剪框' : '添加裁剪框' }}
          </el-button>
          <el-button @click="confirmClipAction" size="small" type="primary"> 开始裁剪 </el-button>
          <el-button @click="resetClipAction" size="small" type="primary"> 重置裁剪 </el-button>
        </el-button-group>
        <el-button size="small" type="primary" slot="reference">裁剪图片</el-button>
      </el-popover>
      <el-button @click="strokeOutlineHandler" size="small" type="primary"> 轮廓描边 </el-button>
      <el-popover placement="bottom" title="请选择尺寸" width="200" trigger="click">
        <el-button-group>
          <el-button @click="littlerOneInch" size="small" type="primary"> 小一寸 </el-button>
          <el-button @click="normalOneInch" size="small" type="primary"> 一寸 </el-button>
          <el-button style="margin-top: 4px" @click="littlerTwoInch" size="small" type="primary"> 小二寸 </el-button>
          <el-button style="margin-top: 4px" @click="normalTwoInch" size="small" type="primary"> 二寸 </el-button>
        </el-button-group>
        <el-button size="small" type="primary" slot="reference">证件照</el-button>
      </el-popover>
      <el-popover placement="bottom" title="请选择记录" width="200" trigger="click">
        <el-button-group>
          <el-button @click="undoHandler" size="small" type="primary"> 上一步 </el-button>
          <el-button @click="redoHandler" size="small" type="primary"> 下一步 </el-button>
        </el-button-group>
        <el-button size="small" type="primary" slot="reference">历史记录</el-button>
      </el-popover>
      <el-button @click="exportAsImageHandler" size="small" type="primary"> 导出图片 </el-button>
    </div>

    <div class="canvas-outer-container">
      <div class="canvas-inner-container">
        <v-stage ref="stage" :config="stageSize">
          <v-layer ref="ref4MainLayer" @dragend="dragEndEvt" :config="config4MainLayer">
            <v-group :config="{ id: 'mainGroup' }">
              <v-image ref="ref4MainImage" :config="config4MainImage" />
              <v-line :config="configOutline" />
            </v-group>
            <v-rect v-if="isShowClipBox" :config="computedRect" ref="refShadowClipBox" />
          </v-layer>
          <v-layer v-if="isShowClipBox" ref="ref4CropBoxLayer">
            <clip-selection-box :dataRect="configRect" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>
<script src="./clipWorkbenchJs.js"></script>
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
