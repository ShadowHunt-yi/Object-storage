// API请求统一封装
import axios from 'axios'
import { isElectron } from './electron-adapter.js'

// 检测运行环境并设置基础URL
const getBaseURL = () => {
  if (isElectron()) {
    // 检测是否为 Electron 开发模式
    const isElectronDev = window.location.protocol === 'http:' && window.location.hostname === 'localhost'
    console.log('isElectronDev', isElectronDev)
    if (isElectronDev) {
      // Electron 开发模式：使用内置代理服务器，通过 /api 前缀转发
      return 'http://localhost:5174/api'
    } else {
      // Electron 预览/生产模式：直接访问后端 API
      return 'http://172.21.1.32:8888'
    }
  } else {
    // Web 环境下使用代理
    try {
      return import.meta.env?.VITE_APP_BASE_API || '/api'
    } catch (error) {
      console.warn('访问环境变量失败，使用默认值:', error)
      return '/api'
    }
  }
}

// 获取并记录基础URL
const baseURL = getBaseURL()
console.log('🔗 API Base URL:', baseURL)

// 创建axios实例
const request = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 请求超时时间
  // 在 Electron 环境下添加跨域配置
  ...(isElectron() && {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一处理错误响应
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
