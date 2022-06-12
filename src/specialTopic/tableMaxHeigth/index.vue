<template>
  <div class="table-layout-container">
    <div class="content-container">
      <div class="main-content">
        <div class="header">我的代办</div>
        <div class="content-body">
          <div class="table-general-container">
            <el-table :max-height="tableMaxHeight" :data="tableData" style="width: 100%">
              <el-table-column fixed prop="date" label="日期" width="150"> </el-table-column>
              <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
              <el-table-column prop="province" label="省份" width="120"> </el-table-column>
              <el-table-column prop="city" label="市区" width="120"> </el-table-column>
              <el-table-column prop="address" label="地址"> </el-table-column>
              <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
            </el-table>
          </div>
          <div class="pager-general-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[7, 10, 30, 50]"
              :page-size="7"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
          </div>
          <div class="test">
            范围式流程图
            <div class="scoped-process-flow-container">
              <div class="flow-item" :style="{ flex: flow.flowList.length }" v-for="(flow, mainIndex) in scopedProcessFlow" :key="mainIndex">
                <div class="flow-wrap">
                  <div class="label-wrap">
                    <span class="flow-label">{{ flow.label }}</span>
                  </div>
                  <div class="node-list">
                    <div class="node-item-wrap" v-for="node in flow.flowList" :key="node.id">
                      <span class="node-label" v-if="Array.isArray(node)">
                        <div v-for="subNode in node" :key="subNode.key">
                          <span>{{ subNode.label }}</span>
                        </div>
                      </span>
                      <span class="node-label" v-else>{{ node.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-container">Copyright (c) 2022-present by Bulin Zhang</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableMaxHeight: 740,
      currentPage: 1,
      scopedProcessFlow: [
        {
          label: '流程范围1',
          flowList: [
            {
              id: 1,
              label: '节点1',
              nextNode: 2
            },
            {
              id: 2,
              label: '节点2',
              nextNode: 3
            },
            [
              {
                id: 3,
                label: '节点3',
                nextNode: 4
              },
              {
                id: 5,
                label: '节点5',
                nextNode: null
              }
            ]
          ]
        },
        {
          label: '流程范围2',
          flowList: [
            {
              id: 4,
              label: '节点4',
              nextNode: [5, 6]
            }
          ]
        },
        {
          label: '流程范围3',
          flowList: [
            {
              id: 6,
              label: '节点6',
              nextNode: null
            }
          ]
        }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ]
    }
  },
  mounted() {
    const contentBodyDom = this.$el.querySelector('.content-body')
    this.tableMaxHeight = contentBodyDom.offsetHeight - 16 * 2 - (32 + 24)
  },
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
.scoped-process-flow-container {
  display: flex;
  column-gap: 16px;
  .flow-item {
    .label-wrap {
      background-color: lightblue;
      text-align: center;
      .flow-label {
        height: 32px;
        line-height: 32px;
      }
    }
    .node-list {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      .node-item-wrap {
        display: flex;
      }
    }
  }
}
</style>
