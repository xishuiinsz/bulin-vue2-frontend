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
              <vue-markdown v-highlight :source="mdSources"></vue-markdown>
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
import VueMarkdown from 'vue-markdown'
import axios from 'axios'
export default {
  name: 'Dashboard',
  components: { VueMarkdown },
  data () {
    return {
      mdSources: '',
      logs: '',
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  mounted () {
    axios.get('/changelog.md').then(resp => {
      if (resp && resp.data) {
        this.mdSources = resp.data
      }
    })
  }
}
</script>
