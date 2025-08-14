import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue2(),
    // 兼容旧浏览器
    legacy({
      targets: ['defaults', 'not IE 11']
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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue', '.json']
  },

  // 构建配置
  build: {
    // 生产环境不生成sourcemap
    sourcemap: false,
    // 构建输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'static',
    // 构建优化
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          // 将第三方库分离到vendor chunk
          vendor: ['vue', 'vue-router', 'vuex'],
          // Element UI单独打包
          elementUI: ['element-ui']
        },
        // 自定义chunk文件名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return 'js/[name]-[hash].js'
          }
          return 'js/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          return `static/[name]-[hash].${ext}`
        }
      }
    },
    // 设置打包大小警告阈值
    chunkSizeWarningLimit: 1000
  },

  // CSS配置
  css: {
    preprocessorOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 可以在这里定义less变量
          },
          javascriptEnabled: true
        }
      },
      sass: {
        additionalData: `
          // 可以在这里添加全局sass变量
        `
      }
    }
  },

  // 定义全局变量
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    // 为兼容性提供process.env
    'process.env': {}
  },

  // Worker配置
  worker: {
    format: 'es',
    plugins: () => []
  },

  // 静态资源处理
  assetsInclude: ['**/*.worker.js']
})
