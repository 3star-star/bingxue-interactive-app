// 统一处理图片路径，适配 GitHub Pages 部署
export function getImagePath(path) {
  // 如果是外部链接，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 开发环境
  if (import.meta.env.DEV) {
    return path
  }

  // 生产环境，添加 base 路径
  const base = import.meta.env.BASE_URL || '/'

  // 如果路径已经包含 base，直接返回
  if (path.startsWith(base)) {
    return path
  }

  // 移除开头的 /，然后添加 base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${base}${cleanPath}`
}
