/**
 * Electron 内置代理服务器
 * 
 * 功能说明：
 * 1. 为 Electron 应用提供 API 代理服务
 * 2. 解决开发模式下的跨域问题
 * 3. 自动处理 CORS 请求头
 * 4. 支持路径重写和请求转发
 * 5. 提供健康检查和监控能力
 * 
 * 工作原理：
 * Vue App -> http://localhost:5174/api/* -> http://127.0.0.1:8888/*
 * 
 * 使用场景：
 * - 开发模式下替代 Vite 的代理功能
 * - 生产模式下可选的本地 API 网关
 */

import http from 'http'
import https from 'https'
import { URL } from 'url'

/**
 * Electron 代理服务器类
 */
export class ElectronProxyServer {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {number} options.port - 代理服务器端口，默认 5174
   * @param {string} options.targetUrl - 目标后端 API 地址，默认 http://127.0.0.1:8888
   */
  constructor(options = {}) {
    this.port = options.port || 5174
    this.targetUrl = options.targetUrl || 'http://127.0.0.1:8888'
    this.server = null
    
    console.log(`Proxy server configuration:`)
    console.log(`   Listen port: ${this.port}`)
    console.log(`   Target URL: ${this.targetUrl}`)
  }

  /**
   * 启动代理服务器
   * @returns {Promise<number>} 返回实际使用的端口号
   */
  start() {
    return new Promise((resolve, reject) => {
      // 创建 HTTP 服务器
      this.server = http.createServer((req, res) => {
        // 设置 CORS 响应头 - 允许跨域访问
        this.setCorsHeaders(res)

        // 处理 OPTIONS 预检请求
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }

        // 健康检查端点
        if (req.url === '/health') {
          this.handleHealthCheck(req, res)
          return
        }

        // 代理所有 API 请求（除了健康检查）
        this.proxyRequest(req, res)
      })

      // 启动服务器监听
      this.server.listen(this.port, (err) => {
        if (err) {
          console.error('❌ 代理服务器启动失败:', err)
          reject(err)
        } else {
          console.log(`✅ Electron proxy server running on http://localhost:${this.port}`)
          console.log(`📡 Proxying /api requests to ${this.targetUrl}`)
          resolve(this.port)
        }
      })

      // 端口冲突处理 - 自动尝试下一个端口
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`⚠️  Port ${this.port} is in use, trying port ${this.port + 1}`)
          this.port += 1
          this.start().then(resolve).catch(reject)
        } else {
          reject(err)
        }
      })
    })
  }

  /**
   * 设置 CORS 响应头
   * @param {http.ServerResponse} res - 响应对象
   */
  setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    res.setHeader('Access-Control-Allow-Credentials', 'false')
  }

  /**
   * 处理健康检查请求
   * @param {http.IncomingMessage} req - 请求对象
   * @param {http.ServerResponse} res - 响应对象
   */
  handleHealthCheck(req, res) {
    const healthInfo = {
      status: 'ok',
      service: 'electron-proxy-server',
      version: '1.0.0',
      proxy: true,
      target: this.targetUrl,
      port: this.port,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(healthInfo, null, 2))
  }

  /**
   * 代理请求到目标服务器
   * @param {http.IncomingMessage} req - 原始请求
   * @param {http.ServerResponse} res - 响应对象
   */
  proxyRequest(req, res) {
    // 直接使用原始路径（不需要移除前缀）
    const targetPath = req.url || '/'
    const targetUrl = new URL(targetPath, this.targetUrl)
    
    // 记录代理请求日志
    console.log(`[${new Date().toISOString()}] 🔄 ${req.method} ${req.url} -> ${targetUrl.href}`)

    // 准备代理请求选项
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: {
        ...req.headers,
        // 修改 Host 头指向目标服务器
        host: targetUrl.hostname,
        // 设置正确的 Origin
        origin: targetUrl.origin,
        // 移除可能导致问题的头
        'accept-encoding': 'identity'
      }
    }

    // 移除代理相关的头部
    delete options.headers['host']

    // 选择合适的 HTTP 模块
    const httpModule = targetUrl.protocol === 'https:' ? https : http

    // 创建到目标服务器的代理请求
    const proxyReq = httpModule.request(options, (proxyRes) => {
      // 设置响应状态码和头部
      res.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        // 强制添加 CORS 头
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      })

      // 将目标服务器的响应流式传输到客户端
      proxyRes.pipe(res)
      
      // 记录响应日志
      console.log(`[${new Date().toISOString()}] ✅ ${proxyRes.statusCode} ${req.method} ${req.url}`)
    })

    // 代理请求错误处理
    proxyReq.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ❌ Proxy request failed:`, err.message)
      
      // 返回错误响应
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          error: 'Proxy Error',
          message: err.message,
          target: targetUrl.href,
          timestamp: new Date().toISOString()
        }))
      }
    })

    // 请求超时处理
    proxyReq.setTimeout(10000, () => {
      console.error(`[${new Date().toISOString()}] ⏰ Proxy request timeout: ${req.url}`)
      proxyReq.destroy()
      
      if (!res.headersSent) {
        res.writeHead(504, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: 'Gateway Timeout',
          message: 'Target server did not respond in time',
          target: targetUrl.href
        }))
      }
    })

    // 将客户端请求体流式传输到目标服务器
    req.pipe(proxyReq)

    // 客户端连接错误处理
    req.on('error', (err) => {
      console.error('❌ Client request error:', err.message)
      proxyReq.destroy()
    })
  }

  /**
   * 停止代理服务器
   * @returns {Promise<void>}
   */
  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 Proxy server stopped')
          this.server = null
          resolve()
        })
        
        // 强制关闭所有连接
        this.server.closeAllConnections?.()
      } else {
        resolve()
      }
    })
  }

  /**
   * 获取代理服务器访问地址
   * @returns {string} 代理服务器 URL
   */
  getProxyUrl() {
    return `http://localhost:${this.port}`
  }

  /**
   * 获取代理服务器状态信息
   * @returns {Object} 状态信息
   */
  getStatus() {
    return {
      running: !!this.server,
      port: this.port,
      targetUrl: this.targetUrl,
      proxyUrl: this.getProxyUrl()
    }
  }
}