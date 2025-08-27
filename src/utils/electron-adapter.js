/**
 * Electron 环境适配器
 * 用于处理 Electron 环境下的特殊需求
 */

/**
 * 检测是否在 Electron 环境中
 */
export function isElectron() {
  // 多种方式检测 Electron 环境
  return !!(
    (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron) ||
    (typeof window !== 'undefined' && window.electronProcess && window.electronProcess.versions && window.electronProcess.versions.electron) ||
    (typeof window !== 'undefined' && window.process && window.process.versions && window.process.versions.electron) ||
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('electron') > -1) ||
    (typeof process !== 'undefined' && process.versions && process.versions.electron)
  )
}

/**
 * 获取应用版本
 */
export async function getAppVersion() {
  if (isElectron()) {
    return await window.electronAPI.getAppVersion()
  }
  return 'Web Version'
}

/**
 * 显示消息框
 */
export async function showMessageBox(options) {
  if (isElectron()) {
    return await window.electronAPI.showMessageBox(options)
  } else {
    // Web 环境下使用浏览器的 alert
    if (options.type === 'error') {
      alert(`错误: ${options.message}\n${options.detail || ''}`)
    } else {
      alert(`${options.message}\n${options.detail || ''}`)
    }
    return { response: 0 }
  }
}

/**
 * 显示保存对话框
 */
export async function showSaveDialog(options) {
  if (isElectron()) {
    return await window.electronAPI.showSaveDialog(options)
  } else {
    // Web 环境下使用下载
    const link = document.createElement('a')
    link.download = options.defaultPath || 'download'
    link.href = options.url || '#'
    link.click()
    return { filePath: options.defaultPath || 'download' }
  }
}

/**
 * 显示打开文件对话框
 */
export async function showOpenDialog(options) {
  if (isElectron()) {
    return await window.electronAPI.showOpenDialog(options)
  } else {
    // Web 环境下使用 input file
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = options.properties && options.properties.includes('multiSelections')
      input.accept = options.filters ? options.filters.map(f => f.extensions.map(e => `.${e}`).join(',')).join(',') : '*'
      
      input.onchange = (event) => {
        const files = Array.from(event.target.files)
        resolve({
          canceled: false,
          filePaths: files.map(f => f.path || f.name)
        })
      }
      
      input.click()
    })
  }
}

/**
 * 获取平台信息
 */
export function getPlatform() {
  if (isElectron()) {
    return window.electronAPI.platform
  }
  return navigator.platform
}

/**
 * 处理文件下载
 * 在 Electron 环境中提供更好的下载体验
 */
export async function downloadFile(url, filename) {
  if (isElectron()) {
    // 在 Electron 中，我们可以使用保存对话框
    const result = await showSaveDialog({
      defaultPath: filename,
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (!result.canceled) {
      // 这里可以通知主进程下载文件到指定路径
      // 现在先使用标准的下载方式
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
    }
  } else {
    // Web 环境下的标准下载
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }
}

/**
 * Electron 环境下的错误处理
 */
export function handleElectronError(error) {
  console.error('Electron Error:', error)
  
  if (isElectron()) {
    showMessageBox({
      type: 'error',
      title: '应用错误',
      message: '应用运行时发生错误',
      detail: error.message || error.toString()
    })
  }
}

// 初始化 Electron 适配器
export function initElectronAdapter() {
  if (isElectron()) {
    console.log('Running in Electron environment')
    
    // 设置全局错误处理
    window.addEventListener('error', (event) => {
      handleElectronError(event.error)
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      handleElectronError(event.reason)
    })
  } else {
    console.log('Running in Web environment')
  }
}
