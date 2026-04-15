<template>
  <div class="collection-view">
    <BackButton to="/profile" text="返回个人中心" />

    <div class="page-header">
      <h2>我的收藏</h2>
      <p>管理你的冰雪知识与美景记录</p>
    </div>

    <div class="tabs-wrap">
      <van-tabs v-model:active="activeTab" color="#3B82F6" title-active-color="white" background="transparent">
        <van-tab title="知识点" name="knowledge" />
        <van-tab title="景点" name="scenes" />
        <van-tab title="成就" name="achievements" />
      </van-tabs>
    </div>

    <!-- 知识点 -->
    <div v-if="activeTab === 'knowledge'" class="tab-content">
      <div v-if="collectedKnowledge.length > 0" class="items-list">
        <div v-for="item in collectedKnowledge" :key="item.id" class="item-card">
          <div class="item-left">
            <van-icon name="bookmark" color="#FFD700" size="22" />
          </div>
          <div class="item-body">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-sub">{{ item.category }} · 已完成</p>
          </div>
          <van-button size="mini" type="danger" plain @click.stop="removeKnowledge(item.id)">移除</van-button>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="bookmark-o" size="52" color="rgba(255,255,255,0.3)" />
        <p>暂无已完成的知识点</p>
        <van-button type="primary" size="small" @click="router.push('/knowledge')">去探索</van-button>
      </div>
    </div>

    <!-- 景点 -->
    <div v-if="activeTab === 'scenes'" class="tab-content">
      <div v-if="collectedScenes.length > 0" class="items-list">
        <div v-for="item in collectedScenes" :key="item.id" class="item-card" @click="viewScene(item)">
          <div class="item-left">
            <van-icon name="location" color="#10B981" size="22" />
          </div>
          <div class="item-body">
            <p class="item-title">{{ item.name }}</p>
            <p class="item-sub">{{ item.location }}</p>
          </div>
          <div class="item-actions">
            <van-button size="mini" type="primary" plain @click.stop="viewScene(item)">查看</van-button>
            <van-button size="mini" type="danger" plain @click.stop="removeScene(item.id)">移除</van-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="photo-o" size="52" color="rgba(255,255,255,0.3)" />
        <p>暂无访问过的景点</p>
        <van-button type="primary" size="small" @click="router.push('/scenes')">去探索</van-button>
      </div>
    </div>

    <!-- 成就 -->
    <div v-if="activeTab === 'achievements'" class="tab-content">
      <div v-if="collectedAchievements.length > 0" class="items-list">
        <div v-for="item in collectedAchievements" :key="item.id + item.unlockedAt" class="item-card">
          <div class="item-left">
            <van-icon :name="getBadgeIcon(item.id)" color="#FFD700" size="22" />
          </div>
          <div class="item-body">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-sub">{{ formatDate(item.unlockedAt) }}</p>
          </div>
          <van-button size="mini" type="warning" plain @click="shareAchievement(item)">分享</van-button>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="trophy-o" size="52" color="rgba(255,255,255,0.3)" />
        <p>暂无解锁的成就</p>
        <van-button type="primary" size="small" @click="router.push('/games')">去挑战</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { scenesData } from '@/data/scenesData'
import { knowledgeData } from '@/data/knowledgeData'
import { showToast } from 'vant'
import BackButton from '@/components/common/BackButton.vue'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('knowledge')

const collectedKnowledge = computed(() => {
  return Object.entries(userStore.knowledgeProgress)
    .filter(([, progress]) => progress >= 100)
    .map(([id]) => knowledgeData.find(k => k.id === parseInt(id)))
    .filter(Boolean)
})

const collectedScenes = computed(() => {
  return userStore.scenesVisited
    .map(id => scenesData.find(s => s.id === id))
    .filter(Boolean)
})

const collectedAchievements = computed(() => userStore.unlockedBadges)

const getBadgeIcon = (badgeId) => {
  const icons = {
    level_up: 'gem', knowledge_explorer: 'book', scene_visitor: 'location',
    game_master: 'trophy', knowledge_start: 'bulb', knowledge_intermediate: 'notes',
    knowledge_expert: 'award', scene_explorer: 'map', scene_master: 'star',
    login_3: 'clock', login_7: 'calendar', login_30: 'medal'
  }
  return icons[badgeId] || 'star'
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const viewScene = (scene) => {
  router.push({ name: 'SceneDetail', query: { sceneId: scene.id } })
}

const removeKnowledge = (id) => {
  userStore.knowledgeProgress[id] = 0
  userStore.saveToLocalStorage()
  showToast('已移除')
}

const removeScene = (id) => {
  const idx = userStore.scenesVisited.indexOf(id)
  if (idx > -1) {
    userStore.scenesVisited.splice(idx, 1)
    userStore.saveToLocalStorage()
  }
  showToast('已移除')
}

const shareAchievement = (achievement) => {
  showToast(`已分享：${achievement.title}`)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.collection-view {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
  padding-bottom: 40px;
}

.page-header {
  text-align: center;
  padding: 70px $spacing-xl $spacing-lg;

  h2 {
    font-size: 1.8rem;
    color: white;
    margin-bottom: 6px;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
  }
}

.tabs-wrap {
  margin: 0 $spacing-lg $spacing-lg;

  :deep(.van-tabs__wrap) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  :deep(.van-tab) {
    color: rgba(255, 255, 255, 0.6);
  }

  :deep(.van-tab--active) {
    color: white;
  }
}

.tab-content {
  padding: 0 $spacing-lg;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:active {
    background: rgba(255, 255, 255, 0.14);
  }

  .item-left {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }

  .item-body {
    flex: 1;
    min-width: 0;

    .item-title {
      font-size: 0.95rem;
      color: white;
      font-weight: 500;
      margin-bottom: 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-sub {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .item-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
