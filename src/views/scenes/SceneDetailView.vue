<template>
  <div class="scene-detail-view">
    <!-- 顶部导航栏 -->
    <div class="detail-header">
      <van-icon
        name="arrow-left"
        size="24"
        @click="goBack"
        class="back-btn"
      />
      <h1>{{ scene.name }}</h1>
      <van-icon
        name="home"
        size="24"
        @click="goHome"
        class="home-btn"
      />
    </div>

    <!-- 场景图片展示 -->
    <div class="scene-image-container">
      <img
        :src="getSceneImage(scene.id)"
        :alt="scene.name"
        class="scene-image"
      >
      <div class="image-overlay">
        <div class="location-info">
          <van-icon name="location" size="16" />
          <span>{{ scene.location }}</span>
        </div>
      </div>
    </div>

    <!-- 场景信息 -->
    <div class="scene-info">
      <h2>景点介绍</h2>
      <p class="description">{{ scene.description }}</p>

      <!-- 景点特色 -->
      <div class="features">
        <h3>景点特色</h3>
        <div class="feature-list">
          <div v-for="feature in scene.features"
               :key="feature"
               class="feature-item">
            <van-icon name="star" size="16" />
            <span>{{ feature }}</span>
          </div>
        </div>
      </div>

      <!-- 景点数据 -->
      <div class="scene-stats">
        <div class="stat-item">
          <van-icon name="map-marked" size="20" />
          <span>景点数量: {{ scene.hotspots.length }}个</span>
        </div>
        <div class="stat-item">
          <van-icon name="music" size="20" />
          <span>背景音效: {{ getSoundName(scene.ambientSound) }}</span>
        </div>
        <div class="stat-item">
          <van-icon name="photo" size="20" />
          <span>最佳拍摄时间: {{ scene.bestTime }}</span>
        </div>
      </div>

      <!-- 访问记录 -->
      <div class="visit-record" v-if="isSceneVisited(scene.id)">
        <van-icon name="passed" size="20" />
        <span>已访问</span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-actions">
      <van-button
        type="primary"
        block
        @click="enterPanorama"
        size="large"
      >
        进入全景体验
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { scenesData, ambientSounds } from '@/data/scenesData'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const scene = ref(null)

// 获取场景图片
const getSceneImage = (sceneId) => {
  return `/assets/images/scenes/${sceneId}.jpg`
}

// 获取音效名称
const getSoundName = (soundType) => {
  return ambientSounds[soundType]?.name || '无'
}

// 检查是否已访问场景
const isSceneVisited = (sceneId) => {
  return userStore.scenesVisited.includes(sceneId)
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 进入全景体验
const enterPanorama = () => {
  router.push({
    name: 'Scenes',
    query: { sceneId: scene.value.id }
  })
}

// 组件挂载时获取场景数据
onMounted(() => {
  const sceneId = router.currentRoute.value.query.sceneId
  if (sceneId) {
    scene.value = scenesData.find(s => s.id === sceneId)
    if (scene.value) {
      // 记录访问
      userStore.visitScene(scene.value.id)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.scene-detail-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding-bottom: $spacing-xl;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md $spacing-xl;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    font-size: 1.5rem;
    margin: 0 $spacing-md;
  }

  .back-btn, .home-btn {
    color: white;
    cursor: pointer;
  }
}

.scene-image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
  margin: $spacing-lg 0;

  .scene-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-md;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
    color: white;

    .location-info {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: 0.9rem;
    }
  }
}

.scene-info {
  padding: 0 $spacing-xl;
  margin-bottom: $spacing-lg;

  h2 {
    font-size: 1.5rem;
    margin-bottom: $spacing-md;
    color: white;
  }

  .description {
    font-size: 1rem;
    line-height: 1.6;
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }

  .features {
    margin-bottom: $spacing-lg;

    h3 {
      font-size: 1.2rem;
      margin-bottom: $spacing-md;
      color: white;
    }

    .feature-list {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;

      .feature-item {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xs $spacing-md;
        background: rgba(255, 255, 255, 0.1);
        border-radius: $radius-md;
        font-size: 0.9rem;
      }
    }
  }

  .scene-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    .stat-item {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $radius-md;
      font-size: 0.9rem;
    }
  }

  .visit-record {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-md;
    background: #10B981;
    color: white;
    border-radius: $radius-md;
    font-size: 0.9rem;
  }
}

.bottom-actions {
  padding: 0 $spacing-xl $spacing-xl;
}
</style>