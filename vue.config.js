module.exports = {
    devServer: {
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://172.20.10.4:8888', // 要请求的后台地址
                ws: true, // 启用websockets
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': '' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替

                }
            }
        }
    },
    lintOnSave: false
}
