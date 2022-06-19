<template>
  <div class="table-layout-container">
    <div class="content-container">
      <div class="main-content">
        <div class="header">我的代办</div>
        <div class="content-body">
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
          <div class="test" style="margin-top: 24px">
            范围式流程图
            <div class="scoped-process-flow-container">
              <div class="flow-item" :style="{ flex: flow.flowList.length }" v-for="(flow, mainIndex) in scopedProcessFlow" :key="mainIndex">
                <div class="flow-wrap">
                  <div class="flow-label-wrap">
                    <span class="flow-label">{{ flow.label }}</span>
                  </div>
                  <div class="flow-node-wrap">
                    <div class="node-item-wrap" v-for="node in flow.flowList" :key="node.id">
                      <template v-if="Array.isArray(node)">
                        <div class="node-item" v-for="subNode in node" :key="subNode.key">
                          <div :id="subNode.id" class="node-icon"></div>
                          <span>{{ subNode.label }}</span>
                        </div>
                      </template>
                      <div class="node-item" v-else>
                        <div :id="node.id" class="node-icon"></div>
                        <span>{{ node.label }}</span>
                      </div>
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
      activeName: 'first',

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
            [
              {
                id: 2,
                label: '节点2',
                nextNode: 3
              },
              {
                id: 12,
                label: '节点12',
                nextNode: null
              }
            ],
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
    const domNodes = this.$el.querySelectorAll('.node-icon')
    console.log(domNodes)
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
    .flow-label-wrap {
      background-color: lightblue;
      text-align: center;
      .flow-label {
        height: 32px;
        line-height: 32px;
      }
    }
    .flow-node-wrap {
      display: flex;
      justify-content: space-around;
      margin-top: 16px;
      .node-item-wrap {
        .node-item {
          margin-top: 24px;
        }
        .node-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .node-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: green;
            border-radius: 50%;
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}
::v-deep .el-tabs.el-tabs--top {
  .el-tabs__nav-scroll {
    .el-tabs__nav.is-top {
      .el-tabs__item {
        padding-right: 48px;
      }
    }
  }
}
</style>
