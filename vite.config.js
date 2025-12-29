import {
  defineConfig
} from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import {
  visualizer
} from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'
import {
  fileURLToPath,
  URL
} from 'node:url'
export default defineConfig({
  plugins: [
    vue2(),
    // 图片优化
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      mozjpeg: {
        quality: 75,
        progressive: true
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    // 包分析工具
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true
    })
  ],

  // 开发服务器配置
  server: {
    port: 5000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // 路径别名
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    }
  },

  // 构建配置
  build: {
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        // 更精细的代码分割策略
        manualChunks: (id) => {
          // Vue 核心库（优先级最高，单独打包）
          if (id.includes('vue/dist') || id.includes('vue-router') || id.includes('vuex')) {
            return 'vue-vendor'
          }

          // Element UI（体积较大，单独分包）
          if (id.includes('element-ui')) {
            return 'element-ui'
          }

          // ECharts（按模块细分）
          if (id.includes('echarts')) {
            if (id.includes('echarts/core') || id.includes('echarts/charts')) {
              return 'echarts-core'
            }
            if (id.includes('echarts/components') || id.includes('echarts/renderers')) {
              return 'echarts-components'
            }
            return 'echarts'
          }

          // MediaPipe（AI相关，使用频率不高）
          if (id.includes('@mediapipe/')) {
            return 'mediapipe'
          }

          // 工具库（高频使用，合并打包）
          if (id.includes('axios') || id.includes('dayjs') || id.includes('nprogress') || id.includes('qs')) {
            return 'utils'
          }

          // 文件处理相关
          if (id.includes('spark-md5') || id.includes('vue-cropper')) {
            return 'file-tools'
          }

          // 其他UI/交互工具
          if (id.includes('screenfull') || id.includes('promise-queue-plus')) {
            return 'ui-tools'
          }

          // 其他第三方库
          if (id.includes('node_modules')) {
            return 'vendors'
          }
        },
        // 资源文件命名
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop()
          if (/\.(png|jpe?g|gif|svg)$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `static/[name]-[hash].${ext}`
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // CSS配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  // 定义全局变量
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    'process.env': {}
  },

  // Worker配置
  worker: {
    format: 'es'
  }
})
