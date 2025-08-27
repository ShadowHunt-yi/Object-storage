/**
 * Electron 主进程入口文件
 * 
 * 主要功能：
 * 1. 创建和管理应用窗口
 * 2. 处理应用生命周期事件
 * 3. 设置应用菜单和快捷键
 * 4. 启动内置代理服务器(开发模式)
 * 5. 处理 IPC 通信
 * 6. 配置安全策略
 */

import { app, BrowserWindow, Menu, ipcMain, dialog, shell, session } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { ElectronProxyServer } from './proxy-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 环境检测
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

// 检测是否应该连接到开发服务器
const shouldUseDevServer = isDev && VITE_DEV_SERVER_URL

// 全局变量
let mainWindow
let proxyServer

/**
 * 创建主应用窗口
 * 配置窗口属性、webPreferences 和事件监听
 */
function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/favicon-electron.ico'), 
    // Web 安全配置
    webPreferences: {
      // 安全配置 - 禁用 Node.js 集成到渲染进程
      nodeIntegration: false,
      
      // 启用上下文隔离 - 隔离主世界和隔离世界
      contextIsolation: true,
      
      // 禁用远程模块
      enableRemoteModule: false,
      
      // 预加载脚本 - 在渲染进程加载前执行
      preload: path.join(__dirname, 'preload.js'),
      
      // 开发模式下禁用 Web 安全 - 允许跨域请求
      webSecurity: false, // 始终禁用以允许 API 访问
      
      // 允许不安全内容（开发模式）
      allowRunningInsecureContent: isDev,
      
      // 启用实验性功能（仅开发模式）
      experimentalFeatures: isDev,
    },
    
    // 窗口显示策略 - 等待内容加载完成再显示
    show: false,
    titleBarStyle: 'default',
    frame: true,
  })

  // 窗口准备就绪时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
          // 开发环境下自动打开开发者工具
    if (shouldUseDevServer) {
      mainWindow.webContents.openDevTools()
      
      // 禁用缓存以避免 304 问题
      mainWindow.webContents.session.clearCache()
      
      // 设置用户代理以便识别
      mainWindow.webContents.setUserAgent(
        mainWindow.webContents.getUserAgent() + ' ElectronDesktopApp'
      )
      
      // 添加开发环境快捷键
      mainWindow.webContents.on('before-input-event', (event, input) => {
        // Ctrl+R 或 F5 强制刷新（清除缓存）
        if ((input.control && input.key.toLowerCase() === 'r') || input.key === 'F5') {
          mainWindow.webContents.session.clearCache().then(() => {
            mainWindow.webContents.reload()
          })
        }
        // Ctrl+Shift+R 硬刷新
        if (input.control && input.shift && input.key.toLowerCase() === 'r') {
          mainWindow.webContents.session.clearStorageData().then(() => {
            mainWindow.webContents.session.clearCache().then(() => {
              mainWindow.webContents.reload()
            })
          })
        }
      })
    }
  })

  // 加载应用内容
  if (shouldUseDevServer) {
    // 开发环境：加载 Vite 开发服务器
    console.log('🌐 Loading from dev server:', VITE_DEV_SERVER_URL)
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // 生产/预览环境：加载构建后的静态文件
    const indexPath = path.join(__dirname, '../dist/index.html')
    console.log('📁 Loading from file:', indexPath)
    mainWindow.loadFile(indexPath)
  }

  // 窗口关闭事件处理
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 外部链接处理 - 在系统默认浏览器中打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 防止导航到外部 URL
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

/**
 * 创建应用菜单
 * 配置原生菜单栏和快捷键
 */
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '重新加载', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '强制重新加载', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: '开发者工具', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { label: '最小化', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: '关闭', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于智域云图对象存储平台',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于',
              message: '智域云图-对象存储平台',
              detail: 'Version 0.1.0\n基于 Electron + Vue.js 构建的对象存储管理平台'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

/**
 * 应用启动流程
 * 1. 启动代理服务器（开发模式）
 * 2. 配置会话安全策略
 * 3. 创建主窗口和菜单
 * 4. 设置事件监听
 */
app.whenReady().then(async () => {
  // 只在使用开发服务器时启动内置代理服务器
  if (shouldUseDevServer) {
    try {
      proxyServer = new ElectronProxyServer({
        port: 5174,  // 代理服务器端口
        targetUrl: 'http://172.21.1.32:8888'  // 后端 API 地址
      })
      await proxyServer.start()
      console.log('🚀 Built-in proxy server started')
    } catch (error) {
      console.error('❌ Failed to start proxy server:', error)
    }
  } else {
    console.log('📦 Running in preview/production mode - proxy server disabled')
  }

  // 配置会话安全策略 - 处理跨域请求
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*'],
        'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, OPTIONS'],
        'Access-Control-Allow-Headers': ['Content-Type, Authorization'],
      }
    })
  })

  // 创建主窗口和菜单
  createWindow()
  createMenu()

  // macOS 应用激活处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

