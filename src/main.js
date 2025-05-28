import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import resourceLoader from './utils/resourceLoader'
// 导入NProgress包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 异步加载样式文件
const loadStyles = async () => {
  try {
    await Promise.all([
      import('./assets/css/global.css'),
      import('./assets/font/iconfont.css'),
      import('./assets/font-awesome/css/font-awesome.min.css')
    ])
  } catch (error) {
    console.warn('部分样式文件加载失败:', error)
  }
}

// 异步加载字体图标
const loadFontIcons = async () => {
  try {
    await import('./assets/font/iconfont.js')
  } catch (error) {
    console.warn('字体图标加载失败:', error)
  }
}

// 异步加载VueCropper（仅在需要时加载）
let VueCropper = null
const loadVueCropper = async () => {
  if (!VueCropper) {
    const module = await import('vue-cropper')
    VueCropper = module.default
    Vue.use(VueCropper)
  }
  return VueCropper
}

// 将工具函数挂载到Vue原型上
Vue.prototype.$loadVueCropper = loadVueCropper
Vue.prototype.$downloadManager = downloadManager

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

// 隐藏加载动画的函数
const hideLoading = () => {
  const loadingElement = document.getElementById('app-loading')
  if (loadingElement) {
    loadingElement.classList.add('hidden')
    setTimeout(() => {
      loadingElement.remove()
    }, 300)
  }
}

// 更新加载文本
const updateLoadingText = (text) => {
  const loadingText = document.querySelector('.loading-text')
  if (loadingText) {
    loadingText.textContent = text
  }
}

// 应用初始化
const initApp = async () => {
  try {
    updateLoadingText('正在加载核心资源...')

    // 第一阶段：加载关键资源
    await Promise.all([
      loadStyles(),
      resourceLoader.preloadCriticalCSS()
    ])

    updateLoadingText('正在初始化应用...')

    // 第二阶段：创建Vue实例
    const app = new Vue({
      router,
      store,
      render: (h) => h(App),
      async mounted() {
        // 应用挂载完成后的操作
        this.$nextTick(async () => {
          updateLoadingText('正在完成初始化...')

          // 延迟加载字体图标，避免阻塞首屏
          setTimeout(async () => {
            await loadFontIcons()
          }, 100)

          // 启动非关键资源的预加载
          setTimeout(() => {
            resourceLoader.loadNonCriticalResources()
          }, 500)

          // 隐藏加载动画
          setTimeout(() => {
            hideLoading()
          }, 200)
        })
      }
    })

    app.$mount('#app')

  } catch (error) {
    console.error('应用初始化失败:', error)
    updateLoadingText('加载失败，请刷新重试')
    setTimeout(() => {
      hideLoading()
    }, 1000)
  }
}

// 启动应用
initApp()
