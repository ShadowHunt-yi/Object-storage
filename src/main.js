import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import './plugins/element.js'
// 动态加载iconfont.js
import('./assets/font/iconfont.js')
import './assets/font-awesome/css/font-awesome.min.css'
import axios from 'axios'
// 导入NProgress包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueCropper from 'vue-cropper'
// 导入 Electron 适配器
import { initElectronAdapter, isElectron } from './utils/electron-adapter.js'

Vue.use(VueCropper)

// 初始化 Electron 适配器
initElectronAdapter()
axios.interceptors.request.use((config) => {
  NProgress.start()
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
window.eventBus = new Vue()
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
