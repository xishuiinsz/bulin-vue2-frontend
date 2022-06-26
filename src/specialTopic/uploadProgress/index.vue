<template>
  <div class="upload-progress-container">
    <h4>前端模拟上传进度条</h4>
    <div class="upload-body">
      <el-upload
        :on-success="onSuccessHandler"
        :on-change="onChangeHandler"
        :on-progress="onProgressHandler"
        :before-upload="onBeforeHandler"
        :on-error="onerrorHandler"
        class="upload-demo"
        action="/upload-file"
        :show-file-list="false"
      >
        <el-input placeholder="请上传文件" suffix-icon="el-icon-folder" v-model="file.fileName"> </el-input>
      </el-upload>
      <el-progress :percentage="percentage" :status="status"></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      file: {
        fileName: ''
      },
      status: null,
      percentage: 0
    }
  },
  methods: {
    onBeforeHandler() {
      this.status = null
      this.percentage = 0
      this.file.fileName = ''
    },
    onChangeHandler(file) {},
    onSuccessHandler(response, file, fileList) {
      console.log(file)
      this.file.fileName = file.name
    },
    onerrorHandler(err, file, fileList) {
      console.log(err)
    },
    onProgressHandler(event, file, fileList) {
      this.percentage = parseInt(event.percent)
      if (event.percent === 100) {
        this.status = 'success'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-progress-container {
  .upload-body {
    width: fit-content;
    .upload-demo {
      width: fit-content;
    }
  }
}
</style>
