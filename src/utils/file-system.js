/**
 * 文件系统工具模块
 * 
 * 专门处理 Electron 环境下的文件系统操作
 * 提供统一的文件选择、上传、下载等功能接口
 */

import { isElectron } from './electron-adapter.js'

/**
 * 文件选择器
 * 在 Electron 环境下使用原生对话框，Web 环境下使用 HTML input
 */
export class FileSelector {
  /**
   * 选择多个文件
   * @param {Object} options - 选择选项
   * @param {string[]} options.accept - 接受的文件类型
   * @param {boolean} options.multiple - 是否支持多选
   * @returns {Promise<File[]|string[]>} 文件列表
   */
  static async selectFiles(options = {}) {
    if (isElectron()) {
      // Electron 环境：使用原生对话框
      const result = await window.electronAPI.selectFiles({
        filters: this._buildElectronFilters(options.accept)
      })
      
      if (result.canceled) {
        return []
      }
      
      // 返回文件路径数组，稍后转换为 File 对象
      return result.filePaths
    } else {
      // Web 环境：使用 HTML file input
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = options.multiple !== false
        
        if (options.accept) {
          input.accept = Array.isArray(options.accept) 
            ? options.accept.join(',') 
            : options.accept
        }
        
        input.onchange = (event) => {
          const files = Array.from(event.target.files || [])
          resolve(files)
        }
        
        input.click()
      })
    }
  }
  
  /**
   * 选择文件夹
   * @param {Object} options - 选择选项
   * @param {boolean} options.multiple - 是否支持多选
   * @returns {Promise<string[]>} 文件夹路径数组
   */
  static async selectFolders(options = {}) {
    if (isElectron()) {
      const result = options.multiple 
        ? await window.electronAPI.selectFolders()
        : await window.electronAPI.selectFolder()
      
      if (result.canceled) {
        return []
      }
      
      return result.filePaths
    } else {
      // Web 环境不支持文件夹选择
      console.warn('文件夹选择功能仅在桌面应用中可用')
      return []
    }
  }
  
  /**
   * 构建 Electron 文件过滤器
   * @private
   */
  static _buildElectronFilters(accept) {
    if (!accept) {
      return [{ name: '所有文件', extensions: ['*'] }]
    }
    
    const extensions = Array.isArray(accept) ? accept : [accept]
    const filters = []
    
    // 预定义的文件类型过滤器
    const predefinedFilters = {
      'image/*': { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'] },
      'video/*': { name: '视频文件', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'] },
      'audio/*': { name: '音频文件', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg'] },
      'text/*': { name: '文本文件', extensions: ['txt', 'md', 'csv'] },
      'application/pdf': { name: 'PDF 文件', extensions: ['pdf'] }
    }
    
    // 添加预定义过滤器
    extensions.forEach(ext => {
      if (predefinedFilters[ext]) {
        filters.push(predefinedFilters[ext])
      } else if (ext.startsWith('.')) {
        // 处理具体扩展名，如 .jpg, .png
        const cleanExt = ext.substring(1)
        filters.push({ name: `${cleanExt.toUpperCase()} 文件`, extensions: [cleanExt] })
      }
    })
    
    // 总是添加所有文件选项
    filters.push({ name: '所有文件', extensions: ['*'] })
    
    return filters
  }
}

/**
 * 文件系统操作工具
 */
export class FileSystemUtils {
  /**
   * 在文件管理器中显示文件
   * @param {string} filePath - 文件路径
   */
  static async showInFolder(filePath) {
    if (isElectron()) {
      await window.electronAPI.showItemInFolder(filePath)
    } else {
      console.warn('在文件管理器中显示文件功能仅在桌面应用中可用')
    }
  }
  
  /**
   * 用默认应用打开文件
   * @param {string} filePath - 文件路径
   */
  static async openFile(filePath) {
    if (isElectron()) {
      await window.electronAPI.openPath(filePath)
    } else {
      // Web 环境下打开链接
      window.open(filePath, '_blank')
    }
  }
  
  /**
   * 获取文件详细信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object|null>} 文件信息
   */
  static async getFileInfo(filePath) {
    if (isElectron()) {
      return await window.electronAPI.getFileStats(filePath)
    } else {
      console.warn('获取文件信息功能仅在桌面应用中可用')
      return null
    }
  }
  
  /**
   * 递归读取文件夹内容
   * @param {string} folderPath - 文件夹路径
   * @param {Object} options - 读取选项
   * @returns {Promise<Object>} 文件夹内容
   */
  static async readFolderRecursive(folderPath, options = {}) {
    if (isElectron()) {
      return await window.electronAPI.readDirectoryRecursive(folderPath, {
        maxDepth: options.maxDepth || 10,
        includeHidden: options.includeHidden || false
      })
    } else {
      console.warn('递归读取文件夹功能仅在桌面应用中可用')
      return { success: false, files: [] }
    }
  }
  
  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  /**
   * 获取文件扩展名
   * @param {string} fileName - 文件名
   * @returns {string} 扩展名（不含点号）
   */
  static getFileExtension(fileName) {
    if (isElectron()) {
      return window.electronAPI.path.extname(fileName).substring(1)
    } else {
      const lastDot = fileName.lastIndexOf('.')
      return lastDot === -1 ? '' : fileName.substring(lastDot + 1)
    }
  }
  
  /**
   * 获取文件名（不含扩展名）
   * @param {string} fileName - 文件名
   * @returns {string} 不含扩展名的文件名
   */
  static getFileNameWithoutExtension(fileName) {
    const lastDot = fileName.lastIndexOf('.')
    return lastDot === -1 ? fileName : fileName.substring(0, lastDot)
  }
}

/**
 * 拖拽上传增强工具
 */
export class DragDropEnhancer {
  /**
   * 初始化拖拽上传功能
   * @param {HTMLElement} dropZone - 拖拽区域
   * @param {Object} callbacks - 回调函数
   * @param {Function} callbacks.onFiles - 文件处理回调
   * @param {Function} callbacks.onFolders - 文件夹处理回调
   * @param {Function} callbacks.onDragEnter - 拖拽进入回调
   * @param {Function} callbacks.onDragLeave - 拖拽离开回调
   */
  static initialize(dropZone, callbacks = {}) {
    if (!dropZone) return
    
    const {
      onFiles = () => {},
      onFolders = () => {},
      onDragEnter = () => {},
      onDragLeave = () => {}
    } = callbacks
    
    // 防止默认拖拽行为
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
    })
    
    // 拖拽进入
    dropZone.addEventListener('dragenter', (e) => {
      dropZone.classList.add('drag-over')
      onDragEnter(e)
    })
    
    // 拖拽离开
    dropZone.addEventListener('dragleave', (e) => {
      // 确保真的离开了拖拽区域
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over')
        onDragLeave(e)
      }
    })
    
    // 文件放置
    dropZone.addEventListener('drop', async (e) => {
      dropZone.classList.remove('drag-over')
      
      const files = Array.from(e.dataTransfer.files)
      const items = Array.from(e.dataTransfer.items)
      
      if (isElectron()) {
        // Electron 环境：支持文件夹拖拽
        const allFiles = []
        const folders = []
        
        for (const item of items) {
          if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry()
            if (entry) {
              if (entry.isDirectory) {
                // 处理文件夹
                const folderFiles = await this._readDirectoryEntry(entry)
                allFiles.push(...folderFiles)
                folders.push(entry.fullPath)
              } else {
                // 处理文件
                allFiles.push(item.getAsFile())
              }
            }
          }
        }
        
        if (folders.length > 0) {
          onFolders(folders, allFiles)
        } else {
          onFiles(allFiles)
        }
      } else {
        // Web 环境：只处理文件
        onFiles(files)
      }
    })
  }
  
  /**
   * 递归读取目录条目
   * @private
   */
  static async _readDirectoryEntry(directoryEntry) {
    const files = []
    
    return new Promise((resolve) => {
      const reader = directoryEntry.createReader()
      
      const readEntries = () => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve(files)
            return
          }
          
          for (const entry of entries) {
            if (entry.isFile) {
              const file = await new Promise((fileResolve) => {
                entry.file(fileResolve)
              })
              files.push(file)
            } else if (entry.isDirectory) {
              const subFiles = await this._readDirectoryEntry(entry)
              files.push(...subFiles)
            }
          }
          
          readEntries() // 继续读取（可能有更多条目）
        })
      }
      
      readEntries()
    })
  }
}

