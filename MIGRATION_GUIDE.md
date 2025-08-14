# Vue2 + CLI 到 Vite + Electron 迁移指南

## 📋 迁移概述

本文档详细记录了如何将一个基于 **Vue CLI** 的 Vue 2 项目迁移到 **Vite** + **Electron** 架构。这个迁移过程不仅实现了构建工具的升级，还增加了桌面应用支持。

### 迁移目标
- ✅ 从 Vue CLI (Webpack) 迁移到 Vite
- ✅ 保持 Vue 2 兼容性  
- ✅ 添加 Electron 桌面应用支持
- ✅ 实现 Web/Desktop 双模式
- ✅ 优化构建性能和开发体验

## 🔄 迁移步骤详解

### 阶段 1: 项目结构分析

#### 原始项目结构 (Vue CLI)
```
project/
├── public/
├── src/
├── vue.config.js          # Vue CLI 配置
├── babel.config.js        # Babel 配置
├── package.json
└── node_modules/
```

#### 目标项目结构 (Vite + Electron)
```
project/
├── public/
├── src/
├── electron/              # 新增 Electron 目录
│   ├── main.js           # 主进程
│   ├── preload.js        # 预加载脚本
│   └── proxy-server.js   # 代理服务器
├── vite.config.js         # 新增 Vite 配置
├── babel.config.cjs       # 修改 Babel 配置
├── package.json           # 更新依赖和脚本
└── node_modules/
```

### 阶段 2: 依赖迁移

#### 1. 删除 Vue CLI 相关依赖
```json
// 需要删除的依赖
{
  "devDependencies": {
    "@vue/cli-plugin-babel": "删除",
    "@vue/cli-plugin-router": "删除", 
    "@vue/cli-plugin-vuex": "删除",
    "@vue/cli-service": "删除",
    "webpack": "删除",
    "webpack-dev-server": "删除"
  }
}
```

#### 2. 添加 Vite 相关依赖
```json
{
  "devDependencies": {
    "vite": "^7.1.2",
    "@vitejs/plugin-vue2": "^2.3.3",
    "rollup-plugin-visualizer": "^6.0.3",
    "vite-plugin-imagemin": "^0.6.1"
  }
}
```

#### 3. 添加 Electron 依赖
```json
{
  "devDependencies": {
    "electron": "^37.2.6",
    "electron-builder": "^26.0.12", 
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6"
  }
}
```

### 阶段 3: 配置文件迁移

#### 1. Vue CLI 配置迁移

**原始 `vue.config.js`:**
```javascript
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    // webpack 配置
  }
})
```

**新的 `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import electron from 'vite-plugin-electron'

export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron'
  
  const config = {
    plugins: [vue2()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
  
  if (isElectron) {
    config.plugins.push(electron([...]))
    config.base = './'
  }
  
  return config
})
```

#### 2. Babel 配置更新

**原始 `babel.config.js`:**
```javascript
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

**新的 `babel.config.cjs`:**
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' }
    }]
  ],
  plugins: [
    ['import', {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk'
    }]
  ]
}
```

### 阶段 4: 入口文件调整

#### 1. HTML 模板更新

**Vue CLI 的 `public/index.html`:**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Vue CLI 自动注入的内容 -->
</head>
<body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
</body>
</html>
```

**Vite 的 `index.html` (移动到根目录):**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>智域云图-对象存储平台</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

#### 2. 主入口文件调整

**原始 `src/main.js`:**
```javascript
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

**新的 `src/main.js`:**
```javascript
import Vue from 'vue'
import App from './App.vue'
import { initElectronAdapter } from './utils/electron-adapter.js'

// 初始化 Electron 适配器
initElectronAdapter()

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

### 阶段 5: 路径和导入调整

#### 1. 绝对路径配置

**Vue CLI (webpack alias):**
```javascript
// vue.config.js
configureWebpack: {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
```

**Vite alias:**
```javascript
// vite.config.js
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

#### 2. 静态资源处理

**Vue CLI:**
```javascript
// 资源自动处理
import logo from '@/assets/logo.png'
```

**Vite:**
```javascript
// 大部分情况下兼容，特殊情况需要调整
import logo from '@/assets/logo.png'

// 动态导入需要调整
const imageSrc = new URL('@/assets/image.png', import.meta.url).href
```

### 阶段 6: 环境变量迁移

#### 1. 环境变量文件

**Vue CLI (.env):**
```bash
VUE_APP_API_BASE_URL=http://localhost:3000
VUE_APP_TITLE=My App
```

**Vite (.env):**
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=My App
```

#### 2. 代码中的使用

**Vue CLI:**
```javascript
const apiUrl = process.env.VUE_APP_API_BASE_URL
```

**Vite:**
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### 阶段 7: Electron 集成

#### 1. 创建 Electron 主进程
```javascript
// electron/main.js
import { app, BrowserWindow } from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile('dist/index.html')
  }
}

