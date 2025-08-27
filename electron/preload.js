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
  
  // === 文件系统集成 API ===
  
  /**
   * 选择多个文件
   * @param {Object} options - 选择选项
   * @param {Array} options.filters - 文件过滤器
   * @returns {Promise<Object>} 文件选择结果
   */
  selectFiles: (options) => ipcRenderer.invoke('select-files', options),
  
  /**
   * 选择单个文件夹
   * @param {Object} options - 选择选项
   * @returns {Promise<Object>} 文件夹选择结果
   */
  selectFolder: (options) => ipcRenderer.invoke('select-folder', options),
  
  /**
   * 选择多个文件夹
   * @param {Object} options - 选择选项
   * @returns {Promise<Object>} 文件夹选择结果
   */
  selectFolders: (options) => ipcRenderer.invoke('select-folders', options),
  
  /**
   * 在文件管理器中显示文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>} 操作结果
   */
  showItemInFolder: (filePath) => ipcRenderer.invoke('show-item-in-folder', filePath),
  
  /**
   * 用默认应用打开文件/文件夹
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>} 操作结果
   */
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  
  /**
   * 获取文件/文件夹详细信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object|null>} 文件统计信息
   */
  getFileStats: (filePath) => ipcRenderer.invoke('get-file-stats', filePath),
  
  /**
   * 递归读取文件夹内容
   * @param {string} dirPath - 文件夹路径
   * @param {Object} options - 读取选项
   * @param {number} options.maxDepth - 最大递归深度
   * @param {boolean} options.includeHidden - 是否包含隐藏文件
   * @returns {Promise<Object>} 文件夹内容
   */
  readDirectoryRecursive: (dirPath, options) => ipcRenderer.invoke('read-directory-recursive', dirPath, options),
  
  /**
   * 创建文件夹
   * @param {string} dirPath - 文件夹路径
   * @returns {Promise<Object>} 创建结果
   */
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', dirPath),
  
  // === 路径工具函数 ===
  
  /**
   * 路径处理工具
   */
  path: {
    /**
     * 连接路径
     * @param {...string} paths - 路径片段
     * @returns {string} 连接后的路径
     */
    join: (...paths) => {
      const separator = process.platform === 'win32' ? '\\' : '/'
      return paths.join(separator)
    },
    
    /**
     * 获取文件名
     * @param {string} filePath - 文件路径
     * @returns {string} 文件名
     */
    basename: (filePath) => {
      const separator = process.platform === 'win32' ? '\\' : '/'
      return filePath.split(separator).pop()
    },
    
    /**
     * 获取目录路径
     * @param {string} filePath - 文件路径
     * @returns {string} 目录路径
     */
    dirname: (filePath) => {
      const separator = process.platform === 'win32' ? '\\' : '/'
      const parts = filePath.split(separator)
      parts.pop()
      return parts.join(separator)
    },
    
    /**
     * 获取文件扩展名
     * @param {string} filePath - 文件路径
     * @returns {string} 扩展名（包含点号）
     */
    extname: (filePath) => {
      const name = filePath.split(/[\\/]/).pop()
      const lastDot = name.lastIndexOf('.')
      return lastDot === -1 ? '' : name.slice(lastDot)
    }
  }
})

/**
 * 暴露进程信息
 * 
 * 为渲染进程提供必要的进程版本信息
 * 主要用于环境检测和调试
 * 
 * 注意: 不直接暴露 process 对象，而是创建新的对象
 */
contextBridge.exposeInMainWorld('electronProcess', {
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