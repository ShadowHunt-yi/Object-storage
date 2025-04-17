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
        // 将第三方库(如vue、element-ui等)提取到vendor中
        cacheGroups: {
          vendor: {
            name: 'chunk-vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          // 提取公共组件
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 5,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  // 确保worker文件被正确复制到dist目录
  chainWebpack: (config) => {
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
  },
  parallel: false // 禁用多线程，避免与 Worker 冲突
}