app.whenReady().then(createWindow)
```

#### 2. 创建预加载脚本
```javascript
// electron/preload.js
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform
})
```

#### 3. 环境检测适配器
```javascript
// src/utils/electron-adapter.js
export function isElectron() {
  return !!(
    window.electronAPI?.isElectron ||
    window.process?.versions?.electron
  )
}
```

## 🚧 迁移中的常见问题与解决方案

### 1. 构建工具差异

#### 问题: Webpack 插件不兼容
```javascript
// Vue CLI 中的 webpack 插件
configureWebpack: {
  plugins: [
    new SomeWebpackPlugin()
  ]
}
```

**解决方案:**
```javascript
// 寻找对应的 Vite 插件
import someVitePlugin from 'vite-plugin-something'

export default defineConfig({
  plugins: [vue2(), someVitePlugin()]
})
```

#### 问题: 模块解析差异
```javascript
// Webpack 支持的写法
import { something } from 'library/dist/something'
```

**解决方案:**
```javascript
// Vite 需要完整路径
import { something } from 'library/dist/something.js'
```

### 2. 开发服务器差异

#### 问题: 代理配置格式不同
```javascript
// Vue CLI devServer
devServer: {
  proxy: 'http://localhost:3000'
}
```

**解决方案:**
```javascript
// Vite 需要完整配置
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### 3. CSS 处理差异

#### 问题: CSS 预处理器配置
```javascript
// Vue CLI
css: {
  loaderOptions: {
    sass: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
}
```

**解决方案:**
```javascript
// Vite
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/variables.scss";`
    }
  }
}
```

### 4. Electron 特有问题

#### 问题: 跨域请求失败
**症状:** API 请求在 Electron 中返回 CORS 错误
**原因:** Electron 的安全策略比浏览器更严格

**解决方案:**
1. 创建内置代理服务器
2. 配置 `webSecurity: false` (仅开发模式)
3. 正确设置 CORS 头

#### 问题: 文件路径错误
**症状:** 生产模式下资源文件 404
**原因:** Electron 使用 `file://` 协议

**解决方案:**
```javascript
// vite.config.js
if (isElectron) {
  config.base = './' // 使用相对路径
}
```

#### 问题: Node.js API 访问被拒绝
**症状:** 渲染进程无法访问文件系统
**原因:** 安全策略禁用了 Node.js 集成

**解决方案:**
```javascript
// 通过 preload 脚本安全暴露 API
contextBridge.exposeInMainWorld('fileAPI', {
  readFile: (path) => ipcRenderer.invoke('read-file', path)
})
```

## 🎯 迁移最佳实践

### 1. 分阶段迁移策略

#### 阶段 1: 构建工具迁移
- 只迁移 Vue CLI → Vite
- 保持原有功能不变
- 验证构建和开发流程

#### 阶段 2: Electron 集成
- 添加 Electron 支持
- 实现双模式运行
- 配置环境检测

#### 阶段 3: 功能优化
- 优化构建配置
- 实现平台特定功能
- 性能调优

### 2. 测试策略

#### 构建测试
```bash
# 测试 Web 模式
npm run dev
npm run build

# 测试 Electron 模式  
npm run electron:dev
npm run electron:build
```

#### 功能测试
- 所有现有功能正常工作
- API 请求正确处理
- 资源文件正确加载
- 路由跳转正常

#### 兼容性测试
- 不同操作系统
- 不同屏幕分辨率
- 网络异常情况

### 3. 性能优化

#### 构建性能
```javascript
// 代码分割优化
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'vuex'],
        'ui-vendor': ['element-ui'],
        'utils': ['axios', 'dayjs']
      }
    }
  }
}
```

#### 运行时性能
```javascript
// Electron 窗口优化
new BrowserWindow({
  show: false, // 预先隐藏
  webPreferences: {
    webSecurity: false, // 仅开发模式
    backgroundThrottling: false // 防止后台节流
  }
})
```

## ⚠️ 重要注意事项

### 1. 依赖兼容性
- 某些 webpack 特定的包可能需要替换
- 检查所有依赖的 Vite 兼容性
- 更新到支持 ES modules 的版本

### 2. 安全考虑
- Electron 安全策略比浏览器更严格
- 避免在渲染进程中直接使用 Node.js API
- 使用 contextBridge 安全暴露功能

### 3. 调试方法
- 主进程调试：Node.js 调试器
- 渲染进程调试：Chrome DevTools
- IPC 通信调试：electron-log

### 4. 部署注意
- 确保生产环境路径正确
- 配置自动更新机制
- 处理不同平台的差异

## 📊 迁移效果对比

### 构建性能对比
| 指标 | Vue CLI | Vite |
|------|---------|------|
| 冷启动 | 30-45s | 5-10s |
| 热更新 | 2-5s | <1s |
| 生产构建 | 60-90s | 30-45s |

### 开发体验提升
- ✅ 更快的启动速度
- ✅ 即时热更新
- ✅ 更好的错误提示
- ✅ 现代化的构建流程

### 新增能力
- ✅ 桌面应用支持
- ✅ 跨平台部署
- ✅ 原生系统集成
- ✅ 离线使用能力

---

通过这个详细的迁移指南，开发者可以顺利地将 Vue CLI 项目迁移到现代化的 Vite + Electron 架构，同时避免常见的陷阱和问题。
