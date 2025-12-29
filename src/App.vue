<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import autoLogout from '@/utils/autoLogout'

export default {
  name: 'app',
  data() {
    return {
      autoLogoutEnabled: false
    }
  },
  watch: {
    // 监听路由变化
    '$route'(to) {
      // 在非登录页启用自动登出
      if (to.path !== '/login') {
        this.enableAutoLogout()
      } else {
        // 在登录页禁用自动登出
        this.disableAutoLogout()
      }
    }
  },
  methods: {
    enableAutoLogout() {
      if (!this.autoLogoutEnabled) {
        autoLogout.init({
          timeout: 10 * 60 * 1000, // 10分钟
          warningTime: 1 * 60 * 1000, // 提前1分钟警告
          onLogout: this.handleAutoLogout
        })
        this.autoLogoutEnabled = true
      }
    },
    disableAutoLogout() {
      if (this.autoLogoutEnabled) {
        autoLogout.stop()
        this.autoLogoutEnabled = false
      }
    },
    handleAutoLogout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.autoLogoutEnabled = false
    }
  },
  created() {
    if (this.$route.path !== '/login') {
      this.enableAutoLogout()
    }
  },
  beforeDestroy() {
    this.disableAutoLogout()
  }
}
</script>

<style></style>
