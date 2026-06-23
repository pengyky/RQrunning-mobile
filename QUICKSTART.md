# 快速开始

## 5 分钟上手

### 1. 克隆或下载项目
```bash
git clone https://github.com/your-username/RQrunning-mobile.git
cd RQrunning-mobile
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

打开浏览器访问：**http://localhost:5173**

---

## 开发流程

### 日常开发
```bash
# 启动开发服务器（带热更新）
npm run dev

# 在浏览器中测试
# - 修改代码自动刷新
# - 打开 DevTools 查看控制台
```

### 构建测试
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 访问 http://localhost:4173
```

---

## 主要命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装项目依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |

---

## 文件修改指南

### 修改样式
编辑 `assets/styles.css`：
```css
:root {
  --bg: #07130d;        /* 背景色 */
  --green: #45ff95;     /* 主色调 */
  /* ... 其他颜色变量 */
}
```

### 修改逻辑
编辑 `assets/app.js`：
```javascript
const zones = [
  { code: 'D', name: '恢复跑', /* ... */ },
  // 修改训练区间配置
];
```

### 修改 HTML 结构
编辑 `index.html`：
```html
<section class="card">
  <!-- 添加新的内容区块 -->
</section>
```

---

## 移动端测试

### 方法 1: 浏览器模拟（快速）
1. 打开 Chrome DevTools (F12)
2. 点击设备工具栏按钮 (Ctrl+Shift+M)
3. 选择设备：iPhone 12 Pro / Pixel 5
4. 测试触摸交互

### 方法 2: 真机测试（推荐）

#### Android
```bash
# 1. 确保手机和电脑在同一 WiFi
npm run dev -- --host

# 2. 访问显示的 Network 地址
# 例如：http://192.168.1.100:5173

# 3. Chrome 远程调试
# 电脑打开 chrome://inspect
# 手机开启 USB 调试并连接
```

#### iOS
```bash
# 1. 启动开发服务器
npm run dev -- --host

# 2. 在 iPhone Safari 访问 Network 地址
# 例如：http://192.168.1.100:5173

# 3. Mac Safari 远程调试
# Safari → 开发 → [你的 iPhone]
```

---

## PWA 测试

### 本地测试 PWA 功能

1. **构建生产版本**
```bash
npm run build
```

2. **使用 HTTPS 或 localhost 预览**
```bash
npm run preview
# 或
npx serve dist
```

3. **测试 PWA 功能**
- 打开 Chrome DevTools → Application
- 检查 Service Worker 状态
- 测试离线模式
- 尝试"添加到主屏幕"

---

## 常见问题

### Q: Service Worker 没有更新？
**A:** 勾选 DevTools → Application → Service Workers → "Update on reload"

### Q: 触觉反馈不工作？
**A:** 
- 桌面浏览器不支持（正常）
- iOS 不支持 Vibration API（已做优雅降级）
- Android Chrome 需要真机测试

### Q: 样式修改不生效？
**A:** 
- 清除浏览器缓存 (Ctrl+Shift+R)
- 清除 Service Worker 缓存
- 重启开发服务器

### Q: 构建后文件很大？
**A:** 已优化，正常大小：
- CSS: ~2.3 kB (gzip)
- JS: ~4-5 kB (gzip)
- 总体 < 40 kB

---

## 推荐工具

### 开发工具
- [VS Code](https://code.visualstudio.com/) - 代码编辑器
- Chrome DevTools - 调试工具
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - 性能测试

### VS Code 插件
- Live Server - 实时预览
- Prettier - 代码格式化
- ESLint - 代码检查

### Chrome 插件
- [Web Vitals](https://chrome.google.com/webstore/detail/web-vitals/) - 性能指标
- [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/) - 审计工具

---

## 学习资源

### 项目文档
- [README.md](./README.md) - 项目介绍
- [OPTIMIZATION.md](./OPTIMIZATION.md) - 优化详情
- [TESTING.md](./TESTING.md) - 测试指南
- [DEPLOY.md](./DEPLOY.md) - 部署教程
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 项目结构

### 相关技术
- [PWA 基础](https://web.dev/progressive-web-apps/)
- [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Vite 文档](https://vitejs.dev/)
- [Workbox](https://developers.google.com/web/tools/workbox)

---

## 下一步

### 开发新功能
1. 阅读 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解架构
2. 在 `assets/app.js` 中添加逻辑
3. 在 `assets/styles.css` 中添加样式
4. 测试功能
5. 构建和部署

### 部署上线
1. 阅读 [DEPLOY.md](./DEPLOY.md) 选择平台
2. 推荐使用 Vercel 或 Netlify
3. 一键部署，自动 HTTPS
4. 获得生产环境 URL

### 优化性能
1. 运行 Lighthouse 测试
2. 查看 [OPTIMIZATION.md](./OPTIMIZATION.md) 了解已实现的优化
3. 根据测试结果继续优化

---

## 获取帮助

### 项目问题
- 查看已有文档
- 检查浏览器控制台错误
- 清除缓存重试

### 技术支持
- [GitHub Issues](https://github.com/your-username/RQrunning-mobile/issues)
- [PWA 社区](https://web.dev/community/)

---

## 贡献指南

欢迎贡献代码！步骤：

1. Fork 项目
2. 创建分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

**祝开发愉快！** 🚀

如有问题，请参考项目文档或提交 Issue。
