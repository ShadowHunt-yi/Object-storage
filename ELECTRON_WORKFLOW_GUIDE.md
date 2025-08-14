# Electron + Vue2 + Vite 完整工作流程指南

## 📋 项目概述

本项目是一个基于 **Vue 2** + **Vite** + **Electron** 的桌面应用程序，实现了对象存储管理平台。项目支持 Web 和桌面两种运行模式，通过智能环境检测自动适配不同的运行环境。

### 技术栈
- **前端框架**: Vue 2.7.16
- **构建工具**: Vite 7.1.2
- **桌面框架**: Electron 37.2.6
- **UI 库**: Element UI 2.15.13
- **状态管理**: Vuex 3.6.2
- **路由管理**: Vue Router 3.1.5

## 🏗️ 项目架构

```
智域云图对象存储平台
├── 🌐 Web 模式 (浏览器运行)
│   ├── Vite 开发服务器 (5173)
│   ├── API 代理 (/api -> http://127.0.0.1:8888)
│   └── Vue 2 应用
│
└── 🖥️ Electron 模式 (桌面应用)
    ├── Electron 主进程
    │   ├── 窗口管理
    │   ├── 菜单系统
    │   ├── IPC 通信
    │   └── 内置代理服务器 (5174)
    ├── Electron 渲染进程
    │   ├── Vite 开发服务器内容 (5173)
    │   └── Vue 2 应用
    └── Preload 脚本 (安全桥梁)
```

## 🔄 完整工作流程

### 1. 开发模式启动流程

#### Web 模式 (`npm run dev`)
```bash
1. 启动 Vite 开发服务器 (端口 5173)
   ├── 加载 Vue 2 项目
   ├── 热重载配置
   ├── API 代理配置 (/api -> http://127.0.0.1:8888)
   └── 浏览器自动打开

2. 环境检测
   ├── isElectron() 返回 false
   ├── 使用 Vite 代理处理 API 请求
   └── 标准 Web 应用行为

3. API 请求流程
   前端请求 → /api/menus → Vite 代理 → http://127.0.0.1:8888/menus
```

#### Electron 模式 (`npm run electron:dev`)
```bash
1. 启动 Vite 开发服务器 (端口 5173)
   ├── 使用 electron 模式配置
   ├── 构建 Electron 主进程 (main.js)
   ├── 构建 Preload 脚本 (preload.js)
   └── 热重载监听文件变化

2. 启动 Electron 应用
   ├── 创建主进程
   ├── 启动内置代理服务器 (端口 5174)
   ├── 创建应用窗口
   ├── 加载 Vite 开发服务器内容
   └── 注入 Preload 脚本

3. 环境检测与 API 代理
   ├── isElectron() 返回 true
   ├── API 请求使用代理服务器
   └── 代理服务器转发到后端

4. API 请求流程
   前端请求 → http://localhost:5174/api/menus 
   → Electron 代理服务器 → http://127.0.0.1:8888/menus
```

### 2. 生产构建流程

#### Web 模式构建 (`npm run build`)
```bash
1. Vite 构建
   ├── Vue 2 项目编译
   ├── 代码分割和优化
   ├── 资源压缩和哈希
   └── 输出到 dist/ 目录

2. 部署包结构
   dist/
   ├── index.html
   ├── static/ (CSS, JS, 图片)
   └── stats.html (包分析报告)
```

#### Electron 模式构建 (`npm run electron:build`)
```bash
1. Vite 构建 (Electron 模式)
   ├── 渲染进程构建 (Vue 2 应用)
   ├── 主进程构建 (main.js)
   ├── Preload 脚本构建 (preload.js)
   └── 输出到 dist/ 目录

2. Electron Builder 打包
   ├── 读取 package.json 配置
   ├── 打包应用资源
   ├── 生成安装包
   └── 输出到 release/ 目录

3. 多平台支持
   ├── Windows: .exe 安装包 + 便携版
   ├── macOS: .dmg 镜像文件
   └── Linux: .AppImage + .deb 包
```

## 🔧 关键配置文件详解

### 1. `vite.config.js` - 构建配置核心

```javascript
// 模式检测
const isElectron = mode === 'electron'

// 基础配置
plugins: [
  vue2(),              // Vue 2 支持
  viteImagemin(),      // 图片优化
  visualizer()         // 包分析
]

// Electron 模式特殊配置
if (isElectron) {
  plugins.push(
    electron([...]),   // Electron 主进程构建
    renderer()         // 渲染进程支持
  )
  config.base = './'   // 相对路径
} else {
  config.server = {    // Web 开发服务器
    proxy: { '/api': ... }
  }
}
```

### 2. `electron/main.js` - 主进程控制

```javascript
// 核心功能模块
1. 窗口管理 (createWindow)
2. 菜单系统 (createMenu)  
3. 代理服务器 (ElectronProxyServer)
4. IPC 通信 (ipcMain.handle)
5. 安全策略 (webSecurity, contextIsolation)
6. 生命周期管理 (app events)
```

