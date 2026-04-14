#!/bin/bash

# 部署到GitHub Pages的脚本
echo "开始部署冰雪互动应用到GitHub Pages..."

# 1. 构建应用（如果还没有构建）
npm run build

# 2. 进入dist目录
cd dist

# 3. 初始化git仓库（如果还没有）
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit of冰雪互动应用"
fi

# 4. 添加远程仓库（需要替换为你的GitHub仓库URL）
echo "请输入你的GitHub仓库URL（例如：https://github.com/your-username/your-repo.git）："
read repo_url
git remote add origin $repo_url

# 5. 推送到gh-pages分支
git push -f origin main:gh-pages

echo "部署完成！你的应用现在可以通过以下链接访问："
echo "https://your-username.github.io/your-repo/"