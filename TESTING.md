# 测试指南

## 快速测试

开发服务器已启动：**http://localhost:5173**

## 测试清单

### 1. 性能优化测试

#### 构建产物
- [x] 运行 `npm run build` 查看构建输出
- [ ] 检查 `dist/` 目录中的文件大小
- [ ] 确认文件名包含哈希值（缓存破坏）
- [ ] 使用 Chrome DevTools 的 Coverage 工具检查未使用代码

#### Service Worker
- [ ] 打开 Chrome DevTools → Application → Service Workers
- [ ] 确认 Service Worker 已注册
- [ ] 测试离线功能：
  1. 首次加载页面
  2. 断开网络（DevTools → Network → Offline）
  3. 刷新页面，应该正常显示
- [ ] 清除缓存后更新版本号，确认更新横幅出现

#### 资源加载
- [ ] 打开 Network 面板查看资源加载顺序
- [ ] 确认 CSS 和 JS 使用了 preload
- [ ] 检查资源是否从缓存加载（Status: 200 from Service Worker）

---

### 2. 触摸交互测试

#### 触觉反馈（需要真机测试）
在支持震动的 Android 设备上测试：
- [ ] 点击 +/- 按钮 → 轻微震动（10ms）
- [ ] 点击区间选择按钮 → 中等震动（20ms）
- [ ] 点击重置按钮 → 较强震动（30ms）
- [ ] 点击配速快捷按钮 → 轻微震动（10ms）

**注意**：iOS 不支持 Vibration API，功能会优雅降级。

#### 视觉反馈
桌面和移动端都可测试：
- [ ] 点击任意按钮时有缩放效果（scale 0.96-0.97）
- [ ] 按钮 active 状态有背景色和边框变化
- [ ] 过渡动画平滑（0.15-0.2s）
- [ ] 滑块拖动时光标变为 grab/grabbing

#### 防止意外操作
- [ ] 快速点击按钮不会选中文本
- [ ] 双击按钮不会缩放页面
- [ ] 长按按钮不会弹出上下文菜单

---

### 3. 用户体验测试

#### 配速输入优化
- [ ] 手动输入配速：输入 350，自动格式化为 03:50
- [ ] 点击快捷按钮（3:00、3:30、4:00 等）立即应用
- [ ] 输入无效配速时显示红色错误提示
- [ ] 失焦时自动恢复为上次有效值

#### 离线状态
- [ ] 断开网络后顶部显示"离线模式"徽章
- [ ] 重新连接网络后徽章自动消失
- [ ] 离线状态下所有核心功能正常使用

#### 更新通知
1. 修改 `sw.js` 中的 `CACHE_NAME` 版本号
2. 重新构建 `npm run build`
3. 部署新版本
4. 刷新页面
5. [ ] 顶部应该显示"新版本已就绪"横幅
6. [ ] 点击"刷新"按钮加载新版本

---

## 移动端测试

### PWA 安装测试

#### Android Chrome
1. 访问 https://your-domain.com
2. 点击浏览器菜单 → "添加到主屏幕"
3. [ ] 确认图标和名称正确
4. [ ] 从主屏幕启动应用
5. [ ] 确认全屏显示（没有地址栏）
6. [ ] 测试离线功能

#### iOS Safari
1. 访问网站
2. 点击分享按钮 → "添加到主屏幕"
3. [ ] 确认图标显示正确
4. [ ] 从主屏幕启动
5. [ ] 确认状态栏颜色为深色

### 触摸目标大小
- [ ] 所有按钮至少 44x44px（iOS 指南要求）
- [ ] 按钮之间有足够的间距（至少 8px）
- [ ] 拇指区域（屏幕底部）的重要操作易于触达

### 响应式测试
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] 横屏模式

---

## 浏览器兼容性测试

### 桌面
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Edge 90+
- [ ] Safari 14+

### 移动端
- [ ] iOS Safari 14+
- [ ] Android Chrome 90+
- [ ] 微信内置浏览器
- [ ] 华为浏览器
- [ ] 小米浏览器

---

## 性能指标

使用 Chrome DevTools Lighthouse 测试：

### 目标分数
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- PWA: 可安装

### 核心指标
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.8s

---

## 已知问题

### iOS 限制
- ❌ Vibration API 不支持（已做优雅降级）
- ⚠️ Service Worker 在 Safari 中可能有延迟
- ⚠️ PWA 安装体验不如 Android

### 兼容性
- ⚠️ `color-mix()` CSS 函数在旧浏览器不支持（已提供 fallback）

---

## 快速命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 无构建运行
python -m http.server 8000
```

---

## 调试技巧

### Service Worker 调试
- Chrome DevTools → Application → Service Workers → "Update on reload"
- 清除缓存：Application → Storage → Clear site data

### 移动端调试
- Android: Chrome → chrome://inspect
- iOS: Safari → Develop → [设备名]

### 触觉反馈调试
```javascript
// 在控制台测试
navigator.vibrate(10);   // 轻
navigator.vibrate(20);   // 中
navigator.vibrate(30);   // 重
navigator.vibrate([10, 50, 10]);  // 模式
```
