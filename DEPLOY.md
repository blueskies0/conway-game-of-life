# 康威生命游戏 - GitHub 部署指南

## 快速部署到 GitHub Pages

### 方法1：使用 GitHub Actions（推荐）

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建新仓库，例如 `conway-game-of-life`

2. **上传代码**
   ```bash
   # 下载 game-of-life.zip 并解压
   cd conway-game-of-life
   
   # 初始化 Git
   git init
   git add .
   git commit -m "Initial commit: Conway's Game of Life"
   
   # 关联远程仓库
   git remote add origin https://github.com/你的用户名/conway-game-of-life.git
   git push -u origin main
   ```

3. **配置 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 添加 `.github/workflows/deploy.yml` 文件（见下方）

4. **创建 GitHub Actions 工作流**

创建文件 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. **推送工作流文件**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push
   ```

6. **等待部署完成**
   - 访问 Actions 标签页查看部署进度
   - 部署完成后，访问 `https://你的用户名.github.io/conway-game-of-life/`

### 方法2：手动部署 dist 文件夹

1. **构建项目**
   ```bash
   pnpm install
   pnpm run build
   ```

2. **创建 gh-pages 分支**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r dist/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **启用 GitHub Pages**
   - Settings → Pages → Source 选择 "gh-pages" 分支

## 本地开发

```bash
pnpm install
pnpm run dev
```

访问 http://localhost:3015

## 功能特性

- ✅ 上百种预设模板（滑翔机、脉冲星、Gosper滑翔机枪等）
- ✅ 模板搜索和分类浏览
- ✅ Canvas 高性能渲染
- ✅ 深色主题 + 发光效果
- ✅ 点击编辑细胞状态
- ✅ 速度调节滑块
- ✅ 播放/暂停/单步/随机/清空控制

## 技术栈

- React 19 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- Canvas API
