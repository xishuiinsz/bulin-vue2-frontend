<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['flagUserDataChange'])
  },
  watch: {
    // 监听用户数据变化信号
    flagUserDataChange(newFlag, oldFlag) {
      if (newFlag === true && oldFlag === false) {
        window.addEventListener('beforeunload', this.userDataChange)
      }
      if (newFlag === false && oldFlag === true) {
        window.removeEventListener('beforeunload', this.userDataChange)
      }
    }
  },
  methods: {
    userDataChange(e) {
      e.returnValue = null
    }
  }
}
</script>
