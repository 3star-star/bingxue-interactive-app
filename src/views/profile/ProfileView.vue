<template>
  <div class="profile-view">
    <BackButton to="/" text="返回首页" icon="home" />

    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar-wrap">
          <img
            :src="userStore.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=ice'"
            :alt="userStore.nickname"
            class="user-avatar"
          >
        </div>
        <div class="user-info">
          <h2>{{ userStore.nickname }}</h2>
          <p class="user-level">Lv.{{ userStore.level }} · {{ userStore.levelName }}</p>
          <p class="login-streak" v-if="userStore.loginStreak > 1">
            🔥 连续登录 {{ userStore.loginStreak }} 天
          </p>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ userStore.points }}</span>
          <span class="stat-label">积分</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.unlockedBadges.length }}</span>
          <span class="stat-label">成就</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.visitedScenesCount }}/5</span>
          <span class="stat-label">景点</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.knowledgeCompletion }}%</span>
          <span class="stat-label">知识</span>
        </div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="profile-content">

      <!-- 学习进度 -->
      <div class="card">
        <h3 class="card-title">学习进度</h3>
        <div class="progress-list">
          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="book" color="#3B82F6" />
              <span>知识学习</span>
              <span class="progress-pct">{{ userStore.knowledgeCompletion }}%</span>
            </div>
            <van-progress :percentage="userStore.knowledgeCompletion" stroke-width="6" color="#3B82F6" :show-pivot="false" />
          </div>
          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="location" color="#10B981" />
              <span>景点探索</span>
              <span class="progress-pct">{{ sceneProgress }}%</span>
            </div>
            <van-progress :percentage="sceneProgress" stroke-width="6" color="#10B981" :show-pivot="false" />
          </div>
          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="trophy" color="#F59E0B" />
              <span>成就解锁</span>
              <span class="progress-pct">{{ achievementProgress }}%</span>
            </div>
            <van-progress :percentage="achievementProgress" stroke-width="6" color="#F59E0B" :show-pivot="false" />
          </div>
        </div>
      </div>

      <!-- 最近成就 -->
      <div class="card">
        <h3 class="card-title">
          最近成就
          <span class="card-action" @click="goToCollections">全部 →</span>
        </h3>
        <div v-if="userStore.unlockedBadges.length > 0" class="badges-list">
          <div v-for="badge in recentBadges" :key="badge.id + badge.unlockedAt" class="badge-item">
            <div class="badge-icon">
              <van-icon :name="getBadgeIcon(badge.id)" size="24" color="#FFD700" />
            </div>
            <div class="badge-info">
              <p class="badge-title">{{ badge.title }}</p>
              <p class="badge-date">{{ formatDate(badge.unlockedAt) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-hint">
          <p>暂无成就，去探索获得第一个成就吧！</p>
        </div>
      </div>

      <!-- 快捷导航 -->
      <div class="card">
        <h3 class="card-title">快捷导航</h3>
        <div class="action-grid">
          <div class="action-btn" @click="router.push('/knowledge')">
            <van-icon name="book" size="28" color="#3B82F6" />
            <span>继续学习</span>
          </div>
          <div class="action-btn" @click="router.push('/scenes')">
            <van-icon name="photo" size="28" color="#10B981" />
            <span>美景探索</span>
          </div>
          <div class="action-btn" @click="router.push('/games')">
            <van-icon name="trophy" size="28" color="#F59E0B" />
            <span>游戏挑战</span>
          </div>
          <div class="action-btn" @click="goToCollections">
            <van-icon name="star" size="28" color="#8B5CF6" />
            <span>我的收藏</span>
          </div>
          <div class="action-btn" @click="goToSettings">
            <van-icon name="setting" size="28" color="#6B7280" />
            <span>个人设置</span>
          </div>
          <div class="action-btn danger" @click="confirmReset">
            <van-icon name="delete" size="28" color="#EF4444" />
            <span>重置数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast, showConfirmDialog } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

const sceneProgress = computed(() => Math.round((userStore.visitedScenesCount / 5) * 100))
const achievementProgress = computed(() => Math.round((userStore.unlockedBadges.length / 10) * 100))
const recentBadges = computed(() => userStore.unlockedBadges.slice(-3).reverse())

const getBadgeIcon = (badgeId) => {
  const icons = {
    level_up: 'gem',
    knowledge_explorer: 'book',
    scene_visitor: 'location',
    game_master: 'trophy',
    knowledge_start: 'bulb',
    knowledge_intermediate: 'notes',
    knowledge_expert: 'award',
    scene_explorer: 'map',
    scene_master: 'star',
    login_3: 'clock',
    login_7: 'calendar',
    login_30: 'medal'
  }
  return icons[badgeId] || 'star'
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const goToCollections = () => router.push('/profile/collections')
const goToSettings = () => router.push('/profile/settings')

const confirmReset = () => {
  showConfirmDialog({
    title: '重置数据',
    message: '确定要重置所有用户数据吗？此操作不可恢复。'
  }).then(() => {
    localStorage.clear()
    userStore.createUser()
    showToast('数据已重置')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.profile-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  padding-bottom: 40px;
}

.profile-header {
  padding: 70px $spacing-xl $spacing-lg;
  text-align: center;

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $spacing-lg;

    .avatar-wrap {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.4);
      overflow: hidden;
      margin-bottom: $spacing-md;
      background: rgba(255,255,255,0.1);

      .user-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-info {
      h2 {
        font-size: 1.6rem;
        color: white;
        margin-bottom: 4px;
      }

      .user-level {
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 4px;
      }

      .login-streak {
        font-size: 0.85rem;
        color: #FCD34D;
      }
    }
  }

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.12);
    border-radius: $radius-lg;
    padding: $spacing-md 0;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .stat-value {
        font-size: 1.4rem;
        font-weight: bold;
        color: white;
      }

      .stat-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.65);
      }
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.profile-content {
  padding: 0 $spacing-lg;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: $radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;

  .card-title {
    font-size: 1.1rem;
    color: white;
    font-weight: 600;
    margin-bottom: $spacing-md;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-action {
      font-size: 0.85rem;
      color: #93C5FD;
      cursor: pointer;
      font-weight: normal;
    }
  }
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  .progress-item {
    .progress-label {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      margin-bottom: 6px;
      color: white;
      font-size: 0.9rem;

      .progress-pct {
        margin-left: auto;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.badges-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  .badge-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
    background: rgba(255, 255, 255, 0.08);
    border-radius: $radius-md;

    .badge-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 215, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .badge-info {
      .badge-title {
        font-size: 0.95rem;
        color: white;
        font-weight: 500;
      }

      .badge-date {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
      }
    }
  }
}

.empty-hint {
  text-align: center;
  padding: $spacing-lg 0;

  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md $spacing-sm;
    background: rgba(255, 255, 255, 0.08);
    border-radius: $radius-md;
    cursor: pointer;
    transition: all 0.2s;

    &:hover, &:active {
      background: rgba(255, 255, 255, 0.18);
      transform: scale(0.97);
    }

    &.danger:hover, &.danger:active {
      background: rgba(239, 68, 68, 0.15);
    }

    span {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

@media (max-width: 480px) {
  .action-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
