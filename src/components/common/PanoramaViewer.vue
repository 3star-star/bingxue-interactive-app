<template>
  <transition name="panorama-fade">
    <div v-if="visible" class="panorama-viewer" @click.self="handleClose">
      <div class="panorama-container">
        <!-- 顶部工具栏 -->
        <div class="panorama-header">
          <div class="header-info">
            <h2>{{ sceneName }}</h2>
            <p>{{ currentImage?.title || '' }}</p>
          </div>
          <van-icon name="cross" size="28" class="close-btn" @click="handleClose" />
        </div>

        <!-- 主图片显示区 -->
        <div class="panorama-main">
          <transition name="slide-fade" mode="out-in">
            <div :key="currentIndex" class="image-wrapper">
              <img
                :src="currentImage?.url || ''"
                :alt="currentImage?.title || ''"
                class="panorama-image"
                @error="handleImageError"
              >
              <div class="image-overlay">
                <div class="image-title">{{ currentImage?.title || '' }}</div>
                <div class="image-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
              </div>
            </div>
          </transition>

          <!-- 左右切换按钮 -->
          <div class="nav-btn nav-btn-left" @click="prevImage">
            <van-icon name="arrow-left" size="32" />
          </div>
          <div class="nav-btn nav-btn-right" @click="nextImage">
            <van-icon name="arrow" size="32" />
          </div>
        </div>

        <!-- 底部缩略图 -->
        <div class="panorama-thumbnails">
          <div class="thumbnails-wrapper">
            <div
              v-for="(img, index) in images"
              :key="index"
              class="thumbnail-item"
              :class="{ active: index === currentIndex }"
              @click="goToImage(index)"
            >
              <img :src="img.url" :alt="img.title">
              <div class="thumbnail-overlay">
                <span>{{ img.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作提示 -->
        <div class="panorama-tips">
          <span>👆 点击缩略图切换视角</span>
          <span>👈👉 左右滑动查看全景</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  sceneName: {
    type: String,
    default: '全景体验'
  }
})

const emit = defineEmits(['update:visible', 'close'])

const currentIndex = ref(0)
let touchStartX = 0
let touchEndX = 0

const currentImage = computed(() => {
  return props.images[currentIndex.value] || { url: '', title: '' }
})

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    showToast({
      message: `${currentImage.value.title}`,
      duration: 1000,
      position: 'top'
    })
  } else {
    currentIndex.value = 0
    showToast({
      message: '已回到第一张',
      duration: 1000,
      position: 'top'
    })
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showToast({
      message: `${currentImage.value.title}`,
      duration: 1000,
      position: 'top'
    })
  } else {
    currentIndex.value = props.images.length - 1
    showToast({
      message: '已到最后一张',
      duration: 1000,
      position: 'top'
    })
  }
}

const goToImage = (index) => {
  currentIndex.value = index
  showToast({
    message: `${currentImage.value.title}`,
    duration: 1000,
    position: 'top'
  })
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  currentIndex.value = 0
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80'
}

// 触摸滑动支持
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  touchEndX = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
}

// 键盘支持
const handleKeydown = (e) => {
  if (!props.visible) return

  if (e.key === 'ArrowLeft') {
    prevImage()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  } else if (e.key === 'Escape') {
    handleClose()
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    showToast({
      message: '🌐 进入全景模式',
      duration: 1500
    })
  } else {
    document.body.style.overflow = ''
    currentIndex.value = 0
  }
})

onMounted(() => {
  const container = document.querySelector('.panorama-main')
  if (container) {
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  const container = document.querySelector('.panorama-main')
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.panorama-viewer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.panorama-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.panorama-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;

  .header-info {
    flex: 1;

    h2 {
      font-size: 1.3rem;
      color: white;
      font-weight: 600;
      margin-bottom: 4px;
    }

    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .close-btn {
    color: white;
    cursor: pointer;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: all 0.3s;

    &:active {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(0.95);
    }
  }
}

.panorama-main {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: pan-y;

  .image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .panorama-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }

  .image-overlay {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.6);
    padding: 12px 24px;
    border-radius: 20px;
    backdrop-filter: blur(10px);

    .image-title {
      font-size: 1.1rem;
      color: white;
      font-weight: 600;
    }

    .image-counter {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    backdrop-filter: blur(5px);
    color: white;

    &:active {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(0.9);
    }

    &.nav-btn-left {
      left: 20px;
    }

    &.nav-btn-right {
      right: 20px;
    }
  }
}

.panorama-thumbnails {
  padding: 16px 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;

  .thumbnails-wrapper {
    display: flex;
    gap: 12px;
    padding: 0 20px;
    overflow-x: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }
  }

  .thumbnail-item {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    transition: all 0.3s;

    &.active {
      border-color: #3B82F6;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
      display: flex;
      align-items: flex-end;
      padding: 4px;
      opacity: 0;
      transition: opacity 0.3s;

      span {
        font-size: 0.7rem;
        color: white;
        font-weight: 500;
      }
    }

    &:hover .thumbnail-overlay {
      opacity: 1;
    }
  }
}

.panorama-tips {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  animation: fadeInOut 4s ease-in-out;
  pointer-events: none;

  span {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

.panorama-fade-enter-active,
.panorama-fade-leave-active {
  transition: opacity 0.4s ease;
}

.panorama-fade-enter-from,
.panorama-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}

.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .panorama-tips {
    flex-direction: column;
    gap: 4px;
    top: 70px;
  }

  .nav-btn {
    width: 40px !important;
    height: 40px !important;

    &.nav-btn-left {
      left: 10px !important;
    }

    &.nav-btn-right {
      right: 10px !important;
    }
  }
}
</style>
