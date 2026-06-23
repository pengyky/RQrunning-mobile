# 呼吸节奏 Mobile (RQrunning Mobile)

移动端跑步训练强度工具。输入最大心率、静息心率和 PB（个人最佳）配速，一键算出心率区间、RQ 供能倾向、目标配速与今日训练处方。

## 功能

- **心率区间计算** — 基于 Karvonen 公式（储备心率法）计算六个训练区间的目标心率范围
- **RQ 供能倾向** — 从脂肪燃烧到无氧糖酵解，量化各区间能量代谢特征
- **目标配速** — 根据 PB 配速自动偏移，给出每个区间的建议配速
- **训练处方** — 每个区间附带具体执行方案（时长、组数、恢复安排）
- **比赛预测** — 基于当前水平推算 5km、10km、半马、全马完赛时间
- **常用课表** — 400 米间歇、1000 米间歇、节奏跑、长距离慢跑的建议配速
- **参数分享** — 一键复制带当前参数的 URL，发给跑友直接打开
- **离线可用** — Service Worker 缓存，无网络也能使用
- **可安装** — PWA manifest，支持添加到主屏幕（iOS/Android）

## 心率区间说明

| 区间 | 名称 | %储备心率 | RQ | 供能特征 |
|------|------|-----------|-----|---------|
| D | 恢复跑 | 50-60% | 0.70-0.75 | 脂肪燃烧为主 |
| E | 有氧耐力 | 60-75% | 0.75-0.85 | 糖脂混合供能 |
| M | 马拉松配速 | 75-84% | 0.85-0.90 | 糖脂混合供能 |
| T | 乳酸阈值 | 84-88% | 0.90-0.95 | 糖原供能为主 |
| A | 有氧动力 | 88-95% | 0.95-1.00 | 糖原供能为主 |
| I | 无氧能力 | 95-100% | 1.00+ | 无氧糖酵解为主 |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 技术栈

- [Vite](https://vitejs.dev/) — 构建工具
- Vanilla JS — 无框架，轻量单页应用
- Service Worker — 离线缓存与更新通知
- PWA manifest — 可安装到主屏幕

## 部署

项目支持一键部署到以下平台：

[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/start/deploy?repository=)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new)

配置见 `netlify.toml` 和 `vercel.json`。

## 项目结构

```
├── index.html              # 入口页面
├── assets/
│   ├── app.js              # 应用逻辑
│   └── styles.css          # 样式表
├── favicon.png             # 浏览器标签图标 (32×32)
├── apple-touch-icon.png    # iOS 主屏幕图标 (180×180)
├── manifest.webmanifest    # PWA 配置
├── sw.js                   # Service Worker
├── vite.config.js          # Vite 构建配置
├── netlify.toml            # Netlify 部署配置
└── vercel.json             # Vercel 部署配置
```

## 免责声明

本工具仅用于训练参考，不替代医学建议或专业教练指导。
