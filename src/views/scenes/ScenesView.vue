<template>
  <div class="scenes-view">
    <!-- 返回首页按钮 -->
    <BackButton to="/" text="返回首页" icon="home" />

    <!-- 页面头部 -->
    <div class="scenes-header">
      <h1>冰雪美景体验</h1>
      <p>360°全景漫游，足不出户赏尽天下雪景</p>
    </div>

    <!-- 场景列表 -->
    <div class="scenes-grid">
      <div v-for="scene in scenesData"
           :key="scene.id"
           class="scene-card"
           @click="goToSceneDetail(scene)">

        <div class="scene-image">
          <img :src="getSceneImage(scene.id)" :alt="scene.name">
          <div class="scene-overlay">
            <div class="scene-info">
              <h3>{{ scene.name }}</h3>
              <p>{{ scene.location }}</p>
            </div>
          </div>
        </div>

        <div class="scene-details">
          <p>{{ scene.description }}</p>
          <div class="scene-stats">
            <span>📍 {{ scene.hotspots.length }}个景点</span>
            <span>🎵 {{ getSoundName(scene.ambientSound) }}</span>
          </div>
        </div>

        <!-- 已访问标记 -->
        <div v-if="isSceneVisited(scene.id)" class="visited-badge">
          <van-icon name="passed" />
          <span>已访问</span>
        </div>
      </div>
    </div>

    <!-- 全景查看器 -->
    <van-popup
      v-model:show="showViewer"
      position="bottom"
      :style="{ height: '90%' }"
      round
      closeable>

      <div class="panorama-viewer">
        <!-- 顶部控制栏 -->
        <div class="viewer-header">
          <div class="scene-title">
            <h2>{{ currentScene?.name }}</h2>
            <p>{{ currentScene?.location }}</p>
          </div>
          <div class="viewer-controls">
            <van-button
              :icon="soundEnabled ? 'volume' : 'volume-o'"
              size="small"
              @click="toggleSound"
              type="primary"
              plain>
              {{ soundEnabled ? '关闭音效' : '开启音效' }}
            </van-button>
            <van-button
              :icon="vrMode ? 'cross' : 'scan'"
              size="small"
              @click="toggleVRMode"
              type="primary"
              plain>
              {{ vrMode ? '退出VR' : 'VR模式' }}
            </van-button>
          </div>
        </div>

        <!-- 全景容器 -->
        <div class="panorama-container" ref="panoramaContainer">
          <div class="loading" v-if="loading">
            <van-loading type="spinner" />
            <p>正在加载全景...</p>
          </div>

          <!-- 全景画布 -->
          <canvas ref="panoramaCanvas" id="panorama-canvas"></canvas>

          <!-- 热点标记 -->
          <div v-for="hotspot in currentScene?.hotspots"
               :key="hotspot.id"
               class="hotspot"
               :style="getHotspotStyle(hotspot.position)"
               @click="showHotspotInfo(hotspot)">

            <div class="hotspot-icon">📍</div>
          </div>

          <!-- 导航控制 -->
          <div class="navigation-controls">
            <div class="nav-left">
              <button @click="rotateLeft" class="nav-btn">
                <van-icon name="arrow-left" size="20" />
              </button>
            </div>
            <div class="nav-center">
              <button @click="resetView" class="nav-btn">
                <van-icon name="refresh" size="20" />
              </button>
            </div>
            <div class="nav-right">
              <button @click="rotateRight" class="nav-btn">
                <van-icon name="arrow-right" size="20" />
              </button>
            </div>
          </div>

          <!-- 拍照功能 -->
          <div class="photo-controls">
            <button @click="takePhoto" class="photo-btn">
              <van-icon name="photograph" size="24" />
            </button>
          </div>

          <!-- 提示信息 -->
          <div class="touch-hint">
            <p>🖱️ 拖动鼠标旋转视角</p>
            <p>📱 触摸屏幕滑动查看</p>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 热点信息弹窗 -->
    <van-popup
      v-model:show="showHotspotPopup"
      position="bottom"
      :style="{ height: 'auto' }"
      round
      closeable>

      <div class="hotspot-info">
        <h3>{{ currentHotspot?.title }}</h3>
        <p>{{ currentHotspot?.description }}</p>
        <div class="hotspot-actions">
          <van-button type="primary" @click="checkInAtHotspot">在此打卡</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { scenesData, ambientSounds } from '@/data/scenesData'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const showViewer = ref(false)
