module.exports = {
  // 生产环境不生成sourceMap
  productionSourceMap: false,
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888', // 要请求的后台地址
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '' // 这里理解成用'/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替
        }
      }
    },
    // 使用数组形式配置allowedHosts
    allowedHosts: ['all'],
    // 禁用主机检查，允许任何主机访问
    disableHostCheck: true,
    // 开发时自动打开浏览器
    open: true,
    hot: true
  },

  // 关闭ESLint提示
  lintOnSave: false,

  // 打包优化
  configureWebpack: {
    // 生产环境优化
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 200000,
        maxAsyncRequests: 30,
        maxInitialRequests: 10,
        // 将第三方库(如vue、element-ui等)提取到vendor中
        cacheGroups: {
          // Vue核心库（最高优先级，最小包）
          vue: {
            name: 'chunk-vue',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            priority: 30,
            chunks: 'initial',
            enforce: true
          },
          // Element UI（单独分包）
          elementUI: {
            name: 'chunk-element-ui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: 25,
            chunks: 'initial',
            enforce: true
          },
          // Axios相关
          axios: {
            name: 'chunk-axios',
            test: /[\\/]node_modules[\\/](axios|axios-extra)[\\/]/,
            priority: 22,
            chunks: 'initial'
          },
          // 工具库
          utils: {
            name: 'chunk-utils',
            test: /[\\/]node_modules[\\/](dayjs|qs|nprogress|screenfull|spark-md5)[\\/]/,
            priority: 20,
            chunks: 'initial'
          },
          // MediaPipe相关库（异步加载，不影响首屏）
          mediapipe: {
            name: 'chunk-mediapipe',
            test: /[\\/]node_modules[\\/]@mediapipe[\\/]/,
            priority: 15,
            chunks: 'async',
            enforce: true
          },
          // 图像处理相关
          imageProcessing: {
            name: 'chunk-image',
            test: /[\\/]node_modules[\\/](vue-cropper)[\\/]/,
            priority: 12,
            chunks: 'async'
          },
          // 图表库
          charts: {
            name: 'chunk-charts',
            test: /[\\/]node_modules[\\/](echarts)[\\/]/,
            priority: 10,
            chunks: 'async'
          },
          // 其他第三方库（剩余的小型库）
          vendor: {
            name: 'chunk-vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            chunks: 'initial',
            minChunks: 1,
            maxSize: 150000
          },
          // 提取公共组件
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 2,
            chunks: 'initial',
            reuseExistingChunk: true,
            maxSize: 100000
          }
        }
      },
      // 运行时chunk单独提取
      runtimeChunk: {
        name: 'runtime'
      }
    },
    // 性能提示配置
    performance: {
      hints: 'warning',
      maxEntrypointSize: 400000,
      maxAssetSize: 250000
    }
  },
  // 确保worker文件被正确复制到dist目录
  chainWebpack: (config) => {
    // 添加预加载和预取
    config.plugin('preload').tap((options) => {
      options[0] = {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /chunk-mediapipe(.)+?\.js$/]
      }
      return options
    })

    config.plugin('prefetch').tap((options) => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      // 不预取大型异步chunk
      options[0].fileBlacklist.push(
        /chunk-mediapipe(.)+?\.js$/,
        /chunk-image(.)+?\.js$/,
        /chunk-charts(.)+?\.js$/
      )
      return options
    })

    config.plugin('copy').tap((args) => {
      args[0].push({
        from: 'src/workers',
        to: 'workers'
      })
      return args
    })

    // 仅在生产环境中启用图片压缩
    if (process.env.NODE_ENV === 'production') {
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          mozjpeg: {
            progressive: true,
            quality: 65
          },
          optipng: {
            enabled: false
          },
          pngquant: {
            quality: [0.65, 0.9],
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          webp: {
            quality: 75
          }
        })
        .end()
    }

    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        inline: 'fallback', // 内联模式（兼容性更好）
        filename: '[name].worker.js' // 自定义输出文件名
      })
      .end()

    // 优化模块解析
    config.resolve.alias
      .set('@', require('path').resolve(__dirname, 'src'))

    // 添加模块缓存
    if (process.env.NODE_ENV === 'development') {
      config.cache({
        type: 'filesystem'
      })
    }

    // 优化构建性能
    if (process.env.NODE_ENV === 'production') {
      // 移除console
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
        return args
      })
    }
  },
  parallel: false // 禁用多线程，避免与 Worker 冲突
}
