# 部署指南

## 自动化部署平台

### 1. Vercel 部署 ⭐ 推荐

#### 快速部署
```bash
npm install -g vercel
vercel login
vercel
```

#### 或使用 Vercel Dashboard
1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. 自动部署完成

#### 配置
- 已提供 `vercel.json` 配置文件
- 自动设置缓存策略
- Service Worker 正确配置
- SPA 路由支持

---

### 2. Netlify 部署

#### 快速部署
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### 或使用拖拽部署
1. 运行 `npm run build`
2. 访问 https://app.netlify.com/drop
3. 拖拽 `dist/` 目录到页面
4. 获得临时域名

#### 配置
- 已提供 `netlify.toml` 配置文件
- 自动设置 Headers
- SPA 重定向规则
- 构建命令已配置

---

### 3. Cloudflare Pages

#### 部署步骤
1. 访问 https://pages.cloudflare.com
2. 连接 GitHub 仓库
3. 设置构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 环境变量：无需设置
4. 点击"保存并部署"

#### Headers 配置
在 Cloudflare Dashboard 添加：
```
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
  Service-Worker-Allowed: /

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

### 4. GitHub Pages

#### 自动部署（推荐）
创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 手动部署
```bash
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git main:gh-pages
cd ..
```

---

## 自托管部署

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/rqrunning-mobile;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Service Worker 缓存策略
    location /sw.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }

    # 静态资源长期缓存
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SVG 图标
    location ~* \.svg$ {
        add_header Cache-Control "public, max-age=86400";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache 配置

创建 `.htaccess`：
```apache
# 启用 Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Service Worker
<FilesMatch "sw\.js$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
    Header set Service-Worker-Allowed "/"
</FilesMatch>

# 静态资源缓存
<FilesMatch "\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.svg$">
    Header set Cache-Control "public, max-age=86400"
</FilesMatch>

# SPA 路由
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## Docker 部署

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建和运行
```bash
docker build -t rqrunning-mobile .
docker run -d -p 8080:80 rqrunning-mobile
```

---

## 部署前检查清单

### 构建检查
- [ ] 运行 `npm run build` 无错误
- [ ] 检查 `dist/` 目录生成正确
- [ ] 本地预览 `npm run preview` 正常

### 配置检查
- [ ] 确认 `base` URL 正确（根目录或子目录）
- [ ] manifest.json 中的 `start_url` 正确
- [ ] 图标文件都已准备好

### 功能测试
- [ ] PWA 可安装
- [ ] Service Worker 正常工作
- [ ] 离线模式可用
- [ ] 所有交互正常

---

## 自定义域名配置

### DNS 设置

#### Vercel
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

#### Netlify
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

#### Cloudflare Pages
```
Type: CNAME
Name: www
Value: your-site.pages.dev
```

### HTTPS
所有推荐的平台都自动提供免费 SSL 证书（Let's Encrypt）。

---

## 性能监控

### Vercel Analytics
```bash
npm install @vercel/analytics
```

在 `index.html` 添加：
```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

### Google Analytics
在 `index.html` 添加：
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 故障排查

### Service Worker 不更新
1. Chrome DevTools → Application → Service Workers
2. 勾选 "Update on reload"
3. 点击 "Unregister" 然后刷新

### PWA 无法安装
1. 确认使用 HTTPS 或 localhost
2. 检查 manifest.json 是否正确加载
3. 确认至少有一个有效的图标
4. Service Worker 必须成功注册

### 缓存问题
1. 清除站点数据：DevTools → Application → Clear storage
2. 更新 Service Worker 版本号
3. 重新部署

---

## 推荐部署平台对比

| 平台 | 免费额度 | 自定义域名 | 自动 HTTPS | 构建时间 | 推荐度 |
|------|---------|-----------|-----------|---------|--------|
| **Vercel** | 100GB/月 | ✅ | ✅ | 快 | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB/月 | ✅ | ✅ | 快 | ⭐⭐⭐⭐⭐ |
| **Cloudflare Pages** | 无限 | ✅ | ✅ | 快 | ⭐⭐⭐⭐ |
| **GitHub Pages** | 100GB/月 | ✅ | ✅ | 中等 | ⭐⭐⭐ |

**推荐**：Vercel 或 Netlify，配置最简单，性能最好。
