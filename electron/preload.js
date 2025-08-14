/**
 * Electron Preload 脚本
 * 
 * 功能说明：
 * 1. 在渲染进程中安全地暴露主进程 API
 * 2. 作为主进程和渲染进程之间的安全桥梁
 * 3. 提供环境检测能力
 * 4. 暴露系统平台信息
 * 
 * 安全考虑：
 * - 使用 contextBridge 确保安全的 API 暴露
 * - 不直接暴露 Node.js API 到渲染进程
 * - 只暴露经过验证的、安全的 API 接口
 * 
 * 注意: Preload 脚本必须使用 CommonJS 语法，不能使用 ES 模块
 */

const { contextBridge, ipcRenderer } = require('electron')

/**
 * 向渲染进程暴露 Electron API
 * 
 * 通过 contextBridge.exposeInMainWorld 安全地暴露 API
 * 渲染进程可以通过 window.electronAPI 访问这些功能
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // === 应用信息 ===
  
  /**
   * 获取应用版本号
   * @returns {Promise<string>} 应用版本
   */
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // === 系统对话框 ===
  
  /**
   * 显示消息对话框
   * @param {Object} options - 对话框选项
   * @param {string} options.type - 对话框类型 ('info', 'error', 'warning', 'question')
   * @param {string} options.title - 对话框标题
   * @param {string} options.message - 主要消息
   * @param {string} options.detail - 详细信息
   * @returns {Promise<Object>} 用户响应结果
   */
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  /**
   * 显示保存文件对话框
   * @param {Object} options - 对话框选项
   * @param {string} options.defaultPath - 默认文件路径
   * @param {Array} options.filters - 文件过滤器
   * @returns {Promise<Object>} 保存对话框结果
   */
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  
  /**
   * 显示打开文件对话框
   * @param {Object} options - 对话框选项
   * @param {Array} options.properties - 对话框属性 (['openFile', 'multiSelections'])
   * @param {Array} options.filters - 文件过滤器
   * @returns {Promise<Object>} 打开对话框结果
   */
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // === 系统信息 ===
  
  /**
   * 获取操作系统平台信息
   * @type {string} 平台名称 ('win32', 'darwin', 'linux')
   */
  platform: process.platform,
  
  // === 环境标识 ===
  
  /**
   * Electron 环境标识
   * 用于渲染进程检测是否运行在 Electron 中
   * @type {boolean}
   */
  isElectron: true,
  
  // 未来可以在这里添加更多 API：
  // - 文件系统操作
  // - 系统通知
  // - 应用窗口控制
  // - 自动更新功能
  // - 等等...
})

/**
 * 暴露进程信息
 * 
 * 为渲染进程提供必要的进程版本信息
 * 主要用于环境检测和调试
 */
contextBridge.exposeInMainWorld('process', {
  /**
   * 进程版本信息
   * 包含 Electron、Node.js、Chrome 等版本号
   */
  versions: {
    electron: process.versions.electron,
    node: process.versions.node,
    chrome: process.versions.chrome
  },
  
  /**
   * 操作系统平台
   * @type {string}
   */
  platform: process.platform
})

/**
 * DOM 加载完成后的初始化
 * 
 * 在页面 DOM 加载完成后执行一些初始化操作
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Electron preload script loaded')
  console.log('📦 Electron version:', process.versions.electron)
  console.log('🌐 Chrome version:', process.versions.chrome)
  console.log('💻 Platform:', process.platform)
})