const loading = ref(false)
const currentScene = ref(null)
const currentHotspot = ref(null)
const showHotspotPopup = ref(false)
const soundEnabled = ref(true)
const vrMode = ref(false)
const panoramaContainer = ref(null)
const panoramaCanvas = ref(null)

// 全景相关
let panorama = null
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let rotation = 0

// 检查是否已访问场景
const isSceneVisited = (sceneId) => {
  return userStore.scenesVisited.includes(sceneId)
}

// 获取场景图片
const getSceneImage = (sceneId) => {
  const scene = scenesData.find(s => s.id === sceneId)
  return scene?.image || 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80'
}

// 获取音效名称
const getSoundName = (soundType) => {
  return ambientSounds[soundType]?.name || '无'
}

// 跳转到场景详情
const goToSceneDetail = (scene) => {
  router.push({
    name: 'SceneDetail',
    query: { sceneId: scene.id }
  })
}

// 进入全景体验
const enterPanorama = (scene) => {
  currentScene.value = scene
  showViewer.value = true
  loading.value = true

  // 记录访问
  userStore.visitScene(scene.id)

  // 快速加载
  setTimeout(() => {
    initPanorama()
    loading.value = false
  }, 100)
}

// 初始化全景
const initPanorama = () => {
  const canvas = panoramaCanvas.value
  const container = panoramaContainer.value

  // 设置画布大小
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  // 创建简单的2D全景模拟
  const ctx = canvas.getContext('2d')

  // 绘制背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#E0F2FE')
  gradient.addColorStop(1, '#DBEAFE')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制雪地
  ctx.fillStyle = '#FFFFFF'
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width
    const y = canvas.height * 0.7 + Math.random() * canvas.height * 0.3
    const size = Math.random() * 20 + 10
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // 绘制山脉轮廓
  ctx.strokeStyle = '#9CA3AF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, canvas.height * 0.5)

  for (let x = 0; x <= canvas.width; x += 50) {
    const y = canvas.height * 0.5 - Math.sin(x * 0.01 + rotation) * 100
    ctx.lineTo(x, y)
  }

  ctx.stroke()
}

// 获取热点位置
const getHotspotStyle = (position) => {
  const canvas = panoramaCanvas.value
  const x = (position.x / 100) * canvas.width
  const y = (position.y / 100) * canvas.height
  return {
    left: x - 20 + 'px',
    top: y - 20 + 'px'
  }
}

// 显示热点信息
const showHotspotInfo = (hotspot) => {
  currentHotspot.value = hotspot
  showHotspotPopup.value = true
}

// 在热点打卡
const checkInAtHotspot = () => {
  showToast('打卡成功！')
  showHotspotPopup.value = false
  userStore.addPoints(5)
}

// 切换音效
const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  showToast(soundEnabled.value ? '音效已开启' : '音效已关闭')
}

// 切换VR模式
const toggleVRMode = () => {
  vrMode.value = !vrMode.value
  showToast(vrMode.value ? 'VR模式已开启' : '已退出VR模式')
}

// 旋转视角
const rotateLeft = () => {
  rotation -= 0.1
  updatePanorama()
}

const rotateRight = () => {
  rotation += 0.1
  updatePanorama()
}

// 重置视角
const resetView = () => {
  rotation = 0
  updatePanorama()
}

// 更新全景
const updatePanorama = () => {
  if (!panoramaCanvas.value) return
  initPanorama()
}

