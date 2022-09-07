<template>
  <div class="Input-max-length">
    <h4>Input 与 maxlength</h4>
    <el-form label-position="top" label-width="80px">
      <el-form-item label="名称(最大30字符或15个汉字)">
        <el-input v-inputMaxLength="{ maxlength: 10 }" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-input v-model="region"></el-input>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input v-model="type"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import inputMaxLength from '@/directive/inputMaxLength'
export default {
  directives: { inputMaxLength },
  data() {
    return {
      name: '',
      region: '',
      type: '',
      labelName: '活动名称活动名称'
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
<style lang="scss" scoped>
.Input-max-length {
  width: 280px;
}

::v-deep {
  .el-form {
    .el-form-item__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
