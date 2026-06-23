# 项目结构

```
RQrunning-mobile/
├── assets/
│   ├── app.js                      # 主应用逻辑（触觉反馈、状态管理）
│   └── styles.css                  # 样式表（触摸优化、动画）
├── dist/                           # 构建输出目录（自动生成）
│   ├── assets/
│   │   ├── index-[hash].css       # 压缩后的 CSS
│   │   ├── index-[hash].js        # 压缩后的 JS
│   │   └── ...
│   ├── sw.js                       # Service Worker（Workbox 生成）
│   └── index.html                  # 入口文件
├── node_modules/                   # 依赖包（.gitignore）
├── .gitignore                      # Git 忽略文件
├── apple-touch-icon.svg            # iOS 桌面图标
├── favicon.svg                     # 网站图标
├── index.html                      # 主 HTML 文件
├── manifest.webmanifest            # PWA 清单
├── netlify.toml                    # Netlify 部署配置
├── package.json                    # 项目配置和依赖
├── README.md                       # 项目说明
├── sw.js                           # Service Worker（手动版本）
├── vercel.json                     # Vercel 部署配置
├── vite.config.js                  # Vite 构建配置
├── DEPLOY.md                       # 部署指南
├── OPTIMIZATION.md                 # 优化总结
└── TESTING.md                      # 测试指南
```

## 核心文件说明

### 源代码
- **index.html**: 应用入口，包含 HTML 结构
- **assets/app.js**: 核心逻辑
  - 状态管理
  - 事件处理
  - 触觉反馈
  - 离线检测
  - PWA 安装提示
- **assets/styles.css**: 样式表
  - 响应式布局
  - 触摸交互优化
  - 动画效果
  - 暗色主题

### 配置文件
- **vite.config.js**: Vite 构建配置
  - Terser 压缩
  - PWA 插件配置
  - Service Worker 生成
- **manifest.webmanifest**: PWA 配置
  - 应用名称、图标
  - 主题颜色
  - 显示模式
- **sw.js**: Service Worker（开发时使用）
  - 静态资源缓存
  - 动态内容策略
  - 离线支持

### 部署配置
- **vercel.json**: Vercel 平台配置
- **netlify.toml**: Netlify 平台配置

### 文档
- **README.md**: 项目介绍和快速开始
- **OPTIMIZATION.md**: 优化详情和技术说明
- **TESTING.md**: 测试清单和调试指南
- **DEPLOY.md**: 部署教程和平台对比

## 技术架构

### 前端
- 原生 HTML/CSS/JavaScript（无框架）
- ES6+ 模块化
- Flexbox/Grid 布局
- CSS 自定义属性（主题）

### 构建工具
- Vite 5.0 - 快速构建
- Terser - JS 压缩
- vite-plugin-pwa - PWA 自动化

### PWA 技术
- Service Worker - 离线缓存
- Web App Manifest - 应用清单
- Workbox - 缓存策略

### Web APIs
- Vibration API - 触觉反馈
- Clipboard API - 复制分享
- LocalStorage - 本地存储
- Online/Offline Events - 网络状态

## 数据流

```
用户输入 → 状态更新 → 计算逻辑 → UI 渲染
    ↓           ↓           ↓           ↓
触觉反馈   LocalStorage   心率区间   结果展示
```

### 状态管理
```javascript
const state = {
  maxHR: 190,        // 最大心率
  restHR: 50,        // 静息心率
  pbPace: '03:50',   // 10km PB 配速
  pbSeconds: 230,    // 配速秒数
  selectedZone: 'T'  // 选中的训练区间
};
```

### 核心计算
1. 储备心率 = 最大心率 - 静息心率
2. 目标心率 = 静息心率 + 储备心率 × 区间百分比
3. 目标配速 = PB 配速 + 区间配速偏移

## 缓存策略

### 静态资源（Cache First）
- HTML、CSS、JS
- 图标、Manifest
- 首次请求后永久缓存
- 版本更新时清除旧缓存

### 动态内容（Network First）
- API 请求（未来扩展）
- 优先网络，失败时降级到缓存

## 响应式设计

### 断点
- Mobile: < 680px
- Tablet/Desktop: ≥ 680px

### 移动端优先
- 单列布局
- 44px 最小触摸目标
- 底部固定结果栏
- 安全区域适配

### 桌面增强
- 双列表单
- 三列区间选择
- 四列比赛预测

## 浏览器兼容性

### 最低要求
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- iOS Safari 14+
- Android Chrome 90+

### 渐进增强
- Vibration API: Android 支持，iOS 优雅降级
- color-mix(): 现代浏览器支持，提供 fallback
- Service Worker: 所有现代浏览器支持

## 性能优化

### 构建时优化
- ✅ Tree Shaking（移除未使用代码）
- ✅ 代码分割（按需加载）
- ✅ 压缩混淆（Terser）
- ✅ 资源哈希（缓存破坏）

### 运行时优化
- ✅ Service Worker 缓存
- ✅ 资源预加载
- ✅ 防抖/节流（输入处理）
- ✅ CSS 动画（GPU 加速）

### 网络优化
- ✅ Gzip 压缩
- ✅ 长期缓存策略
- ✅ 离线支持
- ✅ CDN 友好

## 安全考虑

### 输入验证
- 配速范围限制（2:00 - 10:00）
- 心率范围限制（40-210 bpm）
- 防止 XSS（无动态 HTML 注入）

### 数据隐私
- 仅本地存储，无服务器
- 无用户追踪
- 无第三方分析（可选添加）

## 可访问性

### 实现功能
- ✅ 语义化 HTML
- ✅ ARIA 标签
- ✅ 键盘导航支持
- ✅ 高对比度（WCAG AA）

### 待改进
- [ ] 完整的屏幕阅读器测试
- [ ] 更多 ARIA 实时区域
- [ ] 键盘快捷键

## 未来扩展

### 短期（1-2 周）
- [ ] 生成 PNG 图标（多尺寸）
- [ ] 添加骨架屏加载
- [ ] 完善错误边界

### 中期（1-2 月）
- [ ] 训练历史记录
- [ ] 数据导出/导入
- [ ] 推送通知
- [ ] 手势操作

### 长期（3+ 月）
- [ ] 多语言支持
- [ ] 深色/浅色主题切换
- [ ] 社区分享功能
- [ ] 训练计划生成