// 拍照功能
const takePhoto = () => {
  showToast('拍照成功！照片已保存到相册')
  userStore.addPoints(10)
}

// 鼠标事件处理
const handleMouseDown = (event) => {
  isDragging = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const handleMouseMove = (event) => {
  if (!isDragging) return

  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y
  }

  rotation += deltaMove.x * 0.005
  updatePanorama()

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const handleMouseUp = () => {
  isDragging = false
}

// 触摸事件处理
const handleTouchStart = (event) => {
  isDragging = true
  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

const handleTouchMove = (event) => {
  if (!isDragging) return
  event.preventDefault()

  const deltaMove = {
    x: event.touches[0].clientX - previousMousePosition.x,
    y: event.touches[0].clientY - previousMousePosition.y
  }

  rotation += deltaMove.x * 0.005
  updatePanorama()

  previousMousePosition = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }
}

const handleTouchEnd = () => {
  isDragging = false
}

// 生命周期
onMounted(() => {
  // 初始化用户数据
  userStore.initializeUser()

  // 添加事件监听
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.scenes-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
}

.scenes-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: 1.1rem;
    color: $text-secondary;
  }
}

.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-lg;
  padding: 0 $spacing-xl;
}

.scene-card {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-normal;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-xl;
  }

  .scene-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .scene-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: $spacing-md;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    }

    .scene-info {
      color: white;

      h3 {
        font-size: 1.25rem;
        margin-bottom: $spacing-xs;
      }

      p {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }

  .scene-details {
    padding: $spacing-md;

    p {
      font-size: 0.95rem;
      color: $text-secondary;
      line-height: 1.5;
      margin-bottom: $spacing-sm;
    }

    .scene-stats {
      display: flex;
      gap: $spacing-md;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .visited-badge {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    background: #10B981;
    color: white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-md;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    .van-icon {
      font-size: 0.9rem;
    }
  }
}

.panorama-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewer-header {
  padding: $spacing-md;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .scene-title h2 {
    font-size: 1.5rem;
    margin-bottom: $spacing-xs;
  }

  .scene-title p {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .viewer-controls {
    display: flex;
    gap: $spacing-sm;
  }
}

.panorama-container {
  flex: 1;
  position: relative;
  background: #E0F2FE;

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #666;
  }

  #panorama-canvas {
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  #panorama-canvas:active {
    cursor: grabbing;
  }

  .hotspot {
    position: absolute;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(59, 130, 246, 0.8);
    border-radius: 50%;
    cursor: pointer;
    transition: all $transition-normal;
    border: 2px solid white;

    &:hover {
      transform: scale(1.2);
      background: rgba(59, 130, 246, 1);
    }

    .hotspot-icon {
      font-size: 1.2rem;
    }
  }

  .navigation-controls {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: $spacing-md;
    background: rgba(0, 0, 0, 0.5);
    padding: $spacing-sm;
    border-radius: $radius-lg;

    .nav-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all $transition-normal;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .photo-controls {
    position: absolute;
    bottom: 40px;
    right: 40px;

    .photo-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3B82F6;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all $transition-normal;

      &:hover {
        background: #2563EB;
        transform: scale(1.1);
      }

      .van-icon {
        font-size: 1.5rem;
      }
    }
  }

  .touch-hint {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    color: white;
    font-size: 0.85rem;
    text-align: center;
  }
}

.hotspot-info {
  padding: $spacing-lg;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: $spacing-md;
  }

  p {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
  }

  .hotspot-actions {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: $mobile) {
  .scenes-grid {
    grid-template-columns: 1fr;
    padding: 0 $spacing-md;
  }

  .scene-card {
    .scene-image {
      height: 150px;
    }
  }

  .navigation-controls {
    bottom: 80px;
  }

  .photo-controls {
    bottom: 20px;
    right: 20px;

    .photo-btn {
      width: 50px;
      height: 50px;
    }
  }
}
</style>