module.exports = {
  // 生产环境不生成sourceMap
  productionSourceMap: false,
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://172.21.3.107:8888', // 要请求的后台地址
        ws: true, // 启用websockets
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
    hot: true,
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
  }
}