/**
 * 应用退出处理
 * Windows 和 Linux 平台在所有窗口关闭时退出应用
 * macOS 保持应用运行直到用户明确退出
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * 开发环境证书错误处理
 * 在开发模式下忽略 SSL 证书错误
 */
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev) {
    event.preventDefault()
    callback(true)
  } else {
    callback(false)
  }
})

/**
 * IPC 通信处理
 * 为渲染进程提供原生 API 访问能力
 */

// 获取应用版本
ipcMain.handle('app-version', () => {
  return app.getVersion()
})

// 显示消息对话框
ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options)
  return result
})

// 显示保存文件对话框
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options)
  return result
})

// 显示打开文件对话框
ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options)
  return result
})

// === 文件系统集成 API ===

// 选择多个文件
ipcMain.handle('select-files', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '所有文件', extensions: ['*'] },
      { name: '图片', extensions: ['jpg', 'png', 'gif', 'bmp', 'webp', 'svg'] },
      { name: '文档', extensions: ['pdf', 'doc', 'docx', 'txt', 'md'] },
      { name: '视频', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv'] },
      { name: '音频', extensions: ['mp3', 'wav', 'flac', 'aac'] },
      { name: '压缩包', extensions: ['zip', 'rar', '7z', 'tar', 'gz'] }
    ],
    ...options
  })
  return result
})

// 选择文件夹
ipcMain.handle('select-folder', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    ...options
  })
  return result
})

// 选择文件夹（支持多选）
ipcMain.handle('select-folders', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
    ...options
  })
  return result
})

// 在文件管理器中显示文件
ipcMain.handle('show-item-in-folder', async (event, filePath) => {
  shell.showItemInFolder(filePath)
  return true
})

// 用默认应用打开文件
ipcMain.handle('open-path', async (event, filePath) => {
  const result = await shell.openPath(filePath)
  return result === '' // 成功时返回空字符串
})

// 获取文件/文件夹详细信息
ipcMain.handle('get-file-stats', async (event, filePath) => {
  try {
    const fs = await import('fs/promises')
    const stats = await fs.stat(filePath)
    return {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      birthtime: stats.birthtime,
      mtime: stats.mtime,
      atime: stats.atime
    }
  } catch (error) {
    console.error('Error getting file stats:', error)
    return null
  }
})

// 递归读取文件夹内容
ipcMain.handle('read-directory-recursive', async (event, dirPath, options = {}) => {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const { maxDepth = 10, includeHidden = false } = options
    
    async function readDirRecursive(currentPath, currentDepth = 0) {
      if (currentDepth >= maxDepth) {
        return []
      }

      const items = []
      const entries = await fs.readdir(currentPath, { withFileTypes: true })

      for (const entry of entries) {
        // 跳过隐藏文件（如果设置不包含隐藏文件）
        if (!includeHidden && entry.name.startsWith('.')) {
          continue
        }

        const fullPath = path.join(currentPath, entry.name)
        const stats = await fs.stat(fullPath)

        const item = {
          name: entry.name,
          path: fullPath,
          relativePath: path.relative(dirPath, fullPath),
          isDirectory: entry.isDirectory(),
          isFile: entry.isFile(),
          size: stats.size,
          mtime: stats.mtime,
          depth: currentDepth
        }

        items.push(item)

        // 如果是文件夹，递归读取
        if (entry.isDirectory()) {
          const subItems = await readDirRecursive(fullPath, currentDepth + 1)
          items.push(...subItems)
        }
      }

      return items
    }

    const result = await readDirRecursive(dirPath)
    return { success: true, files: result }
  } catch (error) {
    console.error('Error reading directory:', error)
    return { success: false, error: error.message, files: [] }
  }
})

// 创建文件夹
ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    const fs = await import('fs/promises')
    await fs.mkdir(dirPath, { recursive: true })
    return { success: true }
  } catch (error) {
    console.error('Error creating directory:', error)
    return { success: false, error: error.message }
  }
})

/**
 * 应用生命周期事件处理
 */

// 应用退出前的清理工作
app.on('before-quit', async (event) => {
  // 停止代理服务器
  if (proxyServer) {
    console.log('🛑 Stopping proxy server...')
    await proxyServer.stop()
  }
  console.log('👋 Application is about to quit')
})

/**
 * 错误处理
 * 捕获和处理未预期的错误
 */

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error)
  // 生产环境可以在这里实现错误报告或应用重启
})

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason)
})