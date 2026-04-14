<template>
  <div class="profile-view">
    <!-- 返回首页按钮 -->
    <BackButton to="/" text="返回首页" icon="home" />

    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="user-avatar-section">
        <div class="avatar-container">
          <img :src="userStore.avatar || '/assets/images/default-avatar.png'"
               :alt="userStore.nickname"
               class="user-avatar">
          <van-icon name="camera" size="20" class="avatar-edit" />
        </div>
        <div class="user-info">
          <h2>{{ userStore.nickname }}</h2>
          <p class="user-level">Lv.{{ userStore.level }} - {{ userStore.levelName }}</p>
        </div>
      </div>

      <div class="user-stats">
        <div class="stat-item">
          <van-icon name="gem" size="24" color="#FFD700" />
          <div>
            <p class="stat-value">{{ userStore.points }}</p>
            <p class="stat-label">积分</p>
          </div>
        </div>
        <div class="stat-item">
          <van-icon name="trophy" size="24" color="#FF6B6B" />
          <div>
            <p class="stat-value">{{ userStore.unlockedBadges.length }}</p>
            <p class="stat-label">成就</p>
          </div>
        </div>
        <div class="stat-item">
          <van-icon name="book" size="24" color="#3B82F6" />
          <div>
            <p class="stat-value">{{ knowledgeCompletion }}%</p>
            <p class="stat-label">知识完成度</p>
          </div>
        </div>
        <div class="stat-item">
          <van-icon name="location" size="24" color="#10B981" />
          <div>
            <p class="stat-value">{{ visitedScenesCount }}</p>
            <p class="stat-label">景点访问</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="profile-content">
      <!-- 学习进度 -->
      <div class="progress-section">
        <h3>学习进度</h3>
        <div class="progress-card">
          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="book" size="20" />
              <span>知识点学习</span>
            </div>
            <div class="progress-bar-container">
              <van-progress :percentage="knowledgeCompletion" stroke-width="8" color="#3B82F6" />
              <span class="progress-text">{{ knowledgeCompletion }}%</span>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="trophy" size="20" />
              <span>成就解锁</span>
            </div>
            <div class="progress-bar-container">
              <van-progress :percentage="achievementProgress" stroke-width="8" color="#FFD700" />
              <span class="progress-text">{{ achievementProgress }}%</span>
            </div>
          </div>

          <div class="progress-item">
            <div class="progress-label">
              <van-icon name="location" size="20" />
              <span>景点探索</span>
            </div>
            <div class="progress-bar-container">
              <van-progress :percentage="sceneProgress" stroke-width="8" color="#10B981" />
              <span class="progress-text">{{ sceneProgress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 成就展示 -->
      <div class="achievements-section">
        <h3>我的成就</h3>
        <div class="badges-grid">
          <div v-for="badge in displayedBadges"
               :key="badge.id"
               class="badge-item"
               :class="{ 'unlocked': badge.unlocked }">
            <van-icon :name="getBadgeIcon(badge.id)" size="32" />
            <p class="badge-name">{{ badge.title }}</p>
            <p class="badge-date" v-if="badge.unlocked">{{ formatDate(badge.unlockedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="actions-section">
        <h3>快捷操作</h3>
        <div class="action-grid">
          <van-button type="primary" block @click="goToKnowledge">
            继续学习
          </van-button>
          <van-button type="primary" block @click="goToScenes">
            继续探索
          </van-button>
          <van-button type="primary" block @click="goToGames">
            参与挑战
          </van-button>
          <van-button type="primary" block @click="goToSettings">
            个人设置
          </van-button>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="bottom-nav">
        <van-tabbar v-model="activeTab" route>
          <van-tabbar-item icon="home" to="/home">首页</van-tabbar-item>
          <van-tabbar-item icon="book" to="/knowledge">知识</van-tabbar-item>
          <van-tabbar-item icon="photo" to="/scenes">美景</van-tabbar-item>
          <van-tabbar-item icon="trophy" to="/games">游戏</van-tabbar-item>
          <van-tabbar-item icon="user" to="/profile">我的</van-tabbar-item>
        </van-tabbar>
      </div>
    </div>

    <!-- 设置模态框 -->
    <van-popup
      v-model:show="showSettings"
      position="bottom"
      :style="{ height: '80%' }"
      round
      closeable>

      <div class="settings-container">
        <h3>个人设置</h3>

        <div class="settings-group">
          <h4>通用设置</h4>
          <van-cell-group>
            <van-cell title="昵称" :value="userStore.nickname">
              <template #right-icon>
                <van-icon name="edit" />
              </template>
            </van-cell>
            <van-cell title="等级" :value="userStore.levelName" />
            <van-cell title="积分" :value="userStore.points" />
          </van-cell-group>
        </div>

        <div class="settings-group">
          <h4>音效设置</h4>
          <van-cell-group>
            <van-cell title="背景音乐" :value="userStore.settings.musicEnabled ? '开启' : '关闭'">
              <template #right-icon>
                <van-switch v-model="userStore.settings.musicEnabled" />
              </template>
            </van-cell>
            <van-cell title="音效" :value="userStore.settings.soundEnabled ? '开启' : '关闭'">
              <template #right-icon>
                <van-switch v-model="userStore.settings.soundEnabled" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <div class="settings-group">
          <h4>通知设置</h4>
          <van-cell-group>
            <van-cell title="推送通知" :value="userStore.settings.notificationsEnabled ? '开启' : '关闭'">
              <template #right-icon>
                <van-switch v-model="userStore.settings.notificationsEnabled" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <div class="settings-group">
          <h4>其他设置</h4>
          <van-cell-group>
            <van-cell title="深色模式" :value="userStore.settings.darkMode ? '开启' : '关闭'">
              <template #right-icon>
                <van-switch v-model="userStore.settings.darkMode" />
              </template>
            </van-cell>
            <van-cell title="清除缓存" @click="clearCache">
              <template #right-icon>
                <van-icon name="delete" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <div class="settings-actions">
          <van-button type="primary" block @click="saveSettings">保存设置</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()

// 确保用户store已初始化
onMounted(() => {
  if (!userStore.id) {
    userStore.initializeUser()
  }
})

// 状态
const showSettings = ref(false)

// 计算属性
const knowledgeCompletion = computed(() => userStore.knowledgeCompletion)
const visitedScenesCount = computed(() => userStore.visitedScenesCount)
const achievementProgress = computed(() => {
  const totalAchievements = 20 // 总成就数
  const unlockedCount = userStore.unlockedBadges.length
  return Math.round((unlockedCount / totalAchievements) * 100)
})
const sceneProgress = computed(() => {
  const totalScenes = 5 // 总场景数
  const visitedCount = userStore.scenesVisited.length
  return Math.round((visitedCount / totalScenes) * 100)
})

// 显示的成就（最近3个）
const displayedBadges = computed(() => {
  return userStore.unlockedBadges.slice(-3)
})

// 方法
const getBadgeIcon = (badgeId) => {
  const icons = {
    level_up: 'gem',
    knowledge_explorer: 'book',
    scene_visitor: 'location',
    game_master: 'trophy',
    knowledge_start: 'lightbulb',
    knowledge_intermediate: 'book-open',
    knowledge_expert: 'award',
    scene_explorer: 'compass',
    scene_master: 'star',
    login_3: 'clock',
    login_7: 'calendar',
    login_30: 'medal',
    quiz_expert: 'question-circle'
  }
  return icons[badgeId] || 'star'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const goToKnowledge = () => {
  router.push('/knowledge')
}

const goToScenes = () => {
  router.push('/scenes')
}

const goToGames = () => {
  router.push('/games')
}

const goToSettings = () => {
  showSettings.value = true
}

const saveSettings = () => {
  userStore.updateSettings(userStore.settings)
  showToast('设置已保存')
  showSettings.value = false
}

const clearCache = () => {
  if (confirm('确定要清除缓存吗？这将重置部分用户数据。')) {
    localStorage.clear()
    userStore.createUser()
    showToast('缓存已清除，用户数据已重置')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.profile-view {
  min-height: 100vh;
  padding: $spacing-xl 0;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
}

.profile-header {
  text-align: center;
  padding: 0 $spacing-xl $spacing-lg;
  margin-bottom: $spacing-lg;

  .user-avatar-section {
    margin-bottom: $spacing-lg;

    .avatar-container {
      position: relative;
      display: inline-block;
      margin-bottom: $spacing-sm;

      .user-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.3);
        object-fit: cover;
      }

      .avatar-edit {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        padding: 8px;
        cursor: pointer;
      }
    }

    .user-info {
      h2 {
        font-size: 2rem;
        color: white;
        margin-bottom: $spacing-xs;
      }

      .user-level {
        font-size: 1.1rem;
        color: $text-secondary;
      }
    }
  }

  .user-stats {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    flex-wrap: wrap;

    .stat-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      background: rgba(255, 255, 255, 0.1);
      border-radius: $radius-md;
      color: white;

      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }
}

.profile-content {
  padding: 0 $spacing-xl;
}

.progress-section {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  .progress-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: $radius-lg;
    padding: $spacing-lg;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .progress-item {
      margin-bottom: $spacing-lg;

      &:last-child {
        margin-bottom: 0;
      }

      .progress-label {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-sm;
        color: white;

        .van-icon {
          color: $accent-blue;
        }
      }

      .progress-bar-container {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        .progress-text {
          font-size: 1.1rem;
          font-weight: bold;
          color: white;
          min-width: 50px;
          text-align: right;
        }
      }
    }
  }
}

.achievements-section {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: $radius-lg;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .badge-item {
      text-align: center;
      padding: $spacing-sm;
      transition: all $transition-normal;

      &.unlocked {
        .van-icon {
          color: #FFD700;
        }

        .badge-name {
          color: white;
        }

        .badge-date {
          color: $text-secondary;
          font-size: 0.8rem;
        }
      }

      .van-icon {
        font-size: 2.5rem;
        color: rgba(255, 255, 255, 0.3);
        margin-bottom: $spacing-xs;
      }

      .badge-name {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: $spacing-xs;
      }
    }
  }
}

.actions-section {
  margin-bottom: $spacing-xl;

  h3 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }
}

.settings-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: $spacing-lg;
    text-align: center;
  }

  .settings-group {
    margin-bottom: $spacing-lg;

    h4 {
      font-size: 1.2rem;
      color: white;
      margin-bottom: $spacing-md;
      padding: 0 $spacing-md;
    }

    .van-cell {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .van-cell__title {
        color: white;
      }

      .van-cell__value {
        color: $text-secondary;
      }
    }
  }

  .settings-actions {
    margin-top: auto;
    padding: $spacing-lg;
  }
}

@media (max-width: $mobile) {
  .profile-header {
    .user-avatar {
      width: 100px;
      height: 100px;
    }

    .user-info h2 {
      font-size: 1.5rem;
    }

    .user-level {
      font-size: 1rem;
    }

  .progress-section h3 {
    font-size: 1.2rem;
  }

  .achievements-section h3 {
    font-size: 1.2rem;
  }

  .actions-section h3 {
    font-size: 1.2rem;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>