/**
 * 批量上传队列管理
 */
export class BatchUploadQueue {
  constructor() {
    this.queue = []
    this.running = false
    this.concurrency = 3 // 并发上传数
    this.activeUploads = new Map() // 正在进行的上传
  }
  
  /**
   * 添加文件到上传队列
   * @param {File|string} file - 文件对象或文件路径
   * @param {Object} options - 上传选项
   */
  addFile(file, options = {}) {
    const uploadTask = {
      id: this._generateId(),
      file,
      options,
      status: 'pending', // pending, uploading, completed, error
      progress: 0,
      error: null,
      startTime: null,
      endTime: null
    }
    
    this.queue.push(uploadTask)
    return uploadTask
  }
  
  /**
   * 添加多个文件到队列
   * @param {Array} files - 文件数组
   * @param {Object} options - 上传选项
   */
  addFiles(files, options = {}) {
    return files.map(file => this.addFile(file, options))
  }
  
  /**
   * 开始处理队列
   */
  async start() {
    if (this.running) return
    
    this.running = true
    
    while (this.queue.length > 0 && this.running) {
      // 确保不超过并发限制
      while (this.activeUploads.size < this.concurrency && this.queue.length > 0) {
        const task = this.queue.shift()
        this._processTask(task)
      }
      
      // 等待一小段时间再检查
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    this.running = false
  }
  
  /**
   * 停止队列处理
   */
  stop() {
    this.running = false
    
    // 取消所有活动的上传
    for (const [taskId, controller] of this.activeUploads) {
      controller.abort()
    }
    
    this.activeUploads.clear()
  }
  
  /**
   * 处理单个上传任务
   * @private
   */
  async _processTask(task) {
    const controller = new AbortController()
    this.activeUploads.set(task.id, controller)
    
    task.status = 'uploading'
    task.startTime = new Date()
    
    try {
      // 这里调用实际的上传逻辑
      await this._uploadFile(task, controller.signal)
      
      task.status = 'completed'
      task.progress = 100
      task.endTime = new Date()
    } catch (error) {
      task.status = 'error'
      task.error = error.message
      task.endTime = new Date()
    } finally {
      this.activeUploads.delete(task.id)
    }
  }
  
  /**
   * 实际的文件上传逻辑
   * @private
   */
  async _uploadFile(task, signal) {
    // 这里应该调用您现有的上传 API
    // 示例实现：
    console.log(`开始上传文件: ${task.file.name || task.file}`)
    
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      if (signal.aborted) {
        throw new Error('上传已取消')
      }
      
      task.progress = i
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  /**
   * 生成唯一 ID
   * @private
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      totalTasks: this.queue.length + this.activeUploads.size,
      pendingTasks: this.queue.length,
      activeTasks: this.activeUploads.size,
      running: this.running
    }
  }
}
