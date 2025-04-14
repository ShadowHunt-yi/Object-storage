# 对象存储系统前端

这是一个基于Vue 2开发的对象存储系统前端项目，提供文件上传、管理、分享等功能。

## 技术栈

- Vue 2.6.11
- Vue Router 3.1.5
- Element UI 2.15.13
- Axios - 网络请求
- ECharts - 数据可视化
- Vue-cropper - 图片裁剪
- Spark-MD5 - 文件校验

## 系统要求

- Node.js 14.0.0 或更高版本
- NPM 6.0.0 或更高版本

## 安装和运行

1. 克隆项目
```bash
git clone <仓库地址>
cd Object-storage
```

2. 安装依赖
```bash
pnpm install
```

3. 本地开发运行
```bash
pnpm run serve
```
应用将在 http://localhost:5000 启动

4. 构建生产版本
```bash
pnpm run build
```

## 项目结构

```
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── api/             # API请求
│   ├── assets/          # 图片等资源
│   ├── components/      # 组件
│   ├── router/          # 路由配置
│   ├── utils/           # 工具函数
│   ├── views/           # 页面
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── vue.config.js        # Vue配置
└── package.json         # 依赖管理
```

## 功能说明

- **文件管理**：上传、下载、删除、重命名文件
- **文件分享**：生成分享链接，设置访问权限和过期时间
- **空间管理**：查看存储空间使用情况，管理配额
- **用户设置**：个人信息管理、安全设置

## API配置

后端API默认配置为`http://172.21.3.107:8888`，可以在`vue.config.js`中修改代理配置。

## 开发注意事项

- 文件上传使用分片上传技术，支持大文件和断点续传
- 使用Spark-MD5进行文件完整性校验
