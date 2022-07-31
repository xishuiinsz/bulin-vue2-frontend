<template>
  <div class="v-over-text-tip">
    <h4>文本修改</h4>
    <el-form label-position="top" :model="form">
      <el-form-item label="模拟卸载指令">
        <el-input v-model="labelName"></el-input>
      </el-form-item>
      <el-form-item label="关闭表单">
        <el-switch v-model="isShowForm"></el-switch>
      </el-form-item>
    </el-form>
    <h4>与el-tooltip不同的是，v-overTextTip指令的功能为：元素的文本只有在超长的场景下才会出现</h4>
    <el-form
      v-if="isShowForm"
      v-overTextTip="{
        selector: '.el-input__inner, .el-form-item__label',
        offset: { x: 10, y: 10 },
        'popper-class': 'my-test-tooltip',
        effect: 'dark'
      }"
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item :label="labelName">
        <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import overTextTip from '@/directive/overTextTip/index.js' // 权限判断指令
export default {
  directives: { overTextTip },
  data() {
    return {
      isShowForm: true,
      labelName: '活动名称活动名称',
      form: {
        name: '我是超长文本内容我是超长文本内容我是超长文本内容我是超长文本内容',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
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
.v-over-text-tip {
  width: 440px;
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
