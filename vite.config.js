import {
  defineConfig,
  loadEnv
} from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import {
  visualizer
} from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import {
  fileURLToPath,
  URL
} from 'node:url'

/**
 * Vite 配置文件
 * 支持 Web 和 Electron 两种构建模式
 * 
 * 运行模式：
 * - Web 模式: npm run dev (标准 Web 应用开发)
 * - Electron 模式: npm run electron:dev (Electron 桌面应用开发)
 */
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 判断是否为 Electron 模式
  const isElectron = mode === 'electron'
  
  const config = {
    plugins: [
      // Vue 2 支持插件
      vue2(),
      
      // 图片优化插件 - 自动压缩图片资源
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
      
      // 包分析工具 - 生成打包分析报告
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true
      })
    ],

    // 路径别名配置
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    // 构建配置
    build: {
      // 开发模式生成 sourcemap，生产模式不生成
      sourcemap: command === 'serve' ? true : false,
      outDir: 'dist',
      assetsDir: 'static',
      rollupOptions: {
        output: {
          // 代码分割策略 - 按模块类型分包以优化加载性能
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
          
          // 资源文件命名策略
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

    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },

    // 全局变量定义
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': {}
    },

    // Worker 配置
    worker: {
      format: 'es'
    }
  }

  // Electron 模式特殊配置
  if (isElectron) {
    config.plugins.push(
      // Electron 主进程插件配置
      electron([
        {
          // 主进程入口文件
          entry: 'electron/main.js',
          onstart(options) {
            // 开发模式下启动 Electron
            if (command === 'serve') {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap: command === 'serve',
              minify: command === 'build',
              outDir: 'dist',
              rollupOptions: {
                // Electron 主进程外部依赖
                external: ['electron']
              }
            }
          }
        },
        
        // Preload 脚本配置
        {
          entry: 'electron/preload.js',
          onstart(options) {
            // Preload 脚本不需要启动行为
          },
          vite: {
            build: {
              sourcemap: command === 'serve' ? 'inline' : false,
              minify: command === 'build',
              outDir: 'dist',
              lib: {
                entry: 'electron/preload.js',
                formats: ['cjs'],
                fileName: () => 'preload.js'
              },
              rollupOptions: {
                external: ['electron'],
                output: {
                  entryFileNames: 'preload.js'
                }
              }
            }
          }
        }
      ]),
      
      // Electron 渲染进程插件
      renderer()
    )

    // Electron 环境下的特殊配置
    config.build.rollupOptions.external = ['electron']
    
    // 设置相对路径，确保 Electron 能正确加载资源
    config.base = './'
  } else {
    // Web 模式配置 - 开发服务器和代理设置
    config.server = {
      port: 5173,
      open: true,
      host: true,
      // API 代理配置 - 将 /api 请求代理到后端服务
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8888',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }

  return config
})