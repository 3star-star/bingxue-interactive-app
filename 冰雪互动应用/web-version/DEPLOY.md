# 部署指南：将冰雪互动应用部署到GitHub Pages

## 快速开始

要部署这个应用到GitHub Pages，请按照以下步骤操作：

### 1. 创建GitHub仓库
1. 在GitHub上创建一个新的公开仓库
2. 克隆仓库到本地：
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

### 2. 复制应用文件
将web-version目录中的所有文件复制到你的仓库中：
```bash
cp -r path/to/冰雪互动应用/web-version/* .
```

### 3. 提交并推送
```bash
git add .
git commit -m "添加冰雪互动应用"
git push origin main
```

### 4. 启用GitHub Pages
1. 进入你的GitHub仓库设置
2. 找到"Pages"部分
3. 选择"gh-pages"分支作为源
4. 保存设置

### 5. 访问应用
部署完成后，你的应用将可以通过以下URL访问：
```
https://your-username.github.io/your-repo/
```

## 自动部署（推荐）

使用GitHub Actions自动部署：

1. 确保你的仓库有`.github/workflows/deploy.yml`文件
2. 推送代码到main分支
3. GitHub Actions将自动构建并部署应用

## 本地测试

要测试部署效果：
```bash
npm run build
npx serve dist
```
然后在浏览器中访问 `http://localhost:3000`。

## 注意事项

- 确保在vite.config.js中设置了正确的base路径
- 构建输出目录是`dist/`
- GitHub Pages需要public文件或dist目录作为源