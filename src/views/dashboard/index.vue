<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>更新日志</span>
            </div>
            <div class="change-log">
              <div v-highlight v-html="logs" class="markdown-content"></div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>任务清单</span>
            </div>
            <div v-highlight>
              <pre>
                <code>
                  minimizer: [
                    new TerserPlugin({
                      cache: true,
                      parallel: true,
                      terserOptions: {
                        mangle: false, // Note `mangle.properties` is `false` by default.
                      },
                    }),
                  ]
                </code>
              </pre>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { marked } from 'marked'
// import changelog from './changelog.md'
export default {
  name: 'Dashboard',
  components: {},
  data () {
    return {
      logs: '',
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted () {
    // console.log(marked(logs))
  }
}
</script>