### 3. `electron/preload.js` - 安全桥梁

```javascript
// 安全 API 暴露
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion,     // 应用信息
  showMessageBox,    // 系统对话框
  platform,          // 系统信息
  isElectron: true   // 环境标识
})
```

### 4. `electron/proxy-server.js` - 内置代理

```javascript
// 代理功能
1. CORS 处理
2. 路径重写 (/api -> /)
3. 错误处理
4. 健康检查
5. 日志记录
```

## 🌊 数据流向分析

### Web 模式数据流
```
Vue 组件 → Axios 请求 → /api/menus → Vite 代理 → 后端 API → 响应数据 → Vue 组件
```

### Electron 模式数据流
```
Vue 组件 → Axios 请求 → http://localhost:5174/api/menus 
→ Electron 代理服务器 → http://127.0.0.1:8888/menus 
→ 后端 API → 响应数据 → 代理服务器 → Vue 组件
```

### 环境检测流程
```javascript
// 多重检测机制
isElectron() {
  return !!(
    window.electronAPI?.isElectron ||           // Preload 注入
    window.process?.versions?.electron ||       // Process 信息
    navigator.userAgent.includes('Electron')    // User Agent
  )
}
```

## 📦 构建优化策略

### 1. 代码分割策略
```javascript
manualChunks: (id) => {
  if (id.includes('vue')) return 'vue-vendor'     // Vue 核心
  if (id.includes('element-ui')) return 'element-ui'  // UI 库
  if (id.includes('echarts')) return 'echarts'   // 图表库
  if (id.includes('@mediapipe')) return 'mediapipe'  // AI 库
  // ... 更多分组策略
}
```

### 2. 资源优化
- **图片压缩**: vite-plugin-imagemin
- **包大小分析**: rollup-plugin-visualizer  
- **字体优化**: 按需加载字体文件
- **代码压缩**: 生产模式自动启用

### 3. Electron 特殊优化
- **主进程最小化**: 只包含必要的 Electron API
- **渲染进程隔离**: 安全的 contextBridge 通信
- **资源路径**: 相对路径确保正确加载

## 🔒 安全策略

### 1. Electron 安全配置
```javascript
webPreferences: {
  nodeIntegration: false,        // 禁用 Node.js 集成
  contextIsolation: true,        // 启用上下文隔离
  enableRemoteModule: false,     // 禁用远程模块
  webSecurity: !isDev,          // 生产模式启用 Web 安全
  preload: 'preload.js'         // 安全的预加载脚本
}
```

### 2. IPC 通信安全
- 使用 `contextBridge` 安全暴露 API
- 验证所有传入参数
- 限制可调用的主进程功能

### 3. 网络安全
- CORS 头正确配置
- 代理服务器输入验证
- HTTPS 支持 (生产环境)

## 🐛 调试指南

### 1. 开发工具
```bash
# 主进程调试
electron --inspect=5858 dist/main.js

# 渲染进程调试
# Electron 应用中按 F12 或 Ctrl+Shift+I

# 代理服务器调试
# 访问 http://localhost:5174/health
```

### 2. 日志系统
- **主进程日志**: 终端控制台
- **渲染进程日志**: 开发者工具 Console
- **代理服务器日志**: 请求响应记录
- **构建日志**: Vite 构建信息

### 3. 常见问题排查
```bash
1. 环境检测失败
   → 检查 preload 脚本是否正确加载
   → 验证 contextBridge 配置

2. API 请求失败  
   → 确认后端服务运行状态
   → 检查代理服务器日志
   → 验证 CORS 配置

3. 构建失败
   → 清理 node_modules 重新安装
   → 检查 Vite 配置语法
   → 验证 Electron 版本兼容性
```

## 🚀 部署指南

### 1. Web 模式部署
```bash
# 构建
npm run build

# 部署到 Web 服务器
# 需要配置后端 API 的 CORS 策略
```

### 2. Electron 模式部署
```bash
# 构建并打包
npm run electron:build

# 输出文件
release/
├── 智域云图-对象存储平台-0.1.0.exe        # Windows 安装包
├── 智域云图-对象存储平台-0.1.0-portable.exe # 便携版
└── 智域云图-对象存储平台-0.1.0.dmg        # macOS 版本
```

### 3. 自动更新 (可选扩展)
- 集成 `electron-updater`
- 配置更新服务器
- 实现增量更新

## 📈 性能监控

### 1. 构建性能
- **Bundle 大小**: 使用 visualizer 分析
- **加载时间**: Chrome DevTools 网络面板
- **内存使用**: Electron 任务管理器

### 2. 运行时性能
- **启动时间**: 应用启动到可用的时间
- **内存占用**: 主进程 + 渲染进程内存
- **CPU 使用**: 长时间运行的 CPU 占用

### 3. 用户体验指标
- **首屏加载**: Time to First Paint
- **交互响应**: 用户操作响应时间
- **稳定性**: 崩溃率和错误率

---

通过这个完整的工作流程，开发者可以清楚地理解项目的运行机制，有效地进行开发、调试和部署。
