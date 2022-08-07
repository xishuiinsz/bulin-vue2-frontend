<template>
  <div class="table-layout-container">
    <div class="content-container">
      <div class="main-content">
        <div class="header">svg图片的多种使用方法</div>
        <div class="content-body">
          <ul class="muilti-uses-of-image">
            <span>图片的多种使用方法</span>
            <li>
              <span>img标签字符串引用方式：</span>
              <span v-text="json"></span>
              <div>
                <img src="@/assets/icons/1-circle-fill.svg" alt="" srcset="" />
              </div>
            </li>
            <li>
              <span>img标签变量引用方式：</span>
              <span v-text="json1"></span>
              <div>
                <img :src="require('@/assets/icons/1-circle-fill.svg')" alt="" srcset="" />
              </div>
            </li>
            <li>
              <span>背景css link使用法：</span>
              <span v-text="json2"></span>
              <div>
                <span class="number-one-bg"></span>
              </div>
            </li>
            <li>
              <span>背景css source使用法：</span>
              <span v-text="json3"></span>
              <div>
                <span class="number-two-bg"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      json: '<img src="@/assets/icons/1-circle-fill.svg" alt="" srcset="" />',
      json1: `<img :src="require('@/assets/icons/1-circle-fill.svg')" alt="" srcset="" />`,
      json2: `
      标签部分：<span class="number-one-bg"></span>
      样式部分：
      .number-one-bg {
      display: inline-block;
      width: 16px;
      height: 16px;
      background-image: url(~@/assets/icons/1-circle-fill.svg);
      }
      `,
      json3:
        'data:image/svg+xml,' +
        window.btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-1-circle-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383h1.312Z"/>
        </svg>`)
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(val)
      if (val > this.tableData.length) {
        const diff = val - this.tableData.length
        for (let index = 0; index < diff; index++) {
          this.tableData.push({
            date: '2016-05-07',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333
          })
        }
      }
      if (val < this.tableData.length) {
        this.tableData = this.tableData.slice(0, val)
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-layout-container {
  min-height: inherit;
  display: flex;
  flex-direction: column;
  &.router-view-common-container {
    padding: 0;
  }
  .content-container {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    .main-content {
      border-radius: 4px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .header {
        height: 60px;
        background-color: rgb(191, 203, 217);
        line-height: 60px;
        padding: 0 16px;
      }
      .content-body {
        flex: 1;
        padding: 16px;
        .table-general-container {
        }
        .pager-general-container {
          margin-top: 24px;
        }
      }
    }
  }
  .footer-container {
    height: 60px;
    background-color: rgb(191, 203, 217);
    line-height: 60px;
    text-align: center;
  }
}
.muilti-uses-of-image {
  list-style: none;
  .number-one-bg {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url(~@/assets/icons/1-circle-fill.svg);
  }
  .number-two-bg {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-1-circle-fill%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16%208A8%208%200%201%201%200%208a8%208%200%200%201%2016%200ZM9.283%204.002V12H7.971V5.338h-.065L6.072%206.656V5.385l1.899-1.383h1.312Z%22%2F%3E%0A%3C%2Fsvg%3E');
  }
}
</style>
